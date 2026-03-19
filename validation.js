/**
 * Form Validation Module
 * Provides comprehensive validation for login forms
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  // Cache DOM elements
  const formElements = {
    form: document.getElementById('loginForm'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    emailError: document.getElementById('emailError'),
    passwordError: document.getElementById('passwordError')
  };

  // Validation patterns
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^.{8,}$/ // At least 8 characters
  };

  // Validation rules
  const validators = {
    email: (value) => {
      if (!value) return 'Email address is required.';
      if (!patterns.email.test(value)) return 'Please enter a valid email address.';
      return null;
    },

    password: (value) => {
      if (!value) return 'Password is required.';
      if (!patterns.password.test(value)) return 'Password must be at least 8 characters.';
      return null;
    }
  };

  // Initialize validation
  function initValidation() {
    if (!formElements.form) {
      console.error('Login form not found on page.');
      return;
    }

    // Add input validation events
    if (formElements.email) {
      formElements.email.addEventListener('blur', function() {
        validateField('email', this.value);
      });
      formElements.email.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField('email', this.value);
        }
      });
    }

    if (formElements.password) {
      formElements.password.addEventListener('blur', function() {
        validateField('password', this.value);
      });
      formElements.password.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField('password', this.value);
        }
      });
    }

    // Form submission validation
    formElements.form.addEventListener('submit', validateForm);
  }

  // Validate a single field
  function validateField(fieldName, value) {
    const field = formElements[fieldName];
    const errorElement = formElements[fieldName + 'Error'];

    if (!field || !errorElement) return false;

    const error = validators[fieldName](value);

    if (error) {
      field.classList.add('error');
      errorElement.textContent = error;
      errorElement.classList.add('visible');
      return false;
    } else {
      field.classList.remove('error');
      errorElement.classList.remove('visible');
      return true;
    }
  }

  // Validate entire form
  function validateForm(e) {
    const isEmailValid = validateField('email', formElements.email.value);
    const isPasswordValid = validateField('password', formElements.password.value);

    if (!isEmailValid || !isPasswordValid) {
      e.preventDefault();
      return false;
    }

    // Form is valid at this point - the auth.js will handle the submission
    return true;
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidation);
  } else {
    initValidation();
  }
})();
