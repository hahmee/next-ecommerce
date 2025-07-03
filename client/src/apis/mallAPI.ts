"use server";
import { fetcher } from "@/utils/fetcher";

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

  return await fetcher(`/api/products/list?${params.toString()}`, {
    method: "GET",
    next: {revalidate: 60, tags: ['products']}, //ISR을 위해 revalidate 해서 60초마다 페이지 재생성
    credentials: "include",
    // cache: "no-store", SSR 지우기
  })

};

export async function getPayment({paymentKey}: { paymentKey: string }) {
  return await fetcher(`/api/payments/${paymentKey}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store", //SSR
  });
}

export async function getOrder({id}: { id: string }) {
  return await fetcher(`/api/orders/${id}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

export async function getOrders({ orderId }: { orderId: string }) {
  console.log('getOrders 실행')
  return await fetcher(`/api/orders/list/${orderId}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

export async function getSuccessPayment({ queryKey, paymentKey, orderId, amount }: {
  queryKey: string[];
  paymentKey: string;
  orderId: string;
  amount: string;
}) {
  return await fetcher(`/api/toss/confirm`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    });
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

export const getUserReviews = async ({queryKey}: { queryKey: [string] }) => {
  return await fetcher(`/api/reviews/myReviews`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
};

export const getPayments = async ({ queryKey }: { queryKey: [string] }) => {
  return await fetcher(`/api/payments/list`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
};

export const getUserProfile = async () => {
  return await fetcher(`/api/profile`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
};

export const getCart = async () => {
  return await fetcher(`/api/cart/items`, {
    method: 'GET',
    credentials: "include",
    cache: "no-store",
  });
};

export const logout = async () => {
  const response = await fetch(`${process.env.BACKEND_URL}/api/member/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }
};
