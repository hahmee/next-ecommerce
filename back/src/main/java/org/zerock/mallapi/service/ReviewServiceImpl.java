package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.PaymentRepository;
import org.zerock.mallapi.repository.ProductRepository;
import org.zerock.mallapi.repository.ReviewRepository;
import org.zerock.mallapi.util.GeneralException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService{

  private final ReviewRepository reviewRepository;

  private final PaymentService paymentService;

  private final MemberService memberService;

  private final OrderService orderService;

  @Override
  public void register(ReviewDTO reviewDTO, String email) {

    //리뷰 쓴 사람은 -> 구매를 했는지 확인하고 ..
    PaymentDTO paymentDTO = paymentService.getByEmailAndOrderId(email, reviewDTO.getOrderId());


    //결제 완료된게 아니라면 리뷰 남길 수 없쯤!
    if(paymentDTO.getStatus() != TossPaymentStatus.DONE) {
      throw new GeneralException(ErrorCode.BAD_REQUEST, "결제 완료가 되지 않았습니다.");
    }

    //이미 리뷰 달았다면 또 달 수 없다..
    Optional<Review> result = reviewRepository.findByOid(reviewDTO.getOid());

    result.ifPresent(review -> {
      throw new GeneralException(ErrorCode.BAD_REQUEST, "이미 리뷰를 달았습니다.");
    });


    Review review = dtoToEntity(reviewDTO, email);

    reviewRepository.save(review);


  }

  @Override
  public List<ReviewDTO> getList(Long pno) {

    List<Review> reviews = reviewRepository.findAllByPno(pno);

    List<ReviewDTO> responseDTO = reviews.stream().map(this::convertToDTO).collect(Collectors.toList());

    return responseDTO;
  }

  @Override
  public List<ReviewDTO> getMyList(String email) {


    List<Review> reviews = reviewRepository.findAllByEmail(email);

    List<ReviewDTO> responseDTO = reviews.stream().map(this::convertToDTO).collect(Collectors.toList());

    log.info("responseDTO..." + responseDTO);
    return responseDTO;
  }


  private ReviewDTO convertToDTO(Review review) {

    MemberDTO memberDTO = memberService.entityToDTO(review.getOwner());

    OrderDTO orderDTO = orderService.convertToDTO(review.getOrder());

    ReviewDTO reviewDTO = ReviewDTO.builder()
            .content(review.getContent())
            .oid(review.getOrder().getId())
            .rating(review.getRating())
            .orderId(review.getOrderId())
            .rno(review.getRno())
            .order(orderDTO)
            .pno(review.getProduct().getPno())
            .owner(memberDTO)
            .build();

    reviewDTO.setCreatedAt(review.getCreatedAt());
    reviewDTO.setUpdatedAt(review.getUpdatedAt());

    return reviewDTO;

  }

  private Review dtoToEntity(ReviewDTO reviewDTO, String email){

    Member member = Member.builder().email(email).build();
    Product product = Product.builder().pno(reviewDTO.getPno()).build();
    Order order = Order.builder().id(reviewDTO.getOid()).build();

    Review review = Review.builder()
            .rating(reviewDTO.getRating())
            .product(product)
            .content(reviewDTO.getContent())
            .orderId(reviewDTO.getOrderId())
            .order(order)
            .owner(member)
            .build();

    review.setCreatedAt(LocalDateTime.now());
    review.setUpdatedAt(LocalDateTime.now());


    return review;

  }
}
