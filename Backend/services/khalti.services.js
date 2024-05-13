const axios = require('axios');

const initiateKhaltiPayment = async ({
    return_url,
    website_url,
    amountInRs,
    purchase_order_id,
    purchase_order_name,
}) => {
    let KHALTI_BASE_URL = process.env.KHALTI_ENDPOINT;
    if (KHALTI_BASE_URL.trim().endsWith("/")) {
        KHALTI_BASE_URL = KHALTI_BASE_URL.slice(0, -1);
    }
    const response = await axios.post(
        `${KHALTI_BASE_URL}/epayment/initiate/`,
        {
            return_url,
            website_url,
            amount: amountInRs * 100,
            purchase_order_id,
            purchase_order_name,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            },
        }
    );

    return response.data;
}

module.exports = {
    initiateKhaltiPayment,
}