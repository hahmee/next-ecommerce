package org.zerock.mallapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.ProductService;
import org.zerock.mallapi.util.AwsFileUtil;
import org.zerock.mallapi.util.CustomFileUtil;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/products")
public class ProductController {

  private final ProductService productService; //ProductServcie 주입 
  private final CustomFileUtil fileUtil;
  private final AwsFileUtil awsFileUtil;
  private final String PRODUCT_IMG_DIR = "product";

  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
  @PostMapping("/")
  public DataResponseDTO<ProductDTO> register(@Valid ProductDTO productDTO, @AuthenticationPrincipal UserDetails userDetails) {


    List<FileDTO<MultipartFile>> files = productDTO.getFiles();//파일 객체들

    if (files != null && files.size() > 0) {

      Map<String, List<FileDTO<String>>> awsResults = awsFileUtil.uploadFiles(files, PRODUCT_IMG_DIR);//AWS에 저장

      List<FileDTO<String>> uploadFileNames = awsResults.get("uploadNames");
      List<FileDTO<String>> uploadFileKeys = awsResults.get("uploadKeys");


      productDTO.setUploadFileNames(uploadFileNames);
      productDTO.setUploadFileKeys(uploadFileKeys);
    }

    //서비스 호출 
    ProductDTO result = productService.register(productDTO, userDetails);


    return DataResponseDTO.of(result);
  }

  
  // @PostMapping("/")
  // public Map<String, String> register(ProductDTO productDTO){
    
  //   log.info("rgister: " + productDTO);

  //   List<MultipartFile> files = productDTO.getFiles();

  //   List<String> uploadFileNames = fileUtil.saveFiles(files);

  //   productDTO.setUploadFileNames(uploadFileNames);

  //   log.info(uploadFileNames);

  //   return Map.of("RESULT", "SUCCESS");
  // }


  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/view/{fileName}") //수정해야함 ResponseType
  public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

    return fileUtil.getFile(fileName);
  }

  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/list") // list?page=7&size=2&categoryId=1&color=green&color=green&minPrice=1&order
  public DataResponseDTO<PageResponseDTO<ProductDTO>> list(PageCategoryRequestDTO pageCategoryRequestDTO) {

    return DataResponseDTO.of(productService.getList(pageCategoryRequestDTO));

  }


  //ADMIN 페이지 추가
  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/searchAdminList") // searchAdminList?search=검색어&page=1&size=10
  public DataResponseDTO<PageResponseDTO<ProductDTO>> searchAdminList(SearchRequestDTO searchRequestDTO, @AuthenticationPrincipal UserDetails userDetails) {

    DataResponseDTO<PageResponseDTO<ProductDTO>> result =  DataResponseDTO.of(productService.getSearchAdminList(searchRequestDTO, userDetails));

    return result;
  }

  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/{pno}")
  public DataResponseDTO<ProductDTO> read(@PathVariable(name="pno") Long pno) {

    ProductDTO productDTO = productService.get(pno);

    return DataResponseDTO.of(productDTO);
  }

  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
  @PutMapping("/{pno}")
    public DataResponseDTO<ProductDTO> modify(@PathVariable(name="pno")Long pno, @Valid @ModelAttribute ProductDTO productDTO, @RequestParam(value = "categoryJson", required = false) String categoryJson, @AuthenticationPrincipal UserDetails userDetails) {
    log.info("==============productDTO " + productDTO); //예전에 올렸던 파일들은 productDTO.uploadFileNames에 들어있다.

    // categoryJson이 null이 아니면 JSON 문자열을 CategoryDTO로 변환
    if (categoryJson != null && !categoryJson.isEmpty()) {
      ObjectMapper mapper = new ObjectMapper();
      try {
        CategoryDTO categoryDTO  = mapper.readValue(categoryJson, CategoryDTO.class);
        productDTO.setCategory(categoryDTO);

      } catch (JsonProcessingException e) {
        System.out.println("exception"+e);
      }

    }

    productDTO.setPno(pno);

    //이미 저장되었던 파일들 가져온다.
    ProductDTO oldProductDTO = productService.get(pno);

    //기존의 파일들 (데이터베이스에 존재하는 파일들 - 수정 과정에서 삭제되었을 수 있음)
    List<FileDTO<String>> oldFileNames = oldProductDTO.getUploadFileNames();//원래 있던 파일들 // []

    List<FileDTO<String>> oldFileKeys = oldProductDTO.getUploadFileKeys();//원래 있던 파일들 키 값


    //화면에서 변화 없이 계속 유지된 파일들
    List<FileDTO<String>> uploadedFileNames = productDTO.getUploadFileNames();// 원래 있던 파일들 중 삭제 하지 않은 파일들 이름들 가져온다
    List<FileDTO<String>> uploadedFileKeys = productDTO.getUploadFileKeys();// 원래 있던 파일들 중 삭제 하지 않은 파일들 키들 가져온다


    //새로 업로드 해야 하는 파일들
    List<FileDTO<MultipartFile>> files = productDTO.getFiles();//새로 업로드한 파일들..

    if (files != null && files.size() > 0) {

      Map<String, List<FileDTO<String>>> awsResults = awsFileUtil.uploadFiles(files, PRODUCT_IMG_DIR);//AWS에 저장


      //새로 업로드되어서 만들어진 파일 이름들
      List<FileDTO<String>> currentUploadFileNames = awsResults.get("uploadNames");
      List<FileDTO<String>> currentUploadFileKeys = awsResults.get("uploadKeys");


      //유지되는 파일들  + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 됨
      if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) { //새로 업로드한 파일들이 하나라도 있으면

        uploadedFileNames.addAll(currentUploadFileNames); // 새로 업로드한 파일들을 (원래 있던 파일들 중 삭제하지 않은 이름들) 배열에 추가한다. 새로업로드한 파일들 + 원래 있던 파일들 중 삭제하지 않은 파일들 다 모아놓음
        uploadedFileKeys.addAll(currentUploadFileKeys);

      }

      //새로업로드한 파일들 + 원래 있던 파일들 중 삭제하지 않은 파일들 다 모아놓음

    }


    //수정 작업
    ProductDTO resultDTO = productService.modify(productDTO);


    // 예전에 저장했던 파일들이 한개라도 있다면
    if(oldFileKeys != null && oldFileKeys.size() > 0){

      //지워야 하는 파일 목록 찾기
      //예전 파일들 중에서 지워져야 하는 파일이름들
//      List<FileDTO<String>> removeFiles =  oldFileKeys.stream().filter(fileKey -> uploadedFileKeys.indexOf(fileKey) == -1).collect(Collectors.toList());
      //예전 파일들 배열을 돌면서 합쳐진 리스트에 있는 이름들 중에 없다면 삭제한다..
      List<FileDTO<String>> removeFiles = oldFileKeys.stream().filter(oldKey -> uploadedFileKeys.stream().noneMatch(uploadedKey -> uploadedKey.getFile().equals(oldKey.getFile()))).collect(Collectors.toList());


      //실제 파일 삭제
      awsFileUtil.deleteFiles(removeFiles);


    }

    return DataResponseDTO.of(resultDTO);
  }



  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
  @DeleteMapping("/{pno}")
  public DataResponseDTO<String> remove(@PathVariable("pno") Long pno) {

    //삭제해야할 파일들 알아내기 
    List<FileDTO<String>> oldFileNames =  productService.get(pno).getUploadFileNames();
    List<FileDTO<String>> oldFileKeys = productService.get(pno).getUploadFileKeys();

    productService.remove(pno);

    awsFileUtil.deleteFiles(oldFileKeys);


    return DataResponseDTO.of("SUCCESS");
  }


  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/newProductList")
  public DataResponseDTO<List<ProductDTO>> getNewProducts() {

    return DataResponseDTO.of(productService.getNewProducts());

  }


  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/expertProducts")
  public DataResponseDTO<List<ProductDTO>> getExpertProducts() {

    return DataResponseDTO.of(productService.getExpertProducts());

  }

  @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
  @GetMapping("/featuredProductList")
  public DataResponseDTO<List<ProductDTO>> getFeaturedProducts() {

    return DataResponseDTO.of(productService.getFeaturedProducts());

  }


  @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')")
  @PutMapping("/stock/{pno}")
  public DataResponseDTO<ProductDTO> modifySalesStatus(@PathVariable(name="pno") Long pno, @RequestBody StockRequestDTO stockRequestDTO,  @AuthenticationPrincipal UserDetails userDetails) {

    //수정 작업
    ProductDTO result =  productService.modifySalesStatus(stockRequestDTO);


    return DataResponseDTO.of( result);


  }


}
