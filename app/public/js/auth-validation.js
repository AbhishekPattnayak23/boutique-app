document.addEventListener('DOMContentLoaded', function() {
    // Get the forms
    const loginForm = document.querySelector('form[action*="login"]');
    const registerForm = document.querySelector('form[action*="register"]');

    // Validate login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            let isValid = true;

            // Clear previous error messages
            clearErrors();

            // Validate email
            if (!email) {
                displayError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                displayError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password
            if (!password) {
                displayError('password', 'Password is required');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    // Validate registration form
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            let isValid = true;

            // Clear previous error messages
            clearErrors();

            // Validate username
            if (!username) {
                displayError('username', 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                displayError('username', 'Username must be at least 3 characters');
                isValid = false;
            }

            // Validate email
            if (!email) {
                displayError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                displayError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password
            if (!password) {
                displayError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 8) {
                displayError('password', 'Password must be at least 8 characters');
                isValid = false;
            }

            // Validate confirm password
            if (password !== confirmPassword) {
                displayError('confirm_password', 'Passwords do not match');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    // Helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function displayError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';

        input.classList.add('error');
        input.parentNode.appendChild(errorDiv);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
    }
});
