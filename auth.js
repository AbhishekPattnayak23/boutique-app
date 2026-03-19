/**
 * Authentication Module
 * Handles user authentication with comprehensive error handling and validation.
 * @version 1.0.0
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  'use strict';
  
  // Module state
  const authState = {
    isAuthenticated: false,
    currentUser: null,
    loginAttempts: 0,
    maxLoginAttempts: 3,
    lockedOut: false,
    lockoutTime: null,
    isLoading: false
  };

  // Configuration
  const config = {
    loginEndpoint: '/api/login', // Replace with actual endpoint
    redirectUrl: '/dashboard',   // Replace with actual redirect URL
    requestTimeout: 8000         // 8 seconds timeout
  };

  // Valid users (in production this would come from a secure backend)
  const validUsers = [
    { username: 'user1', password: 'password1', role: 'user', name: 'Demo User' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { email: 'test@example.com', password: 'password123', id: 'user-123', role: 'user' },
    { username: 'user', password: 'user123', role: 'user' },
    { email: 'demo@example.com', password: 'password123', id: 'user-demo', role: 'user' }
  ];

  // DOM Elements
  const elements = {
    form: document.getElementById('loginForm') || document.getElementById('login-form'),
    email: document.getElementById('email') || document.getElementById('emailField'),
    username: document.getElementById('username'),
    password: document.getElementById('password') || document.getElementById('passwordField'),
    submitButton: document.getElementById('loginButton') || document.getElementById('login-button'),
    successMessage: document.getElementById('loginSuccess'),
    forgotPassword: document.getElementById('forgotPassword'),
    createAccount: document.getElementById('createAccount'),
    authStatus: document.getElementById('auth-status'),
    logoutButton: document.getElementById('logout-button'),
    feedbackMessage: document.getElementById('feedbackMessage')
  };

  /**
   * Initialize the authentication system
   */
  function initAuth() {
    console.log('Authentication system initialized');

    // Check for existing session
    const savedUser = sessionStorage.getItem('currentUser') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        authState.currentUser = JSON.parse(savedUser);
        authState.isAuthenticated = true;
        console.log('User session restored');
        updateAuthUI();
      } catch (error) {
        console.error('Failed to restore session:', error);
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('user');
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
    const password = elements.password ? elements.password.value.trim() : '';
    const remember = e.target.elements.remember ? e.target.elements.remember.checked : false;

    // Validate inputs
    if (!validateFormBeforeSubmit(identifier, password)) {
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

          // Save to session or local storage based on "remember me"
          const storage = remember ? localStorage : sessionStorage;
          storage.setItem('currentUser', JSON.stringify({
            username: response.user.username || response.user.email,
            email: response.user.email,
            id: response.user.id,
            name: response.user.name,
            role: response.user.role
          }));
          storage.setItem('user', JSON.stringify({
            username: response.user.username || response.user.email,
            name: response.user.name || ''
          }));

          // Also save to localStorage for compatibility
          try {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', response.user.email || '');
          } catch (storageError) {
            console.warn('LocalStorage not available:', storageError);
          }

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
   * Authenticate user against the system
   * @param {string} identifier - Username or email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Authentication result
   */
  function authenticateUser(identifier, password) {
    return new Promise((resolve, reject) => {
      // For demo, we'll use the mock users
      setTimeout(() => {
        // Find user by email or username
        const user = validUsers.find(u => 
          (u.username && u.username.toLowerCase() === identifier.toLowerCase()) || 
          (u.email && u.email.toLowerCase() === identifier.toLowerCase())
        );

        if (user && user.password === password) {
          resolve({
            success: true,
            user: user,
            message: 'Login successful!'
          });
        } else {
          reject({
            success: false,
            message: 'Invalid username/email or password'
          });
        }
      }, 1000);
    });
  }

  /**
   * Handle user logout
   */
  function handleLogout() {
    authState.isAuthenticated = false;
    authState.currentUser = null;
    
    // Clear all storage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    
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

  /**
   * Validates form fields before submission
   * @param {string} email - User email or username
   * @param {string} password - User password
   * @returns {boolean} - Validation result
   */
  function validateFormBeforeSubmit(email, password) {
    clearErrors();
    let isValid = true;

    if (!email) {
      showInputError('email', 'Email/username is required');
      isValid = false;
    } else if (email.includes('@') && !isValidEmail(email)) {
      showInputError('email', 'Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      showInputError('password', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showInputError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Shows error for a specific input field
   * @param {string} fieldId - The input field ID
   * @param {string} message - Error message to display
   */
  function showInputError(fieldId, message) {
    try {
      const field = document.getElementById(fieldId) || 
                    document.getElementById(`${fieldId}Field`);
      const errorElement = document.getElementById(`${fieldId}Error`) || 
                          document.getElementById(`${fieldId}FieldError`);
                          
      if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
      }
    } catch (error) {
      console.error('Error showing input error:', error);
    }
  }

  /**
   * Clears all form errors
   */
  function clearErrors() {
    try {
      const errorElements = document.querySelectorAll('.error-message');
      const inputFields = document.querySelectorAll('.form-input');
      
      errorElements.forEach(element => {
        element.textContent = '';
      });
      
      inputFields.forEach(field => {
        field.classList.remove('error');
      });
    } catch (error) {
      console.error('Error clearing form errors:', error);
    }
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Is email valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper: Set loading state
  function setLoadingState(isLoading) {
    authState.isLoading = isLoading;
    
    if (elements.submitButton) {
      if (isLoading) {
        elements.submitButton.classList.add('btn-loading');
        elements.submitButton.disabled = true;
        elements.submitButton.textContent = 'Logging in...';
      } else {
        elements.submitButton.classList.remove('btn-loading');
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = 'Log In';
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
    try {
      if (elements.feedbackMessage) {
        elements.feedbackMessage.textContent = message;
        elements.feedbackMessage.className = 'feedback-message show';
        
        if (type === 'success') {
          elements.feedbackMessage.classList.add('feedback-success');
        } else if (type === 'error') {
          elements.feedbackMessage.classList.add('feedback-error');
        }
      } else if (typeof FeedbackManager !== 'undefined') {
        if (type === 'success') {
          FeedbackManager.showSuccess(message);
        } else if (type === 'error') {
          FeedbackManager.showError(message);
        } else {
          FeedbackManager.showMessage(message);
        }
      } else if (typeof displayFeedback === 'function') {
        displayFeedback(type, message);
      } else {
        console.log(`${type.toUpperCase()}: ${message}`);
      }
    } catch (error) {
      console.error('Error showing feedback:', error);
    }
  }
  
  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initAuth);

  // Make Auth object available globally if needed
  window.Auth = {
    login: authenticateUser,
    logout: handleLogout,
    isAuthenticated: () => authState.isAuthenticated,
    getCurrentUser: () => authState.currentUser,
    storeUserSession: (userData, remember) => {
      const storage = remember ? localStorage : sessionStorage;
      try {
        storage.setItem('currentUser', JSON.stringify(userData));
        storage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error storing user session:', error);
      }
    }
  };
})();
