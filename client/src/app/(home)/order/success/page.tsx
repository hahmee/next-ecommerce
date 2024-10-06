const OrderSuccessPage = ({ payment, isError }: { payment: any; isError: boolean }) => {

    const { orderId, paymentKey, amount } = req.query;
    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;

    const url = "https://api.tosspayments.com/v1/payments/confirm";
    const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

    await fetch(url, {
        method: "post",
        body: JSON.stringify({
            amount,
            orderId,
            paymentKey,
        }),
        headers: {
            Authorization: `Basic ${basicToken}`,
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());

    // TODO: DB 처리
    // res.redirect(`/payments/complete?orderId=${orderId}`);
    return {
        redirect: {
            destination: `/order/fail?code=${error.response.data.code}&message=${encodeURIComponent(
                error.response.data.message,
            )}`,
            permanent: false,
        },
    };
};