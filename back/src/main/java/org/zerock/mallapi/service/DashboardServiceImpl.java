package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.DashboardRepository;
import org.zerock.mallapi.repository.OrderPaymentRepository;
import org.zerock.mallapi.repository.OrderRepository;
import org.zerock.mallapi.repository.PaymentRepository;
import org.zerock.mallapi.util.GeneralException;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class DashboardServiceImpl implements DashboardService{


  private final OrderService orderService;


  @Override
  public ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO) {

    List<Object[]> results = orderService.getSalesOverview(chartRequestDTO);

    List<String> xaxisList = new ArrayList<>();

    List<Long> seriesData = new ArrayList<>();

    log.info("orders.... " + results);

    for (Object[] result : results) {
      LocalDate date = (LocalDate) result[0];  // 날짜
      Long totalSales = (Long) result[1];  // 총 매출

      xaxisList.add(date.toString());
      seriesData.add(totalSales);

    }

    ChartResponseDTO chartResponseDTO = ChartResponseDTO.builder()
            .startDate(chartRequestDTO.getStartDate())
            .endDate(chartRequestDTO.getEndDate())
            .filter("day")
            .xaxis(xaxisList)
//            .series()
            .build();




    return chartResponseDTO;
  }


}
