/**
 * Form validation functionality for login page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Add event listeners for real-time validation
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    loginForm.addEventListener('submit', handleSubmit);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Change icon based on password visibility
        const svg = togglePasswordBtn.querySelector('svg');
        if (type === 'text') {
            svg.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
        } else {
            svg.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
        }
    });

    // Check if there's a saved username in localStorage
    if (localStorage.getItem('rememberedUser')) {
        usernameInput.value = localStorage.getItem('rememberedUser');
        document.getElementById('rememberMe').checked = true;
    }

    /**
     * Validates the username/email field
     */
    function validateUsername() {
        const username = usernameInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        let errorMessage = '';

        // Reset previous validation state
        usernameInput.classList.remove('error', 'success');
        usernameError.style.display = 'none';

        // Empty field validation
        if (username === '') {
            isValid = false;
            // Don't show error for empty field during typing
            return;
        }

        // Email format validation if it looks like an email
        if (username.includes('@') && !emailRegex.test(username)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Minimum length validation
        if (username.length < 3) {
            isValid = false;
            errorMessage = 'Username must be at least 3 characters long';
        }

        // Update UI based on validation
        if (isValid) {
            usernameInput.classList.add('success');
        } else {
            usernameInput.classList.add('error');
            usernameError.textContent = errorMessage;
            usernameError.style.display = 'block';
        }

        return isValid;
    }

    /**
     * Validates the password field
     */
    function validatePassword() {
        const password = passwordInput.value;
        let isValid = true;
        let errorMessage = '';

        // Reset previous validation state
        passwordInput.classList.remove('error', 'success');
        passwordError.style.display = 'none';

        // Empty field validation
        if (password === '') {
            isValid = false;
            // Don't show error for empty field during typing
            return;
        }

        // Minimum length validation
        if (password.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
        }

        // Password complexity validation
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(hasUppercase && hasLowercase && hasNumber)) {
            isValid = false;
            errorMessage = 'Password must contain uppercase, lowercase, and numbers';
        }

        // Update UI based on validation
        if (isValid) {
            passwordInput.classList.add('success');
        } else {
            passwordInput.classList.add('error');
            passwordError.textContent = errorMessage;
            passwordError.style.display = 'block';
        }

        return isValid;
    }

    /**
     * Handles form submission
     * @param {Event} e - Submit event
     */
    function handleSubmit(e) {
        e.preventDefault();

        // Validate both fields on submission
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();

        // If both valid, proceed with auth
        if (isUsernameValid && isPasswordValid) {
            // Get values
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Save username if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            } else {
                localStorage.removeItem('rememberedUser');
            }

            // Attempt login
            authenticateUser(username, password);
        }
    }
});

/**
 * Sanitizes input to prevent XSS attacks
 * @param {string} input - The string to sanitize
 * @return {string} - Sanitized string
 */
function sanitizeInput(input) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    return tempDiv.innerHTML;
}
