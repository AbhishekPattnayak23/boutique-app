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
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Validation result
     */
    function validateEmail(email) {
        return PATTERNS.email.test(email);
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
     * Initialize form validation
     */
    function init() {
        try {
            // Get form elements
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            // Add validation for email
            if (emailInput) {
                emailInput.addEventListener('blur', function() {
                    const sanitizedEmail = sanitizeInput(this.value.trim());
                    if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
                        emailError.textContent = 'Please enter a valid email address';
                    } else {
                        emailError.textContent = '';
                    }
                });

                // Clear error on input
                emailInput.addEventListener('input', function() {
                    emailError.textContent = '';
                });
            }

            // Add validation and strength checking for password
            if (passwordInput) {
                // Check strength on input
                passwordInput.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        checkPasswordStrength(this.value);
                    } else {
                        // Hide strength indicator if password is empty
                        document.getElementById('passwordStrength').classList.remove('active');
                    }
                });

                // Validate on blur
                passwordInput.addEventListener('blur', function() {
                    if (this.value && this.value.length < 8) {
                        passwordError.textContent = 'Password must be at least 8 characters';
                    } else {
                        passwordError.textContent = '';
                    }
                });
            }
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
        checkPasswordStrength,
        sanitizeInput
    };
})();
