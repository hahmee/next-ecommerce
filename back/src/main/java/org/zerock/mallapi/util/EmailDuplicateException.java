package org.zerock.mallapi.util;

import lombok.Getter;

public class EmailDuplicateException extends RuntimeException{

  public EmailDuplicateException(String msg){
      super(msg);
  }
}
