package org.zerock.mallapi.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TossPaymentMethod {
    카드("카드"),
    현금("현금"),
    간편결제("간편결제");

    private final String value;

    TossPaymentMethod(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TossPaymentMethod from(String value) {
        for (TossPaymentMethod method : TossPaymentMethod.values()) {
            if (method.value.equals(value)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Unknown payment method: " + value);
    }
}
