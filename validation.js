/**
 * Form Validation Module
 * Provides comprehensive client-side validation for login form
 */

// Form validation configuration
const validationConfig = {
  username: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9._-]+$/,
    required: true,
    errorMessages: {
      required: 'Username is required',
      minLength: 'Username must be at least 3 characters',
      maxLength: 'Username cannot exceed 50 characters',
      pattern: 'Username can only contain letters, numbers, and ._-'
    }
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    required: true,
    errorMessages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  }
};

// Validation utilities
const Validator = {
  /**
   * Validates a field value against configuration rules
   * @param {string} fieldName - The name of the field
   * @param {string} value - The value to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  validateField: function(fieldName, value) {
    const config = validationConfig[fieldName];
    let isValid = true;
    let errorMessage = '';

    if (!config) {
      console.error(`No validation configuration found for field: ${fieldName}`);
      return { isValid: true, errorMessage: '' };
    }

    // Required check
    if (config.required && !value.trim()) {
      return { isValid: false, errorMessage: config.errorMessages.required };
    }

    // Skip other validations if empty and not required
    if (!value.trim() && !config.required) {
      return { isValid: true, errorMessage: '' };
    }

    // Min length check
    if (config.minLength && value.length < config.minLength) {
      return { isValid: false, errorMessage: config.errorMessages.minLength };
    }

    // Max length check
    if (config.maxLength && value.length > config.maxLength) {
      return { isValid: false, errorMessage: config.errorMessages.maxLength };
    }

    // Pattern check
    if (config.pattern && !config.pattern.test(value)) {
      return { isValid: false, errorMessage: config.errorMessages.pattern };
    }

    return { isValid, errorMessage };
  },

  /**
   * Displays error message for a field
   * @param {string} fieldName - The name of the field
   * @param {string} errorMessage - The error message to display
   */
  showError: function(fieldName, errorMessage) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = errorMessage ? 'block' : 'none';

      // Add error class to the input field
      const inputField = document.getElementById(fieldName);
      if (inputField) {
        inputField.classList.add('is-invalid');
      }
    }
  },

  /**
   * Clears error message for a field
   * @param {string} fieldName - The name of the field
   */
  clearError: function(fieldName) {
    this.showError(fieldName, '');
    const inputField = document.getElementById(fieldName);
    if (inputField) {
      inputField.classList.remove('is-invalid');
    }
  },

  /**
   * Validates the entire form
   * @param {HTMLFormElement} form - The form to validate
   * @returns {boolean} - Whether the form is valid
   */
  validateForm: function(form) {
    let isFormValid = true;

    // Validate each field in the form that has a validation config
    for (const fieldName in validationConfig) {
      const field = form.elements[fieldName];
      if (field) {
        const { isValid, errorMessage } = this.validateField(fieldName, field.value);
        if (!isValid) {
          this.showError(fieldName, errorMessage);
          isFormValid = false;
        } else {
          this.clearError(fieldName);
        }
      }
    }

    return isFormValid;
  }
};

// Set up form validation
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    // Add validation for each input on blur
    for (const fieldName in validationConfig) {
      const field = loginForm.elements[fieldName];
      if (field) {
        field.addEventListener('blur', function() {
          const { isValid, errorMessage } = Validator.validateField(fieldName, this.value);
          if (!isValid) {
            Validator.showError(fieldName, errorMessage);
          } else {
            Validator.clearError(fieldName);
          }
        });

        // Clear errors when user starts typing
        field.addEventListener('input', function() {
          Validator.clearError(fieldName);
        });
      }
    }

    // Form submission handling
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (Validator.validateForm(this)) {
        console.log('Form is valid, proceeding with submission');
        // Authentication will be handled by auth.js
      } else {
        console.log('Form validation failed');
      }
    });
  }
});
