import React, {Suspense} from "react";
import ProductSingle from "@/components/Home/Product/ProductSingle";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import ProductSingleSkeleton from "@/components/Skeleton/ProductSingleSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {Metadata} from "next";
import {getPublicProduct, getPublicReviews} from "@/apis/publicAPI";

interface Props {
    params: {id: string }
}

//SEO 메타데이터를 동적으로 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = params;

    let productName = "상품 정보";
    let description = "Next E-commerce의 다양한 상품 정보를 확인해보세요.";
    let imageUrl = "";

    try {
        const product = await getPublicProduct({
            queryKey: ["productSingle", id],
        });

        if (product) {
            productName = product.pname || productName;
            description = product.pdesc || description;

            if (product.uploadFileNames && product.uploadFileNames.length > 0) {
                imageUrl = product.uploadFileNames[0].file;
            }
        }
    } catch (e) {
        console.error("메타데이터 생성 실패", e);
        // fallback 유지
    }

    return {
        title: `${productName} - Next E-commerce`,
        description,
        openGraph: {
            title: productName,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
            images: imageUrl
              ? [
                  {
                      url: imageUrl,
                      width: 800,
                      height: 600,
                      alt: productName,
                  },
              ]
              : [],
        },
        twitter: {
            card: "summary_large_image",
            title: productName,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function ProductSinglePage({params}: Props) {

    const {id} = params;

    const prefetchOptions = [
        {
            queryKey: ['productCustomerSingle', id],
            queryFn: () => getPublicProduct({queryKey: ['productCustomerSingle', id]}),
        },
        {
            queryKey: ['reviews', id],
            queryFn: () => getPublicReviews({queryKey: ['reviews', id]}),
        }
    ];
    return (
        <Suspense fallback={<ProductSingleSkeleton/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <ProductSingle id={id}/>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );
}

