/**
 * Authentication Module
 * Handles user login authentication and session management
 */

// Demo user data (in production this would come from a secure backend)
const validUsers = [
    { username: 'user1', password: 'password1' },
    { username: 'admin', password: 'admin123' }
];

/**
 * Authenticates a user with the provided credentials
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Promise<Object>} - Promise resolving to authentication result
 */
function authenticateUser(username, password) {
    // Create a promise to simulate an API call
    return new Promise((resolve, reject) => {
        // Simulate network delay (1 second)
        setTimeout(() => {
            try {
                // Validate inputs
                if (!username || !password) {
                    throw new Error('Username and password are required');
                }

                // Find user (case sensitive for demo)
                const user = validUsers.find(u => u.username === username && u.password === password);

                if (user) {
                    // Success
                    resolve({
                        success: true,
                        user: { username: user.username },
                        message: 'Login successful'
                    });
                } else {
                    // Invalid credentials
                    resolve({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }
            } catch (error) {
                // Handle any errors in the authentication process
                reject({
                    success: false,
                    message: error.message || 'Authentication failed'
                });
            }
        }, 1000); // 1 second delay
    });
}

// Export the authentication function for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authenticateUser };
}
