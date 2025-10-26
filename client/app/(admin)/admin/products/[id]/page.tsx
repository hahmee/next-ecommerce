import { EditProductPage } from '@/pages/admin/products/edit-product';
import { productApi } from '@/entities/product';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  try {
    const product = await productApi.byId(id, {
      next: { revalidate: 60, tags: ['productSingle', id] },
    });
    return <EditProductPage id={id} initialProduct={product} />;
  } catch (e: any) {
    if (e?.status === 404) notFound();
    throw e; // 5xx 등은 에러 페이지로
  }
}
