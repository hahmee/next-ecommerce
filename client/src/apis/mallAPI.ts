import { fetcher } from '@/utils/fetcher/fetcher';

const BACKEND_URL =
  typeof window === 'undefined' ? process.env.BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL;

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
  params.append('page', page.toString());
  params.append('size', row.toString());
  params.append('categoryId', categoryId);
  params.append('minPrice', minPrice.toString());
  params.append('maxPrice', maxPrice.toString());
  params.append('order', order);
  params.append('query', query);

  if (colors) {
    if (Array.isArray(colors)) {
      colors.forEach((color) => params.append('color', color));
    } else {
      params.append('color', colors);
    }
  }

  if (productSizes) {
    if (Array.isArray(productSizes)) {
      productSizes.forEach((productSize) => params.append('productSize', productSize));
    } else {
      params.append('productSize', productSizes);
    }
  }

  return fetcher(`/api/products/list?${params.toString()}`, {
    method: 'GET',
    next: { revalidate: 60, tags: ['products'] }, // ISR을 위해 revalidate 해서 60초마다 페이지 재생성
    credentials: 'include',
    // cache: "no-store", SSR 지우기
  });
};

export async function getPayment({ paymentKey }: { paymentKey: string }) {
  return fetcher(`/api/payments/${paymentKey}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store', // SSR
  });
}

export async function getOrder({ id }: { id: string }) {
  return fetcher(`/api/orders/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
}

export async function getOrders({ orderId }: { orderId: string }) {
  return fetcher(`/api/orders/list/${orderId}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
}

export async function getSuccessPayment({
  queryKey,
  paymentKey,
  orderId,
  amount,
}: {
  queryKey: string[];
  paymentKey: string;
  orderId: string;
  amount: string;
}) {
  return fetcher(`/api/toss/confirm`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
  });
}

export const getUserReviews = async ({ queryKey }: { queryKey: [string] }) => {
  return fetcher(`/api/reviews/myReviews`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
};

export const getPayments = async ({ queryKey }: { queryKey: [string] }) => {
  return fetcher(`/api/payments/list`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
};

export const getUserProfile = async () => {
  return fetcher(`/api/profile`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
};

export const getCart = async () => {
  return fetcher(`/api/cart/items`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
};

export const logout = async () => {
  const response = await fetch(`${BACKEND_URL}/api/member/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }
};
