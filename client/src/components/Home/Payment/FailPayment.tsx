interface Props {
    code: string | string[] | undefined;
    message: string | string[] | undefined;
}



const FailPayment = ({code, message}: Props) => {

    return <div>
        <div> code:{code}</div>
        <div>  messsage:{message}</div>


    </div>;
};
export default FailPayment;
