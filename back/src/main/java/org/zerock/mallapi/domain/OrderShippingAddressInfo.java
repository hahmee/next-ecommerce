package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Embeddable
@ToString
@Getter
@Setter
public class OrderShippingAddressInfo {

    private String receiver;

    private String phone;

    private String zipCode;

    private String address;

    private String message;
}
