document.addEventListener("DOMContentLoaded", async function () {
    const otpForm = document.querySelector('.container');
    const errorMsg = document.getElementById('error-msg');

    otpForm.addEventListener('click', async event => {
        if (event.target.classList.contains('btn-verify')) {
            const otpInputs = document.querySelectorAll('.digit');
            let otp = '';

            otpInputs.forEach(input => {
                otp += input.value;
            });

            const email = getEmailFromQuery();
            if (!email){
                showError("No email provided!");
                return;
            }

            const data = {
                email: email,
                otp: otp
            };

            try {
                const response = await fetch(`${API_BASE_URL}/auth/verifyOtp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    // const responseData = await response.json();
                    alert("Please enter the OTP sent to the mail");
                    
                }
            } catch (error) {
                console.error(error);
                alert("Server down! Please try again later!");

            }
        }
    });

    document.getElementById("resend-otp-btn").addEventListener("click",async e=>{
        e.preventDefault();
        const email = getEmailFromQuery();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/resendOtp`, {
                method:"POST",
                headers: {
                    'Content-Type':"application/json"
                },
                body: JSON.stringify({
                    email
                })
            });
            if (response.ok){
                showSuccess("OTP resent to your email.");
            }else{
                showError("OTP couldn't be sent. Try again later.")
            }
        } catch (error) {
            
        }
    });

    function getEmailFromQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('email');
    }
});
