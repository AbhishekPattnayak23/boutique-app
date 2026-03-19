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

  // Demo user data (in production this would come from a secure backend)
  const validUsers = [
    { username: 'user1', password: 'password1' },
    { username: 'admin', password: 'admin123' },
    { email: 'test@example.com', password: 'password123', id: 'user-123' }
  ];

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
 * Authenticates a user with the provided credentials
 * @param {string} username - The username or email to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Promise<Object>} - Promise resolving to authentication result
 */
function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    console.log(`Authentication attempt for user: ${username}`);

    // Simulate network delay
    setTimeout(() => {
      try {
        // Validate inputs
        if (!username || !password) {
          return reject(new Error('Username/email and password are required'));
        }

        // Find user by username or email
        const user = validUsers.find(u => 
          (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
          console.log('Authentication successful');
          resolve({
            success: true,
            user: { 
              username: user.username,
              email: user.email,
              id: user.id
            },
            message: 'Login successful'
          });
        } else {
          console.log('Authentication failed - invalid credentials');
          resolve({
            success: false,
            message: 'Invalid username/email or password'
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        reject({
          success: false,
          message: error.message || 'Authentication failed'
        });
      }
    }, 1000); // Simulate network delay
  });
}

// Export the authentication function
window.authenticateUser = authenticateUser;

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { authenticateUser };
}
