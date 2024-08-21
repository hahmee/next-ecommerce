package org.zerock.mallapi.util;

import lombok.Getter;
import org.zerock.mallapi.exception.Code;

@Getter
public class EmailDuplicateException extends RuntimeException{

//  public EmailDuplicateException(String msg){
//      super(msg);
//  }

    private Code errorCode;

    public EmailDuplicateException(String msg,  Code errorCode){
        super(msg);
        this.errorCode = errorCode;
    }

}
