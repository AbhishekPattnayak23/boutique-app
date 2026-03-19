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
