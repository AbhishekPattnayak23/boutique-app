/**
 * User feedback mechanisms for login page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for shake animation
    addShakeAnimation();

    // Focus first input on page load
    setTimeout(() => {
        const username = document.getElementById('username');
        if (username && username.value === '') {
            username.focus();
        }
    }, 500);

    // Add accessibility features
    enhanceAccessibility();
});

/**
 * Adds CSS for shake animation to the page
 */
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Enhances form accessibility
 */
function enhanceAccessibility() {
    // Add aria attributes
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Set up aria relationships
    usernameInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    usernameInput.setAttribute('aria-describedby', 'usernameError');
    passwordInput.setAttribute('aria-describedby', 'passwordError');

    // Update aria-invalid on validation
    usernameInput.addEventListener('blur', function() {
        const isValid = !usernameInput.classList.contains('error');
        usernameInput.setAttribute('aria-invalid', !isValid);
        if (!isValid) {
            usernameError.setAttribute('role', 'alert');
        } else {
            usernameError.removeAttribute('role');
        }
    });

    passwordInput.addEventListener('blur', function() {
        const isValid = !passwordInput.classList.contains('error');
        passwordInput.setAttribute('aria-invalid', !isValid);
        if (!isValid) {
            passwordError.setAttribute('role', 'alert');
        } else {
            passwordError.removeAttribute('role');
        }
    });

    // Form feedback announcements for screen readers
    const formFeedback = document.getElementById('formFeedback');
    formFeedback.setAttribute('role', 'status');
    formFeedback.setAttribute('aria-live', 'polite');
}

/**
 * Shows a temporary notification with fade effect
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 * @param {number} duration - How long to show the message in ms
 */
function showNotification(message, type = 'success', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(notification);
    }

    // Set type-specific styles
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#2196f3';
        notification.style.color = 'white';
    }

    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';

    // Hide notification after duration
    setTimeout(() => {
        notification.style.opacity = '0';
    }, duration);
}
