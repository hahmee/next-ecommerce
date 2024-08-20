package org.zerock.mallapi.controller.advice;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.zerock.mallapi.util.CustomJWTException;
import org.zerock.mallapi.util.EmailDuplicateException;
import org.zerock.mallapi.util.NicknameDuplicateException;

import java.util.Map;
import java.util.NoSuchElementException;

/**
 * CustomControllerAdvice
 */
@Log4j2
@RestControllerAdvice //전역범위 Exception 핸들링
public class CustomControllerAdvice {

    //    @ExceptionHandler(NicknameDuplicateException.class)
//    protected ResponseEntity<?> handleNicknameDuplicateException(NicknameDuplicateException e) {
//
//        String msg = e.getMessage();
//
//        log.error("handleNicknameDuplicateException----------------------" + msg);
//
//        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("msg", msg));
//    }
//
//
//    @ExceptionHandler(EmailDuplicateException.class)
//    protected ResponseEntity<?> handleEmailDuplicateException(EmailDuplicateException e) {
//
//        String msg = e.getMessage();
//
//        log.error("handleEmailDuplicateException----------------------" + msg);
//
//
//        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("msg", msg));
//    }



    @ExceptionHandler(NicknameDuplicateException.class)
    protected ResponseEntity<?> handleNicknameDuplicateException(NicknameDuplicateException e) {

        String msg = e.getMessage();

        log.error("handleNicknameDuplicateException----------------------" + msg);

        return ResponseEntity.ok().body(Map.of("error", msg));

    }


    @ExceptionHandler(EmailDuplicateException.class)
    protected ResponseEntity<?> handleEmailDuplicateException(EmailDuplicateException e) {

        String msg = e.getMessage();

        log.error("handleEmailDuplicateException----------------------" + msg);

        return ResponseEntity.ok().body(Map.of("error", msg));

    }



    @ExceptionHandler(NoSuchElementException.class)
    protected ResponseEntity<?> notExist(NoSuchElementException e) {

      String msg = e.getMessage();

      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", msg));
      }


      @ExceptionHandler(MethodArgumentNotValidException.class)
      protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {

          String msg = e.getMessage();

          return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("msg", msg));
      }

      @ExceptionHandler(CustomJWTException.class)
      protected ResponseEntity<?> handleJWTException(CustomJWTException e) {

          String msg = e.getMessage();

          log.error("handleJWTException----------------------" + msg);


          return ResponseEntity.ok().body(Map.of("error", msg));
      }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        String msg = e.getMessage();

        log.error("handleMaxUploadSizeExceeded----------------------" + msg);

        return ResponseEntity.ok().body(Map.of("error", msg));
    }

}
