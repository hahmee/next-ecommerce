import { EditProductPage } from '@/pages/admin/products/edit-product';
import {productApi} from "@/entities/product";
import {notFound} from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  // return <EditProductPage id={params.id} />;
  const { id } = params;
  try {
    const product = await productApi.byId(id, { cache: 'no-store' });
    console.log('product,', product);
    return <EditProductPage id={id} initialProduct={product} />;
  } catch (e: any) {
    if (e?.status === 404) notFound();
    throw e; // 5xx 등은 에러 페이지로
  }

}
