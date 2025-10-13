'use client';

import type { ColorTag } from '@/entities/common/model/ColorTag';
import { SalesStatus } from '@/entities/common/model/salesStatus';
import type { Product } from '@/entities/product/model/types';
import ProductImages from '@/entities/product/ui/ProductImages';
import type { Review } from '@/entities/review/model/types';
import Reviews from '@/entities/review/ui/Reviews';
import AddCart from '@/features/product/cart/ui/AddCart';
import OptionSelect from '@/features/product/filters/ui/OptionSelect';

interface Props {
  id: string;
  product?: Product;
  reviews?: Review[];
  priceText: string;

  color: ColorTag; // 컨테이너에서 확정
  size: string;
  setColor: (c: ColorTag) => void;
  setSize: (s: string) => void;

  salesStatus: SalesStatus;
  sellerEmail: string;
}

export function ProductSingleView({
  id,
  product,
  reviews,
  priceText,
  color,
  size,
  setColor,
  setSize,
  salesStatus,
  sellerEmail,
}: Props) {
  return (
    <div className="px-4 mt-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        {product?.uploadFileNames && product.uploadFileNames.length > 0 && (
          <ProductImages items={product.uploadFileNames} />
        )}
      </div>

      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product?.pname}</h1>

        {product?.pdesc && (
          <div dangerouslySetInnerHTML={{ __html: product.pdesc }} className="text-gray-500" />
        )}

        <div className="h-[1px] bg-gray-100" />

        <h2 className="font-medium text-2xl">{priceText} 원</h2>

        <div className="h-[1px] bg-gray-100" />

        {product && product.colorList && product.sizeList && (
          <OptionSelect
            colorList={product.colorList}
            sizeList={product.sizeList}
            size={size || product.sizeList[0]}
            setSize={setSize}
            color={color || product.colorList[0]}
            setColor={setColor}
          />
        )}

        <AddCart
          pno={Number(id)}
          salesStatus={salesStatus}
          options={{ size, color }}
          sellerEmail={sellerEmail}
        />

        <div className="h-[1px] bg-gray-100" />

        <div className="text-sm">
          <h4 className="font-medium mb-4">교환정책</h4>
          <p>{product?.changePolicy}</p>
        </div>

        <div className="text-sm">
          <h4 className="font-medium mb-4">환불정책</h4>
          <p>{product?.refundPolicy}</p>
        </div>

        <div className="h-[1px] bg-gray-100" />

        {/* REVIEWS */}
        <h1 className="text-2xl">User Reviews</h1>
        {product?.pno && <Reviews reviews={reviews} />}
      </div>
    </div>
  );
}
