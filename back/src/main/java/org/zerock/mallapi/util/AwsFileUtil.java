package org.zerock.mallapi.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.FileDTO;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@Component
@Log4j2
@RequiredArgsConstructor
public class AwsFileUtil {

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;
  private final S3Client s3;            // v2 클라이언트
  private final S3Presigner presigner;  // v2 프리사이너

  /* 1-1. 파일 싱글 업로드 */
  public Map<String, String> uploadSingleFile(MultipartFile file, String dirName) throws RuntimeException {
    if (file == null || file.isEmpty()) return null;

    try {
      String savedName = dirName + "/" + UUID.randomUUID() + "_" + Objects.requireNonNull(file.getOriginalFilename());

      PutObjectRequest put = PutObjectRequest.builder()
              .bucket(bucket)
              .key(savedName)
              .contentType(file.getContentType())
              .build();

      // 정확한 사이즈 사용
      s3.putObject(put, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

      S3Utilities util = s3.utilities();
      String url = URLDecoder.decode(
              util.getUrl(GetUrlRequest.builder().bucket(bucket).key(savedName).build()).toString(),
              StandardCharsets.UTF_8
      );

      return Map.of("uploadName", url, "uploadKey", savedName);

    } catch (Exception e) {
      log.error("S3 upload error", e);
      throw new GeneralException(e.getMessage());
    }
  }

  /* 1-2. 파일 다중 업로드 */
  public Map<String, List<FileDTO<String>>> uploadFiles(List<FileDTO<MultipartFile>> files, String dirName) throws RuntimeException {
    if (files == null || files.isEmpty()) return null;

    List<FileDTO<String>> uploadNames = new ArrayList<>();
    List<FileDTO<String>> uploadKeys = new ArrayList<>();

    try {
      for (FileDTO<MultipartFile> mf : files) {
        MultipartFile file = mf.getFile();
        if (file == null || file.isEmpty()) continue;

        String savedName = dirName + "/" + UUID.randomUUID() + "_" + Objects.requireNonNull(file.getOriginalFilename());

        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(savedName)
                .contentType(file.getContentType())
                .build();

        s3.putObject(put, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String url = URLDecoder.decode(
                s3.utilities().getUrl(GetUrlRequest.builder().bucket(bucket).key(savedName).build()).toString(),
                StandardCharsets.UTF_8
        );

        FileDTO<String> resultNames = new FileDTO<>();
        resultNames.setOrd(mf.getOrd());
        resultNames.setFile(url);

        FileDTO<String> resultKeys = new FileDTO<>();
        resultKeys.setOrd(mf.getOrd());
        resultKeys.setFile(savedName);

        uploadNames.add(resultNames);
        uploadKeys.add(resultKeys);
      }

      return Map.of("uploadNames", uploadNames, "uploadKeys", uploadKeys);

    } catch (Exception e) {
      log.error("S3 multi upload error", e);
      throw new GeneralException(e.getMessage());
    }
  }

  /* 2. 파일 여러개 삭제 */
  public void deleteFiles(List<FileDTO<String>> fileKeys) {
    if (fileKeys == null || fileKeys.isEmpty()) return;

    try {
      List<ObjectIdentifier> objs = fileKeys.stream()
              .map(f -> ObjectIdentifier.builder().key(f.getFile()).build())
              .toList();

      DeleteObjectsRequest req = DeleteObjectsRequest.builder()
              .bucket(bucket)
              .delete(Delete.builder().objects(objs).build())
              .build();

      s3.deleteObjects(req);

    } catch (S3Exception e) {
      log.error("S3 deleteObjects error", e);
      throw new GeneralException(e.awsErrorDetails().errorMessage());
    }
  }

  /* 3. 파일 한개만 삭제 */
  public void delete(String keyName) {
    try {
      s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(keyName).build());
    } catch (S3Exception e) {
      log.error("S3 deleteObject error", e);
    }
  }

  /* 4. 파일의 presigned URL 반환 (GET, 2분) */
  public String getPresignedURL(String keyName) {
    try {
      GetObjectRequest get = GetObjectRequest.builder()
              .bucket(bucket)
              .key(keyName)
              .build();

      GetObjectPresignRequest preReq = GetObjectPresignRequest.builder()
              .signatureDuration(Duration.ofMinutes(2))
              .getObjectRequest(get)
              .build();

      PresignedGetObjectRequest pre = presigner.presignGetObject(preReq);
      return pre.url().toString();

    } catch (Exception e) {
      log.error("S3 presign error", e);
      return "";
    }
  }

}
