/**
 * Form Validation Module
 * Provides comprehensive client-side validation for form inputs
 */

// Validation configuration - can be extended for more validation types
const validationRules = {
  required: {
    validate: value => value.trim() !== '',
    message: 'This field is required'
  },
  email: {
    validate: value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: {
    validate: (value, length) => value.length >= length,
    message: (length) => `Must be at least ${length} characters`
  },
  maxLength: {
    validate: (value, length) => value.length <= length,
    message: (length) => `Must not exceed ${length} characters`
  }
};

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
    validator.element.classList.toggle('invalid', !!errorMessage);
    return !errorMessage;
  }

  // Validate the entire form
  validateForm() {
    let isValid = true;

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
      this.formStatus.textContent = 'Validating...';
      this.formStatus.classList.add('status-info');
      this.formStatus.classList.remove('status-error', 'status-success');
    }

    // This is where you would call your auth logic
    if (typeof authenticateUser === 'function') {
      const emailValue = this.validators.email.element.value;
      const passwordValue = this.validators.password.element.value;

      try {
        authenticateUser(emailValue, passwordValue)
          .then(result => {
            this.showSubmissionResult(true, 'Login successful!');
          })
          .catch(error => {
            this.showSubmissionResult(false, error.message || 'Authentication failed');
          });
      } catch (error) {
        this.showSubmissionResult(false, 'An error occurred during authentication');
        console.error('Authentication error:', error);
      }
    } else {
      console.log('Form is valid! Ready for submission');
      this.showSubmissionResult(true, 'Form validated successfully (auth.js not loaded)');
    }
  }

  // Display submission result to user
  showSubmissionResult(isSuccess, message) {
    if (this.formStatus) {
      this.formStatus.textContent = message;
      this.formStatus.classList.remove('status-info');

      if (isSuccess) {
        this.formStatus.classList.add('status-success');
        this.formStatus.classList.remove('status-error');
      } else {
        this.formStatus.classList.add('status-error');
        this.formStatus.classList.remove('status-success');
      }
    }
  }
}

// Initialize validation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.formValidator = new FormValidator('loginForm');
  } catch (error) {
    console.error('Failed to initialize form validation:', error);
  }
});

// Export utility functions for testing and reuse
window.FormValidator = FormValidator;
window.validationRules = validationRules;
