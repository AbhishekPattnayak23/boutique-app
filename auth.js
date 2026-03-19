/**
 * Authentication Module
 * Handles user authentication with comprehensive error handling and validation.
 */

// Module state
const authState = {
  isAuthenticated: false,
  currentUser: null,
  loginAttempts: 0,
  maxLoginAttempts: 3,
  lockedOut: false,
  lockoutTime: null
};

// Mock user database for demonstration
const mockUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
];

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

  // Set up event listeners
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    updateAuthUI();
  });
}

/**
 * Handle login form submission
 * @param {Event} event - The form submit event
 */
function handleLogin(event) {
  event.preventDefault();

  // Check for lockout
  if (authState.lockedOut) {
    const now = new Date();
    if (now < authState.lockoutTime) {
      const minutesLeft = Math.ceil((authState.lockoutTime - now) / (1000 * 60));
      showFeedback('error', `Account temporarily locked. Try again in ${minutesLeft} minutes.`);
      return;
    } else {
      // Reset lockout
      authState.lockedOut = false;
      authState.loginAttempts = 0;
    }
  }

  // Get form data
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Validate inputs
  if (!username || !password) {
    showFeedback('error', 'Username and password are required');
    return;
  }

  // Authenticate user
  try {
    const user = authenticateUser(username, password);
    if (user) {
      authState.isAuthenticated = true;
      authState.currentUser = user;
      authState.loginAttempts = 0;

      // Save to session
      sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        role: user.role
      }));

      showFeedback('success', 'Login successful!');
      updateAuthUI();

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      handleFailedLogin();
    }
  } catch (error) {
    console.error('Authentication error:', error);
    showFeedback('error', 'An error occurred during login');
  }
}

/**
 * Authenticate user against mock database
 * @param {string} username - The username to verify
 * @param {string} password - The password to verify
 * @returns {Object|null} - User object if authenticated, null otherwise
 */
function authenticateUser(username, password) {
  // Simulate server delay
  console.log(`Authenticating user: ${username}`);

  const user = mockUsers.find(u =>
    u.username === username && u.password === password
  );

  return user || null;
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
    showFeedback('error', 'Too many failed attempts. Account locked for 5 minutes.');
  } else {
    const attemptsLeft = authState.maxLoginAttempts - authState.loginAttempts;
    showFeedback('error', `Invalid username or password. ${attemptsLeft} attempts remaining.`);
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
  const authStatusElement = document.getElementById('auth-status');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-button');
  const protectedContent = document.querySelectorAll('.protected-content');

  if (authStatusElement) {
    if (authState.isAuthenticated && authState.currentUser) {
      authStatusElement.textContent = `Logged in as: ${authState.currentUser.username}`;
      authStatusElement.className = 'status-logged-in';
    } else {
      authStatusElement.textContent = 'Not logged in';
      authStatusElement.className = 'status-logged-out';
    }
  }

  if (loginForm) {
    loginForm.style.display = authState.isAuthenticated ? 'none' : 'block';
  }

  if (logoutBtn) {
    logoutBtn.style.display = authState.isAuthenticated ? 'block' : 'none';
  }

  // Toggle protected content visibility
  protectedContent.forEach(element => {
    element.style.display = authState.isAuthenticated ? 'block' : 'none';
  });
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

    // Create simple alert if feedback module not available
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

// Expose public API
window.auth = {
  init: initAuth,
  isAuthenticated: () => authState.isAuthenticated,
  getCurrentUser: () => authState.currentUser,
  logout: handleLogout
};

// Initialize on load
document.addEventListener('DOMContentLoaded', initAuth);
