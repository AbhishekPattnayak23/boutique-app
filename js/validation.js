/**
 * Form validation module with password strength checking
 * Implements input sanitization and security checks
 */
(function() {
    // Check for required dependencies before executing
    if (!document || !window) {
        console.error('Required DOM APIs are not available');
        return;
    }

    // DOM elements for validation messages
    let emailInput, passwordInput, emailValidation, passwordValidation;

    // Validation patterns
    const PATTERNS = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        // Password must have at least 8 chars, including uppercase, lowercase, number, and special char
        strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'",.<>/?]).{8,}$/,
        // Password must have at least 8 chars and meet at least 2 of: uppercase, lowercase, number, special char
        mediumPassword: /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*()_\-+={}[\]\\|:;'",.<>/?]).{8,}$/
    };

    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input to sanitize
     * @returns {string} - Sanitized input
     */
    function sanitizeInput(input) {
        if (!input) return '';

        try {
            // Create a temporary DOM element
            const tempElement = document.createElement('div');
            tempElement.textContent = input;

            // Return the sanitized content
            return tempElement.innerHTML;
        } catch (error) {
            console.error('Input sanitization failed:', error);

            // Fallback method if DOM manipulation fails
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    }

    /**
     * Validate email format using regex
     * @param {string} email - Email to validate
     * @returns {boolean} - True if email is valid
     */
    function validateEmail(email) {
        return PATTERNS.email.test(email);
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
     * Check password strength and update UI
     * @param {string} password - Password to check
     * @returns {string} - Strength level: 'weak', 'medium', or 'strong'
     */
    function checkPasswordStrength(password) {
        // Get strength indicator elements
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthBar = strengthContainer.querySelector('.strength-bar');
        const strengthText = strengthContainer.querySelector('.strength-text');

        // Default to weak
        let strength = 'weak';
        let message = 'Weak - Add numbers and uppercase letters';

        // Check against patterns
        if (PATTERNS.strongPassword.test(password)) {
            strength = 'strong';
            message = 'Strong password';
        } else if (PATTERNS.mediumPassword.test(password)) {
            strength = 'medium';
            message = 'Medium - Add special characters';
        }

        // Update UI
        strengthContainer.classList.add('active');

        // Remove existing strength classes
        strengthBar.classList.remove('weak', 'medium', 'strong');

        // Add appropriate strength class
        strengthBar.classList.add(strength);

        // Update text
        strengthText.textContent = message;

        return strength;
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

        const sanitizedEmail = sanitizeInput(email);
        
        if (!sanitizedEmail) {
            emailValidation.textContent = 'Email is required';
            emailInput.classList.add('error');
            return false;
        }

        const isValid = validateEmail(sanitizedEmail);

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

    /**
     * Initialize form validation
     */
    function init() {
        try {
            // Get form elements
            emailInput = document.getElementById('email');
            passwordInput = document.getElementById('password');
            emailValidation = document.getElementById('emailValidation');
            passwordValidation = document.getElementById('passwordValidation');

            if (!emailInput || !passwordInput || !emailValidation || !passwordValidation) {
                console.error('Required form elements not found');
                return;
            }

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

                // Check password strength on input
                if (passwordInput.value.length > 0) {
                    checkPasswordStrength(passwordInput.value);
                } else {
                    // Hide strength indicator if password is empty
                    document.getElementById('passwordStrength').classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Validation initialization failed:', error);
        }
    }

    // Initialize validation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public methods
    window.formValidator = {
        validateEmail,
        validatePassword,
        checkPasswordStrength,
        sanitizeInput
    };
})();
/**
 * Form validation module - Handles all input validation with optimized performance
 */
(function() {
    'use strict';

    // Cache DOM elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const passwordStrengthMeter = document.getElementById('passwordStrength');
    const passwordToggle = document.getElementById('passwordToggle');

    // Configuration
    const DEBOUNCE_DELAY = 300; // ms

    /**
     * Email validation regex pattern
     * Balancing between strict validation and RFC compliance
     */
    const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    /**
     * Debounce function to limit the rate at which a function can fire
     * @param {Function} func - The function to debounce
     * @param {number} delay - The debounce delay in milliseconds
     * @returns {Function} - The debounced function
     */
    function debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Validates email input
     * @param {string} email - The email to validate
     * @returns {string|null} - Error message or null if valid
     */
    function validateEmail(email) {
        if (!email) {
            return "Email is required";
        }

        if (!EMAIL_PATTERN.test(email)) {
            return "Please enter a valid email address";
        }

        return null;
    }

    /**
     * Validates password input with strength check
     * @param {string} password - The password to validate
     * @returns {Object} - Contains error message and strength level
     */
    function validatePassword(password) {
        const result = { error: null, strength: 'none' };

        if (!password) {
            result.error = "Password is required";
            return result;
        }

        if (password.length < 8) {
            result.error = "Password must be at least 8 characters long";
            result.strength = 'weak';
            return result;
        }

        // Calculate password strength
        let strength = 0;

        // Length check
        if (password.length >= 12) strength += 1;

        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 1; // Uppercase
        if (/[a-z]/.test(password)) strength += 1; // Lowercase
        if (/[0-9]/.test(password)) strength += 1; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special chars

        // Map strength score to descriptive levels
        if (strength <= 1) result.strength = 'weak';
        else if (strength === 2) result.strength = 'medium';
        else if (strength === 3 || strength === 4) result.strength = 'strong';
        else result.strength = 'very-strong';

        return result;
    }

    /**
     * Updates the UI with email validation results
     * @param {Event} e - The input event
     */
    const handleEmailValidation = debounce(function(e) {
        const email = e.target.value.trim();
        const error = validateEmail(email);

        if (error) {
            emailInput.classList.add('error');
            emailError.textContent = error;
        } else {
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }
    }, DEBOUNCE_DELAY);

    /**
     * Updates the UI with password validation results
     * @param {Event} e - The input event
     */
    const handlePasswordValidation = debounce(function(e) {
        const password = e.target.value;
        const { error, strength } = validatePassword(password);

        // Update error state
        if (error) {
            passwordInput.classList.add('error');
            passwordError.textContent = error;
        } else {
            passwordInput.classList.remove('error');
            passwordError.textContent = '';
        }

        // Update strength meter
        passwordStrengthMeter.className = 'password-strength-meter';
        if (strength !== 'none') {
            passwordStrengthMeter.classList.add(strength);

            // Set ARIA attributes for accessibility
            const strengthText = {
                'weak': 'Weak password',
                'medium': 'Medium strength password',
                'strong': 'Strong password',
                'very-strong': 'Very strong password'
            };
            passwordStrengthMeter.setAttribute('aria-label', strengthText[strength]);
        } else {
            passwordStrengthMeter.removeAttribute('aria-label');
        }
    }, DEBOUNCE_DELAY);

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const isVisible = passwordInput.type === 'text';
        passwordInput.type = isVisible ? 'password' : 'text';
        passwordToggle.querySelector('.show-password').textContent = isVisible ? 'Show' : 'Hide';
        passwordToggle.setAttribute('aria-label',
            `${isVisible ? 'Show' : 'Hide'} password`
        );
    }

    /**
     * Validates the entire form
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm() {
        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value;

        const emailError = validateEmail(emailVal);
        const { error: passwordError } = validatePassword(passwordVal);

        // Update UI with any errors
        handleEmailValidation({ target: emailInput });
        handlePasswordValidation({ target: passwordInput });

        return !emailError && !passwordError;
    }

    // Initialize event listeners
    function init() {
        // Input validation events
        emailInput.addEventListener('input', handleEmailValidation);
        passwordInput.addEventListener('input', handlePasswordValidation);

        // Password toggle
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.formValidator = {
        validateForm,
        validateEmail,
        validatePassword
    };
})();
