/**
 * Authentication Module
 * Handles user authentication and login processing
 */

// Simulate authentication with a Promise
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
