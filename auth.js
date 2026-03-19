/**
 * Authentication Module
 * Handles user authentication with error handling and validation
 */

// Mock user database for demonstration
const mockUsers = [
  { username: 'user1', password: 'Password1!', name: 'Demo User' },
  { username: 'admin', password: 'Admin123!', name: 'Administrator' }
];

// Authentication utilities
const Auth = {
  isLoading: false,

  /**
   * Attempts to log in a user
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<Object>} - Authentication result
   */
  login: async function(username, password) {
    this.isLoading = true;
    this.updateButtonState();

    try {
      // Simulate network request with a promise
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user exists
          const user = mockUsers.find(u => u.username === username && u.password === password);

          if (user) {
            resolve({
              success: true,
              user: { username: user.username, name: user.name },
              message: 'Login successful!'
            });
          } else {
            reject({
              success: false,
              message: 'Invalid username or password'
            });
          }
        }, 1000); // Simulate 1 second delay
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      this.isLoading = false;
      this.updateButtonState();
    }
  },

  /**
   * Updates the login button state based on loading status
   */
  updateButtonState: function() {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
      loginButton.disabled = this.isLoading;
      loginButton.textContent = this.isLoading ? 'Logging in...' : 'Login';
    }
  },

  /**
   * Stores user session data
   * @param {Object} userData - User data to store
   * @param {boolean} remember - Whether to remember the user
   */
  storeUserSession: function(userData, remember) {
    const storage = remember ? localStorage : sessionStorage;
    try {
      storage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  },

  /**
   * Gets the current user session
   * @returns {Object|null} - User data or null if no session
   */
  getCurrentUser: function() {
    try {
      // Try local storage first, then session storage
      let userData = localStorage.getItem('user');
      if (!userData) {
        userData = sessionStorage.getItem('user');
      }

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  },

  /**
   * Logs out the current user
   */
  logout: function() {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
};

// Set up authentication handling
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      // Make sure Validator is available
      if (typeof Validator === 'undefined') {
        console.error('Validator not available. Make sure validation.js is loaded before auth.js');
        FeedbackManager.showError('System error. Please try again later.');
        return;
      }

      // Validate form before submission
      if (Validator.validateForm(this)) {
        const username = this.elements.username.value;
        const password = this.elements.password.value;
        const remember = this.elements.remember.checked;

        try {
          const result = await Auth.login(username, password);

          if (result.success) {
            Auth.storeUserSession(result.user, remember);
            FeedbackManager.showSuccess(result.message);

            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = '/dashboard.html';
            }, 1500);
          }
        } catch (error) {
          FeedbackManager.showError(error.message || 'Login failed. Please try again.');
        }
      }
    });

    // Check if user is already logged in
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
      console.log('User already logged in:', currentUser.name);
      // You could redirect to the dashboard here
    }
  }
});
