/**
 * Input Validation Module
 * Provides form validation functions
 */

/**
 * Validates the login form input fields
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @returns {boolean} - True if validation passes, false otherwise
 */
function validateLoginForm(username, password) {
    // Reset any previous error indicators
    resetValidationErrors();

    let isValid = true;
    const errors = [];

    // Validate username
    if (!username) {
        errors.push('Username is required');
        markFieldInvalid('username');
        isValid = false;
    } else if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
        markFieldInvalid('username');
        isValid = false;
    }

    // Validate password
    if (!password) {
        errors.push('Password is required');
        markFieldInvalid('password');
        isValid = false;
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
        markFieldInvalid('password');
        isValid = false;
    }

    // Display validation errors if any
    if (!isValid && window.feedbackManager) {
        window.feedbackManager.showError(errors.join('. '));
    }

    return isValid;
}

/**
 * Marks an input field as invalid with a red border
 * @param {string} fieldId - The ID of the field to mark
 */
function markFieldInvalid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#dc3545';

        // Reset validation styling on input
        field.addEventListener('input', function onInput() {
            this.style.borderColor = '';
            this.removeEventListener('input', onInput);
        });
    }
}

/**
 * Resets all validation error indicators
 */
function resetValidationErrors() {
    const fields = ['username', 'password'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '';
        }
    });
}

// Export validation functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateLoginForm };
}
