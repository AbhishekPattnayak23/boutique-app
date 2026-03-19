/**
 * Feedback module for login form
 * Provides UI feedback mechanisms for login success/failure
 */

// Cache DOM elements
const messageContainer = document.getElementById('login-message');
let messageTimeout; // Store timeout ID for clearing

/**
 * Display a success message
 * @param {string} message - The success message to display
 * @param {number} [duration=5000] - How long to display the message in milliseconds
 */
function showSuccessMessage(message, duration = 5000) {
    showMessage(message, 'success', duration);
}

/**
 * Display an error message
 * @param {string} message - The error message to display
 * @param {number} [duration=5000] - How long to display the message in milliseconds
 */
function showErrorMessage(message, duration = 5000) {
    showMessage(message, 'error', duration);
}

/**
 * Core function to display messages
 * @param {string} message - The message text to display
 * @param {string} type - The message type ('success' or 'error')
 * @param {number} duration - How long to display the message in milliseconds
 */
function showMessage(message, type, duration) {
    // Clear any existing message timeout
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }

    // Reset classes
    messageContainer.className = 'message';

    // Set message and add appropriate classes
    messageContainer.textContent = message;
    messageContainer.classList.add(type);

    // Use a small timeout to ensure the transition works properly
    setTimeout(() => {
        messageContainer.classList.add('visible');
    }, 10);

    // Set timeout to hide the message
    messageTimeout = setTimeout(() => {
        messageContainer.classList.remove('visible');

        // Clear text after fade-out
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.classList.remove(type);
        }, 300); // Match transition duration
    }, duration);
}

/**
 * Clear any displayed messages immediately
 */
function clearMessage() {
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }

    messageContainer.classList.remove('visible');
    setTimeout(() => {
        messageContainer.textContent = '';
        messageContainer.className = 'message';
    }, 300);
}

// Expose functions globally
window.showSuccessMessage = showSuccessMessage;
window.showErrorMessage = showErrorMessage;
window.clearMessage = clearMessage;

// Initialize any necessary feedback elements
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization can go here
});
