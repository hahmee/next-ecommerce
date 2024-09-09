package org.zerock.mallapi.util;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.FileDTO;

import java.io.IOException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.*;

@Component
@Log4j2
@RequiredArgsConstructor
public class AwsFileUtil {

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  private final AmazonS3 amazonS3;


  /* 1. 파일 업로드 */
  public Map<String, List<FileDTO<String>>> uploadFiles(List<FileDTO<MultipartFile>> files, String dirName) throws RuntimeException {

    if (files == null || files.size() == 0) {
      return null;
    }
//
//    List<String> uploadNames = new ArrayList<>();
//    List<String> uploadKeys = new ArrayList<>();


    List<FileDTO<String>> uploadNames = new ArrayList<>();
    List<FileDTO<String>> uploadKeys = new ArrayList<>();


    try {

//      int index = 0;
//      for (MultipartFile multipartFile : files) {
      for (FileDTO<MultipartFile> multipartFile : files) {

        //키 값
//        String savedName = dirName + "/" + UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
        String savedName = dirName + "/" + UUID.randomUUID().toString() + "_" + multipartFile.getFile().getOriginalFilename();

        log.info("savedName......" + savedName);

        // 메타데이터 생성
        ObjectMetadata objMeta = new ObjectMetadata();
//        objMeta.setContentType(multipartFile.getContentType());
//        objMeta.setContentLength(multipartFile.getInputStream().available());

        objMeta.setContentType(multipartFile.getFile().getContentType());
        objMeta.setContentLength(multipartFile.getFile().getInputStream().available());

        // putObject(버킷명, 파일명, 파일데이터, 메타데이터)로 S3에 객체 등록
        amazonS3.putObject(bucket, savedName, multipartFile.getFile().getInputStream(), objMeta);

        // 등록된 객체의 url 반환 (decoder: url 안의 한글or특수문자 깨짐 방지)
        String url = URLDecoder.decode(amazonS3.getUrl(bucket, savedName).toString(), "utf-8");

        FileDTO<String> resultNames = new FileDTO<>();
        resultNames.setOrd(multipartFile.getOrd());
        resultNames.setFile(url);

        FileDTO<String> resultKeys = new FileDTO<>();
        resultKeys.setOrd(multipartFile.getOrd());
        resultKeys.setFile(savedName);

        uploadNames.add(resultNames);
        uploadKeys.add(resultKeys);

//        index++;

      }

    } catch (IOException e) {
      throw new GeneralException(e.getMessage());
    }

//    return uploadNames;
    return Map.of("uploadNames", uploadNames, "uploadKeys", uploadKeys);

  }

  /* 2. 파일 여러개 삭제 */
  public void deleteFiles (List<FileDTO<String>> fileKeys) {
    try {

      // deleteObject(버킷명, 키값)으로 객체 삭제
      fileKeys.forEach(fileKey -> {
        amazonS3.deleteObject(bucket, fileKey.getFile());
      } );

    } catch (AmazonServiceException e) {
      log.error(e.toString());
      throw new GeneralException(e.getMessage());
    }
  }

  /* 3. 파일 한개만 삭제 */
  public void delete (String keyName) {
    try {
      // deleteObject(버킷명, 키값)으로 객체 삭제
      amazonS3.deleteObject(bucket, keyName);
    } catch (AmazonServiceException e) {
      log.error(e.toString());
    }
  }

  /* 3. 파일의 presigned URL 반환 */
  public String getPresignedURL (String keyName) {
    String preSignedURL = "";
    // presigned URL이 유효하게 동작할 만료기한 설정 (2분)
    Date expiration = new Date();
    Long expTimeMillis = expiration.getTime();
    expTimeMillis += 1000 * 60 * 2;
    expiration.setTime(expTimeMillis);

    try {
      // presigned URL 발급
      GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, keyName)
              .withMethod(HttpMethod.GET)
              .withExpiration(expiration);
      URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
      preSignedURL = url.toString();
    } catch (Exception e) {
      log.error(e.toString());
    }

    return preSignedURL;
  }




}
