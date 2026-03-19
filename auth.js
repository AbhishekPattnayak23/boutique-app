/**
 * Authentication Module
 * Handles user authentication with comprehensive error handling and validation.
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  // Module state
  const authState = {
    isAuthenticated: false,
    currentUser: null,
    loginAttempts: 0,
    maxLoginAttempts: 3,
    lockedOut: false,
    lockoutTime: null
  };

  // Configuration
  const config = {
    loginEndpoint: '/api/login', // Replace with actual endpoint
    redirectUrl: '/dashboard',   // Replace with actual redirect URL
    requestTimeout: 8000         // 8 seconds timeout
  };

  // Valid users (in production this would come from a secure backend)
  const validUsers = [
    { username: 'user1', password: 'password1', role: 'user' },
    { username: 'admin', password: 'admin123', role: 'admin' },
    { email: 'test@example.com', password: 'password123', id: 'user-123', role: 'user' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  // DOM Elements
  const elements = {
    form: document.getElementById('loginForm'),
    email: document.getElementById('email'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    submitButton: document.getElementById('loginButton'),
    successMessage: document.getElementById('loginSuccess'),
    forgotPassword: document.getElementById('forgotPassword'),
    createAccount: document.getElementById('createAccount'),
    authStatus: document.getElementById('auth-status'),
    logoutButton: document.getElementById('logout-button')
  };

  /**
   * Initialize the authentication system
   */
  function initAuth() {
    console.log('Authentication system initialized');

    // Check for existing session
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        authState.currentUser = JSON.parse(savedUser);
        authState.isAuthenticated = true;
        console.log('User session restored');
        updateAuthUI();
      } catch (error) {
        console.error('Failed to restore session:', error);
        sessionStorage.removeItem('currentUser');
      }
    }

    // Set up login form event listeners
    if (elements.form) {
      elements.form.addEventListener('submit', handleLogin);
    }

    // Set up logout button event listeners
    if (elements.logoutButton) {
      elements.logoutButton.addEventListener('click', handleLogout);
    }

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

    updateAuthUI();
  }

  /**
   * Handle login form submission
   * @param {Event} e - The form submit event
   */
  function handleLogin(e) {
    e.preventDefault();

    // Check for lockout
    if (authState.lockedOut) {
      const now = new Date();
      if (now < authState.lockoutTime) {
        const minutesLeft = Math.ceil((authState.lockoutTime - now) / (1000 * 60));
        showErrorMessage(`Account temporarily locked. Try again in ${minutesLeft} minutes.`);
        return;
      } else {
        // Reset lockout
        authState.lockedOut = false;
        authState.loginAttempts = 0;
      }
    }

    // Get form data - support both email and username fields
    const identifier = elements.email ? elements.email.value.trim() : 
                      (elements.username ? elements.username.value.trim() : '');
    const password = elements.password.value;

    // Validate inputs
    if (!identifier || !password) {
      showErrorMessage('Username/email and password are required');
      return;
    }

    // Show loading state
    setLoadingState(true);

    // Call authenticateUser function
    authenticateUser(identifier, password)
      .then(response => {
        setLoadingState(false);

        if (response.success) {
          // Update auth state
          authState.isAuthenticated = true;
          authState.currentUser = response.user;
          authState.loginAttempts = 0;

          // Save to session
          sessionStorage.setItem('currentUser', JSON.stringify({
            username: response.user.username || response.user.email,
            email: response.user.email,
            id: response.user.id,
            role: response.user.role
          }));

          showSuccessMessage('Login successful! Redirecting...');
          updateAuthUI();

          // Redirect after delay
          setTimeout(() => {
            window.location.href = config.redirectUrl;
          }, 1500);
        } else {
          handleFailedLogin();
        }
      })
      .catch(error => {
        setLoadingState(false);
        showErrorMessage(error.message || 'An error occurred. Please try again later.');
        console.error('Login error:', error);
      });
  }

  /**
   * Handle failed login attempts
   */
  function handleFailedLogin() {
    authState.loginAttempts++;

    if (authState.loginAttempts >= authState.maxLoginAttempts) {
      // Lock out the account
      authState.lockedOut = true;
      authState.lockoutTime = new Date(Date.now() + 5 * 60000); // 5 minutes
      showErrorMessage('Too many failed attempts. Account locked for 5 minutes.');
    } else {
      const attemptsLeft = authState.maxLoginAttempts - authState.loginAttempts;
      showErrorMessage(`Invalid username/email or password. ${attemptsLeft} attempts remaining.`);
    }
  }

  /**
   * Handle user logout
   */
  function handleLogout() {
    authState.isAuthenticated = false;
    authState.currentUser = null;
    sessionStorage.removeItem('currentUser');
    showFeedback('info', 'You have been logged out');
    updateAuthUI();

    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  /**
   * Update UI based on authentication state
   */
  function updateAuthUI() {
    const protectedContent = document.querySelectorAll('.protected-content');

    if (elements.authStatus) {
      if (authState.isAuthenticated && authState.currentUser) {
        elements.authStatus.textContent = `Logged in as: ${authState.currentUser.username || authState.currentUser.email}`;
        elements.authStatus.className = 'status-logged-in';
      } else {
        elements.authStatus.textContent = 'Not logged in';
        elements.authStatus.className = 'status-logged-out';
      }
    }

    if (elements.form) {
      elements.form.style.display = authState.isAuthenticated ? 'none' : 'block';
    }

    if (elements.logoutButton) {
      elements.logoutButton.style.display = authState.isAuthenticated ? 'block' : 'none';
    }

    // Toggle protected content visibility
    protectedContent.forEach(element => {
      element.style.display = authState.isAuthenticated ? 'block' : 'none';
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
    showFeedback('success', message);
  }

  // Helper: Show error message
  function showErrorMessage(message) {
    console.error('Authentication error:', message);
    showFeedback('error', message);
  }

  /**
   * Display feedback to the user
   * @param {string} type - The type of feedback (success, error, info)
   * @param {string} message - The message to display
   */
  function showFeedback(type, message) {
    if (typeof displayFeedback === 'function') {
      displayFeedback(type, message);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);

      // For simple demo, show alert (in production, use a better UI component)
      if (type === 'error') {
        alert('Error: ' + message);
      } else if (type === 'success' && !elements.successMessage) {
        alert('Success: ' + message);
      }
    }
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
  
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
                id: user.id,
                role: user.role
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
})();

// Expose public API
window.auth = {
  isAuthenticated: () => authState.isAuthenticated,
  getCurrentUser: () => authState.currentUser,
  logout: handleLogout,
  authenticateUser: authenticateUser
};

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { authenticateUser };
}
