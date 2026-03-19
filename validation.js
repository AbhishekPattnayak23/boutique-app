/**
 * Form Validation Module
 * Provides comprehensive client-side validation for form inputs
 * @version 1.0.0
 */

// Validation configuration - can be extended for more validation types
const validationRules = {
  required: {
    validate: value => value.trim() !== '',
    test: value => value !== undefined && value !== null && value.toString().trim() !== '',
    message: 'This field is required'
  },
  email: {
    validate: value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: {
    validate: (value, length) => value.length >= length,
    message: (length) => `Must be at least ${length} characters`
  },
  maxLength: {
    validate: (value, length) => value.length <= length,
    message: (length) => `Must not exceed ${length} characters`
  },
  pattern: (regex, message) => ({
    test: value => !value || regex.test(value),
    message: message || 'Invalid format'
  }),
  match: (field, fieldName) => ({
    test: (value, formData) => value === formData[field],
    message: `Must match ${fieldName || field}`
  })
};

/**
 * Creates a debounced function to prevent rapid execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

/**
 * Validate a form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} - Validation result with isValid flag and errors object
 */
function validateForm(form) {
  if (!form || !(form instanceof HTMLFormElement)) {
    console.error('Invalid form element provided for validation');
    return { isValid: false, errors: { _form: 'Invalid form' } };
  }

  const formData = new FormData(form);
  const formValues = {};
  const errors = {};

  // Convert FormData to object
  for (const [key, value] of formData.entries()) {
    formValues[key] = value;
  }

  // Validate each field with data-validate attributes
  const fields = form.querySelectorAll('[data-validate]');
  fields.forEach(field => {
    const fieldName = field.name;
    const value = formValues[fieldName];
    const validations = field.dataset.validate.split(' ');

    // Check each validation rule
    validations.forEach(validation => {
      if (validation === 'required') {
        if (!validationRules.required.test(value)) {
          errors[fieldName] = errors[fieldName] || validationRules.required.message;
        }
      }
      else if (validation === 'email') {
        if (value && !validationRules.email.test(value)) {
          errors[fieldName] = errors[fieldName] || validationRules.email.message;
        }
      }
      else if (validation.startsWith('min:')) {
        const length = parseInt(validation.split(':')[1], 10);
        const rule = validationRules.minLength(length);
        if (value && !rule.test(value)) {
          errors[fieldName] = errors[fieldName] || rule.message;
        }
      }
      else if (validation.startsWith('max:')) {
        const length = parseInt(validation.split(':')[1], 10);
        const rule = validationRules.maxLength(length);
        if (!rule.test(value)) {
          errors[fieldName] = errors[fieldName] || rule.message;
        }
      }
      else if (validation.startsWith('match:')) {
        const targetField = validation.split(':')[1];
        const targetName = form.querySelector(`[name="${targetField}"]`)?.getAttribute('placeholder') || targetField;
        const rule = validationRules.match(targetField, targetName);
        if (value && !rule.test(value, formValues)) {
          errors[fieldName] = errors[fieldName] || rule.message;
        }
      }
    });
  });

  // Show validation errors in the UI
  showValidationErrors(form, errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Show validation errors in the UI
 * @param {HTMLFormElement} form - The form with errors
 * @param {Object} errors - Errors object with field names as keys
 */
function showValidationErrors(form, errors) {
  // First clear all existing error messages
  const existingErrors = form.querySelectorAll('.validation-error');
  existingErrors.forEach(el => el.parentNode.removeChild(el));

  // Reset error styling
  form.querySelectorAll('.has-error').forEach(field => {
    field.classList.remove('has-error');
  });

  // Add new error messages
  for (const [fieldName, message] of Object.entries(errors)) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      // Add error class to field
      field.classList.add('has-error');

      // Create error message element
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      errorElement.textContent = message;

      // Insert after the field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  document.addEventListener('DOMContentLoaded', () => {
    // Find all forms with data-validate attribute
    const forms = document.querySelectorAll('form[data-validate="true"]');

    forms.forEach(form => {
      form.addEventListener('submit', (event) => {
        const validation = validateForm(form);

        if (!validation.isValid) {
          event.preventDefault();
          console.log('Form validation failed', validation.errors);

          // Show feedback message
          if (typeof displayFeedback === 'function') {
            displayFeedback('error', 'Please correct the errors in the form');
          }
        }
      });

      // Add blur validation for immediate feedback
      const fields = form.querySelectorAll('[data-validate]');
      fields.forEach(field => {
        field.addEventListener('blur', () => {
          // Create a mini-form for just this field
          const fieldForm = document.createElement('form');
          const clonedField = field.cloneNode(true);
          fieldForm.appendChild(clonedField);

          // Validate just this field
          const validation = validateForm(fieldForm);

          // Show errors only for this field
          if (!validation.isValid) {
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.textContent = validation.errors[field.name];

            // Remove existing error for this field
            const existingError = field.parentNode.querySelector('.validation-error');
            if (existingError) {
              existingError.parentNode.removeChild(existingError);
            }

            field.classList.add('has-error');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
          } else {
            // Clear error for this field
            field.classList.remove('has-error');
            const existingError = field.parentNode.querySelector('.validation-error');
            if (existingError) {
              existingError.parentNode.removeChild(existingError);
            }
          }
        });
      });
    });
  });
}

// Validation controller
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.error(`Form with ID '${formId}' not found`);
      return;
    }

    this.formStatus = document.getElementById('formStatus');
    this.validators = {};
    this.setupValidation();
  }

  // Setup validation for the form
  setupValidation() {
    try {
      // Prevent default form submission and handle validation
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm()) {
          this.handleFormSubmission();
        }
      });

      // Setup field-level validation
      this.setupEmailValidation();
      this.setupPasswordValidation();

      // Setup live validation on input change
      this.setupLiveValidation();

      console.log('Form validation initialized successfully');
    } catch (error) {
      console.error('Error setting up form validation:', error);
    }
  }

  // Setup email field validation
  setupEmailValidation() {
    const emailInput = this.form.querySelector('#email');
    const emailError = document.getElementById('emailError');

    if (emailInput && emailError) {
      this.validators.email = {
        element: emailInput,
        errorElement: emailError,
        validate: () => {
          const value = emailInput.value;
          if (!validationRules.required.validate(value)) {
            return validationRules.required.message;
          }
          if (!validationRules.email.validate(value)) {
            return validationRules.email.message;
          }
          return null; // Validation passed
        }
      };
    }
  }

  // Setup password field validation
  setupPasswordValidation() {
    const passwordInput = this.form.querySelector('#password');
    const passwordError = document.getElementById('passwordError');

    if (passwordInput && passwordError) {
      this.validators.password = {
        element: passwordInput,
        errorElement: passwordError,
        validate: () => {
          const value = passwordInput.value;
          if (!validationRules.required.validate(value)) {
            return validationRules.required.message;
          }
          if (!validationRules.minLength.validate(value, 8)) {
            return validationRules.minLength.message(8);
          }
          return null; // Validation passed
        }
      };
    }
  }

  // Setup live validation as user types
  setupLiveValidation() {
    Object.values(this.validators).forEach(validator => {
      validator.element.addEventListener('input', () => {
        if (validator.element.classList.contains('invalid')) {
          this.validateField(validator);
        }
      });

      validator.element.addEventListener('blur', () => {
        this.validateField(validator);
      });
    });
  }

  // Validate a specific field
  validateField(validator) {
    const errorMessage = validator.validate();
    validator.errorElement.textContent = errorMessage || '';
    
    if (errorMessage) {
      validator.element.classList.add('invalid');
      validator.element.classList.remove('valid');
      return false;
    } else {
      validator.element.classList.remove('invalid');
      validator.element.classList.add('valid');
      return true;
    }
  }
  
  // Validate the entire form
  validateForm() {
    let isValid = true;
    
    // Validate each field
    Object.values(this.validators).forEach(validator => {
      if (!this.validateField(validator)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Handle form submission
  handleFormSubmission() {
    if (this.formStatus) {
      this.formStatus.textContent = 'Form submitted successfully!';
      this.formStatus.className = 'status-success';
    }
    
    // Additional form submission logic can go here
    console.log('Form validated and submitted');
  }
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateForm,
    validateLoginForm,
    FormValidator,
    validationRules,
    debounce
  };
}
