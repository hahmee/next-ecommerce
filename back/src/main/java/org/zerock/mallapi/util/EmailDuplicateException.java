package org.zerock.mallapi.util;

import lombok.Getter;
import org.zerock.mallapi.exception.ErrorCode;

@Getter
public class EmailDuplicateException extends RuntimeException{

//  public EmailDuplicateException(String msg){
//      super(msg);
//  }

    private ErrorCode errorCode;

    public EmailDuplicateException(String msg,  ErrorCode errorCode){
        super(msg);
        this.errorCode = errorCode;
    }

}
