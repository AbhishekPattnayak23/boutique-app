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

    // Call authenticateUser function 
    authenticateUser(email, password)
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
        showErrorMessage(error.message || 'An error occurred. Please try again later.');
        console.error('Login error:', error);
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

/**
 * Simulate authentication with a Promise
 */
function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    console.log(`Authentication attempt for email: ${email}`);

    // Simulate network delay
    setTimeout(() => {
      try {
        // Demo validation - in production this would call an API
        if (!email || !password) {
          return reject(new Error('Email and password are required'));
        }

        // For demo purposes only - NEVER use this in production
        // This is just to demonstrate the validation flow
        if (email === 'test@example.com' && password === 'password123') {
          console.log('Authentication successful');
          return resolve({
            success: true,
            user: { email, id: 'user-123' }
          });
        }

        console.log('Authentication failed - invalid credentials');
        reject(new Error('Invalid email or password'));
      } catch (error) {
        console.error('Authentication error:', error);
        reject(new Error('Authentication failed'));
      }
    }, 1000); // Simulate network delay
  });
}

// Export the authentication function
window.authenticateUser = authenticateUser;
