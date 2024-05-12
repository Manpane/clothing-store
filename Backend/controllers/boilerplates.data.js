const forget_password_boilerplate = (pin, username) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
        </head>
        <body style="font-family: Arial, sans-serif;">

            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">

                <h2>Password Reset Request</h2>

                <p>Dear ${username},</p>

                <p>We received a request to reset the password for your account. If you did not make this request, please disregard this email.</p>

                <p>To reset your password, please use the following PIN:</p>

                <p style="font-size: 32px; font-weight: bold; color: #e74c3c;">${pin}</p>
                
                <p>Note: <b>This PIN should be kept confidential. Do not share this PIN with anyone.<br>It will expire in 5 minutes</b></p>


                <p>Thank you for using our system. If you have any questions or need assistance, feel free to contact our support team.</p>
                
                <p>Best regards,<br>
                The BikersZone Team</p>
            </div>
        </body>
        </html>
    `;
};

const verify_account_boilerplate = (OTP, username) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif;">
    
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    
            <h2>Welcome to BikersZone</h2>
    
            <p>Dear ${username},</p>
    
            <p>Thank you for joining bikerszone. We are excited to have you on board!</p>
    
            <p>Your account has been created successfully. To verify your account, please use the following One-Time Password (OTP):</p>
    
            <p style="font-size: 24px; font-weight: bold; color: #3498db;">${OTP}</p>

            <p>If you did not sign up for an account, please ignore this email.</p>
    
            <p>Thank you again for choosing our system. If you have any questions or need assistance, feel free to contact our support team.</p>
    
            <p>
            Best regards,<br>
            The BikersZone Team
            </p>
        </div>
    </body>
    </html>`;
};

const verify_order_boilerplate = (otp, username) => {
    return `
    <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bikerszone - Order Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #4CAF50;
                    text-align: center;
                }

                p {
                    margin-bottom: 20px;
                }

                .otp {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                }

                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888888;
                }
            </style>
        </head>

        <body>
            <div class="container">
                <h1>Bikerszone - Order Verification</h1>
                <p>Hello <strong>${username}</strong>,</p>
                <p>Your one-time password (OTP) for order verification is:</p>
                <p class="otp">${otp}</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
                <div class="footer">
                    <p>Bikerszone - Your Ultimate Biking Destination</p>
                </div>
            </div>
        </body>

        </html>
    `;

}

module.exports = {

    forget_password_boilerplate,
    verify_account_boilerplate,
    verify_order_boilerplate,
};
