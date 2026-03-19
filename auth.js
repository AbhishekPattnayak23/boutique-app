/**
 * Authentication Module
 * Handles login form submission and authentication process
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  // Configuration
  const config = {
    loginEndpoint: '/api/login', // Replace with actual endpoint
    redirectUrl: '/dashboard',   // Replace with actual redirect URL
    requestTimeout: 8000         // 8 seconds timeout
  };

  // DOM Elements
  const elements = {
    form: document.getElementById('loginForm'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    submitButton: document.getElementById('loginButton'),
    successMessage: document.getElementById('loginSuccess'),
    forgotPassword: document.getElementById('forgotPassword'),
    createAccount: document.getElementById('createAccount')
  };

  // Initialize Auth Module
  function initAuth() {
    if (!elements.form) {
      console.error('Login form not found on page.');
      return;
    }

    // Handle form submission
    elements.form.addEventListener('submit', handleLogin);

    // Handle forgot password
    if (elements.forgotPassword) {
      elements.forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        // Redirect to password reset page or show modal
        console.log('Forgot password clicked');
      });
    }

    // Handle create account
    if (elements.createAccount) {
      elements.createAccount.addEventListener('click', function(e) {
        e.preventDefault();
        // Redirect to registration page
        console.log('Create account clicked');
      });
    }
  }

  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault();

    // Get form data
    const email = elements.email.value.trim();
    const password = elements.password.value;

    // Show loading state
    setLoadingState(true);

    // Simulate API call (in production, replace with actual API call)
    // This is a mock implementation for demo purposes
    simulateAuthApiCall(email, password)
      .then(response => {
        setLoadingState(false);

        if (response.success) {
          showSuccessMessage('Login successful! Redirecting...');

          // In production, you might store tokens in localStorage/sessionStorage here

          // Redirect after delay
          setTimeout(() => {
            window.location.href = config.redirectUrl;
          }, 1500);
        } else {
          showErrorMessage(response.message || 'Authentication failed. Please try again.');
        }
      })
      .catch(error => {
        setLoadingState(false);
        showErrorMessage('An error occurred. Please try again later.');
        console.error('Login error:', error);
      });
  }

  // Simulate authentication API call
  function simulateAuthApiCall(email, password) {
    return new Promise((resolve, reject) => {
      console.log('Attempting login for:', email);

      // Simulate API delay
      setTimeout(() => {
        // For demo purposes, accept any credentials
        // In production, this would be an actual API call
        if (email && password) {
          resolve({
            success: true,
            user: { email },
            token: 'sample-jwt-token'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid credentials'
          });
        }
      }, 1500);

      // Simulate request timeout
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, config.requestTimeout);
    });
  }

  // Helper: Set loading state
  function setLoadingState(isLoading) {
    if (elements.submitButton) {
      if (isLoading) {
        elements.submitButton.classList.add('btn-loading');
      } else {
        elements.submitButton.classList.remove('btn-loading');
      }
    }
  }

  // Helper: Show success message
  function showSuccessMessage(message) {
    if (elements.successMessage) {
      elements.successMessage.textContent = message;
      elements.successMessage.classList.add('visible');
    }
  }

  // Helper: Show error message
  function showErrorMessage(message) {
    // Add general error message to the page
    // This could be enhanced to add a message box above the form
    console.error('Authentication error:', message);

    // For demo purposes, show error in an alert
    // In production, use a better UI component
    alert('Error: ' + message);
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
