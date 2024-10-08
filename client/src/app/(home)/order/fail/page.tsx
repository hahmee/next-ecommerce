import FailPayment from "@/components/Home/Payment/FailPayment";

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function OrderFailPage({searchParams}: Props) {
    console.log('searchParams', searchParams);

    const code = searchParams['code'];
    const message = searchParams['message'];


    return <FailPayment code={code} message={message}/>
}