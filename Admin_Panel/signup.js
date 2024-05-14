document.addEventListener("DOMContentLoaded", async function () {
    const signupForm = document.getElementById('signup-form');
    const errorMsg = document.querySelector('.signup-error-msg');

    signupForm.addEventListener('submit', async event => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;

        const data = {
            email: email,
            password: password,
            username: username,
            role: "admin"
        };

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseData = await response.json();
                showSuccess('Account created successfully! Redirecting to login page...');
                setTimeout(() => {
                    // Redirect to login page
                    window.location.href = '/login.html';
                }, 2000);
            } else {
                const responseData = await response.json();
                errorMsg.textContent = responseData.error || 'An error occurred.';
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error(error);
            errorMsg.textContent = 'An unexpected error occurred. Please try again later.';
            errorMsg.style.display = 'block';
        }
    });
});