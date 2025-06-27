import React, {Suspense} from "react";
import ProductSingle from "@/components/Home/Product/ProductSingle";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProduct, getReviews} from "@/apis/adminAPI";
import ProductSingleSkeleton from "@/components/Skeleton/ProductSingleSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

interface Props {
    params: {id: string }
}

//SEO 메타데이터를 동적으로 생성
export async function generateMetadata({ params }: Props) {
    const { id } = params;

    let productName = "상품 정보";
    let description = "Next E-commerce의 다양한 상품 정보를 확인해보세요.";
    let imageUrl = "";

    try {
        const product = await getProduct({
            queryKey: ["productCustomerSingle", id],
        });

        if (product) {
            productName = product.pname || productName;
            description = product.pdesc || description;
            if (product.thumbnail) {
                imageUrl = product.uploadFileNames[0].file;
            }
        }
    } catch (e) {
        // fallback 유지
    }

    return {
        // 브라우저 탭 타이틀
        title: `${productName} - Next E-commerce`,
        description,
        // Open Graph (OG) 태그 – 페이스북, 카카오톡, LinkedIn, 슬랙 공유 시 미리보기 카드용
        openGraph: {
            title: productName,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`, // 현재 상품 페이지 URL
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: productName,
                },
            ],
        },
        //Twitter Card용 메타데이터
        twitter: {
            card: "summary_large_image",
            title: productName,
            description,
            images: [imageUrl],
        },
    };
}

export default async function ProductSinglePage({params}: Props) {

    const {id} = params;

    const prefetchOptions = [
        {
            queryKey: ['productCustomerSingle', id],
            queryFn: () => getProduct({queryKey: ['productCustomerSingle', id]}),
        },
        {
            queryKey: ['reviews', id],
            queryFn: () => getReviews({queryKey: ['reviews', id]}),
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

