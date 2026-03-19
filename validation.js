/**
 * Validation Module
 * Handles form input validation with comprehensive error reporting
 */

// Validation rules
const validationRules = {
  required: {
    test: value => value !== undefined && value !== null && value.toString().trim() !== '',
    message: 'This field is required'
  },
  email: {
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: (length) => ({
    test: value => value && value.length >= length,
    message: `Must be at least ${length} characters`
  }),
  maxLength: (length) => ({
    test: value => !value || value.length <= length,
    message: `Cannot exceed ${length} characters`
  }),
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

// Initialize validation
initFormValidation();

// Expose API
window.validateForm = validateForm;
