package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderShippingAddressInfo {

    private String receiver;

    private String phoneNumber;

    private int zipCode;

    private String address;

    private String message;
}
