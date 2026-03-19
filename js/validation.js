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
