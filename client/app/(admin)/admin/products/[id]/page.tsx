import {EditProductPage} from "@/pages/admin/products/edit-product";

interface Props {
    params: { id: string };
}

export default function Page({ params }: Props) {
    return <EditProductPage id={params.id} />;
}
