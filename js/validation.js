/**
 * Form validation module
 * Handles real-time validation of form fields
 */

// DOM elements for validation messages
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailValidation = document.getElementById('emailValidation');
const passwordValidation = document.getElementById('passwordValidation');

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
function validateEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password according to requirements
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
function validatePassword(password) {
    // Password must be at least 8 characters
    return password.length >= 8;
}

/**
 * Update UI with email validation feedback
 * @param {string} email - Email to validate
 * @returns {boolean} - Validation result
 */
function validateEmailUI(email) {
    // Clear previous validation
    emailValidation.textContent = '';
    emailInput.classList.remove('error', 'success');

    if (!email) {
        emailValidation.textContent = 'Email is required';
        emailInput.classList.add('error');
        return false;
    }

    const isValid = validateEmail(email);

    if (!isValid) {
        emailValidation.textContent = 'Please enter a valid email address';
        emailInput.classList.add('error');
        return false;
    }

    // Valid email
    emailInput.classList.add('success');
    return true;
}

/**
 * Update UI with password validation feedback
 * @param {string} password - Password to validate
 * @returns {boolean} - Validation result
 */
function validatePasswordUI(password) {
    // Clear previous validation
    passwordValidation.textContent = '';
    passwordInput.classList.remove('error', 'success');

    if (!password) {
        passwordValidation.textContent = 'Password is required';
        passwordInput.classList.add('error');
        return false;
    }

    if (password.length < 8) {
        passwordValidation.textContent = 'Password must be at least 8 characters';
        passwordInput.classList.add('error');
        return false;
    }

    // Valid password
    passwordInput.classList.add('success');
    return true;
}

// Add event listeners for real-time validation
document.addEventListener('DOMContentLoaded', () => {
    // Real-time email validation
    emailInput.addEventListener('blur', () => {
        validateEmailUI(emailInput.value.trim());
    });

    // Real-time password validation
    passwordInput.addEventListener('blur', () => {
        validatePasswordUI(passwordInput.value.trim());
    });

    // Clear validation messages on input
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            emailValidation.textContent = '';
            emailInput.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('error')) {
            passwordValidation.textContent = '';
            passwordInput.classList.remove('error');
        }
    });
});
