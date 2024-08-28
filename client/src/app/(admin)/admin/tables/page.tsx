import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableTwo from "@/components/Tables/TableTwo";
import TableThree from "@/components/Tables/TableThree";
import TableExample from "@/components/Tables/TableExample";

export default function TablesPage() {

    return (
        <>
            <Breadcrumb pageName="Tables"/>

            <div className="flex flex-col gap-10">
                <TableExample/>
                <TableOne/>
                <TableTwo/>
                <TableThree/>
            </div>
        </>
    );
}