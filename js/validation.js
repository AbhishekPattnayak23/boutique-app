/**
 * Form validation module for login form
 * Handles real-time validation of username/email and password fields
 */

// Cache DOM elements
const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const loginButton = document.getElementById('login-button');
const togglePasswordButton = document.getElementById('toggle-password');

// Validation configuration
const validationConfig = {
    username: {
        required: true,
        minLength: 3,
        maxLength: 50,
        // Simple email regex pattern for basic validation
        pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,})+$|^[a-zA-Z0-9_]{3,50}$/
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 64
    }
};

// Initialize event listeners
function initValidation() {
    // Add input event listeners for real-time validation
    usernameInput.addEventListener('input', () => {
        validateField('username', usernameInput, usernameError);
        updateSubmitButton();
    });

    passwordInput.addEventListener('input', () => {
        validateField('password', passwordInput, passwordError);
        updateSubmitButton();
    });

    // Add blur event listeners for validation when focus leaves the field
    usernameInput.addEventListener('blur', () => {
        validateField('username', usernameInput, usernameError);
        updateSubmitButton();
    });

    passwordInput.addEventListener('blur', () => {
        validateField('password', passwordInput, passwordError);
        updateSubmitButton();
    });

    // Password visibility toggle
    togglePasswordButton.addEventListener('click', togglePasswordVisibility);
}

/**
 * Validates a single form field
 * @param {string} fieldName - The name of the field being validated
 * @param {HTMLInputElement} inputElement - The input element to validate
 * @param {HTMLElement} errorElement - The element to display error messages
 * @returns {boolean} - Whether the field is valid
 */
function validateField(fieldName, inputElement, errorElement) {
    const value = inputElement.value.trim();
    const config = validationConfig[fieldName];
    let isValid = true;
    let errorMessage = '';

    // Check if empty but required
    if (config.required && value === '') {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    // Check minimum length
    else if (value.length > 0 && config.minLength && value.length < config.minLength) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${config.minLength} characters`;
    }
    // Check maximum length
    else if (config.maxLength && value.length > config.maxLength) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${config.maxLength} characters`;
    }
    // Check pattern for username/email
    else if (fieldName === 'username' && value.length > 0 && !config.pattern.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address or username';
    }

    // Update UI based on validation result
    if (isValid) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        errorElement.textContent = '';
    } else {
        inputElement.classList.remove('success');
        inputElement.classList.add('error');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

/**
 * Updates the submit button state based on form validation
 */
function updateSubmitButton() {
    const isUsernameValid = validateField('username', usernameInput, usernameError);
    const isPasswordValid = validateField('password', passwordInput, passwordError);

    loginButton.disabled = !(isUsernameValid && isPasswordValid &&
                            usernameInput.value.trim() !== '' &&
                            passwordInput.value.trim() !== '');
}

/**
 * Toggles password visibility
 */
function togglePasswordVisibility() {
    const showElement = togglePasswordButton.querySelector('.show-password');
    const hideElement = togglePasswordButton.querySelector('.hide-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showElement.style.display = 'none';
        hideElement.style.display = 'inline';
    } else {
        passwordInput.type = 'password';
        showElement.style.display = 'inline';
        hideElement.style.display = 'none';
    }
}

/**
 * Validates the entire form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    const isUsernameValid = validateField('username', usernameInput, usernameError);
    const isPasswordValid = validateField('password', passwordInput, passwordError);
    return isUsernameValid && isPasswordValid;
}

// Initialize validation when DOM is loaded
document.addEventListener('DOMContentLoaded', initValidation);

// Export validation function for use in authentication module
window.validateForm = validateForm;
