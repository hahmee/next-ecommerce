package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderShippingAddressInfo {

    private String receiver;

    private String phone;

    private String zipCode;

    private String address;

    private String message;
}
