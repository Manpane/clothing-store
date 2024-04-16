
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
    
            <h2>Welcome to Clothing</h2>
    
            <p>Dear ${username},</p>
    
            <p>Thank you for joining Clothing. We are excited to have you on board!</p>
    
            <p>Your account has been created successfully. To verify your account, please use the following One-Time Password (OTP):</p>
    
            <p style="font-size: 24px; font-weight: bold; color: #3498db;">${OTP}</p>

            <p>If you did not sign up for an account, please ignore this email.</p>
    
            <p>Thank you again for choosing our system. If you have any questions or need assistance, feel free to contact our support team.</p>
    
            <p>
            Best regards,<br>
            The Clothing Team
            </p>
        </div>
    </body>
    </html>`;
};

module.exports = {
    verify_account_boilerplate,
};
