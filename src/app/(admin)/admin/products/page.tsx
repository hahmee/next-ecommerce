import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTwo from "@/components/Tables/TableTwo";
import ProductTable from "@/components/Tables/ProductsTable";

export default function ProductsPage() {
    return <div className="mx-auto">


        <Breadcrumb pageName="Products"/>
        <div className="flex flex-col gap-10">
            <ProductTable/>
        </div>

    </div>;

};