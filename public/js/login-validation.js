/**
 * Login form validation script
 * Handles form validation and provides user feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      // Reset error state
      resetErrors();

      // Validate email
      if (!validateEmail(emailInput.value)) {
        event.preventDefault();
        showError('Please enter a valid email address');
        emailInput.classList.add('error-input');
        return;
      }

      // Validate password
      if (passwordInput.value.length < 8) {
        event.preventDefault();
        showError('Password must be at least 8 characters long');
        passwordInput.classList.add('error-input');
        return;
      }
    });

    // Add input event listeners to clear errors when user starts typing
    emailInput.addEventListener('input', function() {
      emailInput.classList.remove('error-input');
      if (errorMessage.classList.contains('visible')) {
        resetErrors();
      }
    });

    passwordInput.addEventListener('input', function() {
      passwordInput.classList.remove('error-input');
      if (errorMessage.classList.contains('visible')) {
        resetErrors();
      }
    });
  }

  /**
   * Validates email format
   * @param {string} email - The email to validate
   * @returns {boolean} True if email is valid
   */
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  /**
   * Shows error message
   * @param {string} message - The error message to display
   */
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
  }

  /**
   * Resets all error states
   */
  function resetErrors() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('visible');
    emailInput.classList.remove('error-input');
    passwordInput.classList.remove('error-input');
  }
});
