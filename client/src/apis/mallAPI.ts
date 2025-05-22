"use server";
import { fetchJWT } from "@/utils/fetchJWT";
import { removeCookie } from "@/utils/cookie";
import { unwrap } from "@/utils/unwrap";

export const getProductList = async ({
                                         queryKey,
                                         page,
                                         row,
                                         categoryId,
                                         colors,
                                         productSizes,
                                         minPrice,
                                         maxPrice,
                                         order,
                                         query,
                                     }: {
    queryKey: [string, string, string[], string[], string, string, string, string];
    page: number;
    row: number;
    categoryId: string;
    colors: string | string[] | undefined;
    productSizes: string | string[] | undefined;
    minPrice: string;
    maxPrice: string;
    order: string;
    query: string;
}) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", row.toString());
    params.append("categoryId", categoryId);
    params.append("minPrice", minPrice.toString());
    params.append("maxPrice", maxPrice.toString());
    params.append("order", order);
    params.append("query", query);

    if (colors) {
        if (Array.isArray(colors)) {
            colors.forEach((color) => params.append("color", color));
        } else {
            params.append("color", colors);
        }
    }

    if (productSizes) {
        if (Array.isArray(productSizes)) {
            productSizes.forEach((productSize) => params.append("productSize", productSize));
        } else {
            params.append("productSize", productSizes);
        }
    }

    return unwrap(
        await fetchJWT(`/api/products/list?${params.toString()}`, {
            method: "GET",
            next: { tags: ["products"] },
            credentials: "include",
            cache: "no-store",
        })
    );
};

export async function getPayment({ paymentKey }: { paymentKey: string }) {
    return unwrap(
        await fetchJWT(`/api/payments/${paymentKey}`, {
            method: "GET",
            next: { tags: ["paymentKey", paymentKey] },
            credentials: "include",
            cache: "no-store",
        })
    );
}

export async function getOrder({ id }: { id: string }) {
    return unwrap(
        await fetchJWT(`/api/orders/${id}`, {
            method: "GET",
            next: { tags: ["order", id] },
            credentials: "include",
            cache: "no-store",
        })
    );
}

export async function getOrders({ orderId }: { orderId: string }) {
    return unwrap(
        await fetchJWT(`/api/orders/list/${orderId}`, {
            method: "GET",
            next: { tags: ["orders", orderId] },
            credentials: "include",
            cache: "no-store",
        })
    );
}

export async function getSuccessPayment({ queryKey, paymentKey, orderId, amount }: {
  queryKey: string[];
  paymentKey: string;
  orderId: string;
  amount: string;
}) {
  return unwrap(
    await fetchJWT(`/api/toss/confirm`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
  );
}

// export async function getSuccessPayment({ queryKey, paymentKey, orderId, amount }: {
//     queryKey: string[];
//     paymentKey: string;
//     orderId: string;
//     amount: string;
// }) {
//     return unwrap(
//         await fetchJWT(`/api/payments/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`, {
//             method: "GET",
//             next: { tags: ["payment", orderId] },
//             credentials: "include",
//             cache: "no-store",
//         })
//     );
// }

export const getUserReviews = async ({ queryKey }: { queryKey: [string] }) => {
    return unwrap(
        await fetchJWT(`/api/reviews/myReviews`, {
            method: "GET",
            next: { tags: ["myReviews"] },
            credentials: "include",
            cache: "no-store",
        })
    );
};

export const getPayments = async ({ queryKey }: { queryKey: [string] }) => {
    return unwrap(
        await fetchJWT(`/api/payments/list`, {
            method: "GET",
            next: { tags: ["payments"] },
            credentials: "include",
            cache: "no-store",
        })
    );
};

export const getUserInfo = async () => {
    return unwrap(
        await fetchJWT(`/api/profile`, {
            method: "GET",
            next: { tags: ["user"] },
            credentials: "include",
            cache: "no-store",
        })
    );
};

export const getCart = async () => {
    return unwrap(
        await fetchJWT(`/api/cart/items`, {
            method: "GET",
            next: { tags: ["carts"] },
            credentials: "include",
            cache: "no-store",
        })
    );
};

export const logout = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/member/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다.");
    }
    await removeCookie("member");
};
