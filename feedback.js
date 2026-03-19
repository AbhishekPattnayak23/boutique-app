/**
 * User Feedback Module
 * Provides visual feedback for form interactions and login attempts
 */

// Self-invoking function to avoid polluting global namespace
(function() {
  // Configuration
  const config = {
    animationDuration: 300, // ms
    notificationTimeout: 5000, // ms
    position: 'top-right' // Default position
  };

  // Notification types
  const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
  };

  // Create notification container if it doesn't exist
  function ensureNotificationContainer() {
    let container = document.querySelector('.notification-container');

    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);

      // Position based on config
      switch (config.position) {
        case 'top-right':
          container.style.top = '20px';
          container.style.right = '20px';
          break;
        case 'top-left':
          container.style.top = '20px';
          container.style.left = '20px';
          break;
        case 'bottom-right':
          container.style.bottom = '20px';
          container.style.right = '20px';
          break;
        case 'bottom-left':
          container.style.bottom = '20px';
          container.style.left = '20px';
          break;
        default:
          container.style.top = '20px';
          container.style.right = '20px';
      }

      // Add styles dynamically
      const style = document.createElement('style');
      style.textContent = `
        .notification-container {
          position: fixed;
          z-index: 9999;
          width: 300px;
        }

        .notification {
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 14px;
          opacity: 0;
          transform: translateX(50px);
          transition: all ${config.animationDuration}ms ease;
        }

        .notification.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .notification.success {
          background-color: #d4edda;
          border-left: 4px solid #28a745;
          color: #155724;
        }

        .notification.error {
          background-color: #f8d7da;
          border-left: 4px solid #dc3545;
          color: #721c24;
        }

        .notification.info {
          background-color: #d1ecf1;
          border-left: 4px solid #17a2b8;
          color: #0c5460;
        }

        .notification.warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          color: #856404;
        }

        .notification-close {
          float: right;
          cursor: pointer;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    }

    return container;
  }

  // Create and show a notification
  function showNotification(message, type = NOTIFICATION_TYPES.INFO) {
    const container = ensureNotificationContainer();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-close">&times;</span>
      ${message}
    `;

    // Add to container
    container.appendChild(notification);

    // Add close event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      closeNotification(notification);
    });

    // Show with animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);

    // Auto-close after timeout
    setTimeout(() => {
      closeNotification(notification);
    }, config.notificationTimeout);

    return notification;
  }

  // Close a notification
  function closeNotification(notification) {
    notification.classList.remove('visible');

    setTimeout(() => {
      notification.remove();
    }, config.animationDuration);
  }

  // Public API
  window.Feedback = {
    showSuccess: (message) => showNotification(message, NOTIFICATION_TYPES.SUCCESS),
    showError: (message) => showNotification(message, NOTIFICATION_TYPES.ERROR),
    showInfo: (message) => showNotification(message, NOTIFICATION_TYPES.INFO),
    showWarning: (message) => showNotification(message, NOTIFICATION_TYPES.WARNING)
  };
})();

// Feedback display configuration
const feedbackConfig = {
  displayTime: 5000, // Default display time in ms
  position: 'top-right' // Default position
};

// Feedback controller
class FeedbackManager {
  constructor(config = {}, feedbackElementId = 'login-feedback') {
    this.config = { ...feedbackConfig, ...config };
    this.container = this.createFeedbackContainer();
    
    // Support for login-specific feedback element
    this.feedbackElement = document.getElementById(feedbackElementId);
    if (!this.feedbackElement) {
      console.error(`Feedback element with ID "${feedbackElementId}" not found!`);
    }

    // Bind login form
    this.bindLoginForm();

    // Initialize logging
    this.logEvent('Feedback system initialized');
  }

  // Create feedback container
  createFeedbackContainer() {
    const container = document.createElement('div');
    container.className = 'feedback-container';
    container.style.position = 'fixed';
    container.style.zIndex = '1000';

    // Position based on config
    switch (this.config.position) {
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'bottom-right':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      default:
        container.style.top = '20px';
        container.style.right = '20px';
    }

    document.body.appendChild(container);
    return container;
  }

  // Show a feedback message
  show(message, type = 'info', duration = this.config.displayTime) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.innerHTML = `<p>${message}</p>`;

    // Style the feedback element
    feedback.style.padding = '12px 20px';
    feedback.style.margin = '10px 0';
    feedback.style.borderRadius = '4px';
    feedback.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease';

    // Type-specific styling
    switch (type) {
      case 'success':
        feedback.style.backgroundColor = '#f0fff4';
        feedback.style.color = '#257942';
        feedback.style.border = '1px solid #48c774';
        break;
      case 'error':
        feedback.style.backgroundColor = '#fff5f7';
        feedback.style.color = '#cd0930';
        feedback.style.border = '1px solid #ff3860';
        break;
      case 'warning':
        feedback.style.backgroundColor = '#fffbeb';
        feedback.style.color = '#947600';
        feedback.style.border = '1px solid #ffdd57';
        break;
      default:
        feedback.style.backgroundColor = '#f6f9fe';
        feedback.style.color = '#2160c4';
        feedback.style.border = '1px solid #3273dc';
    }

    // Add to container and animate in
    this.container.appendChild(feedback);
    setTimeout(() => {
      feedback.style.opacity = '1';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        if (feedback.parentNode) {
          this.container.removeChild(feedback);
        }
      }, 300);
    }, duration);

    return feedback;
  }

  // Show success feedback
  success(message, duration) {
    if (this.feedbackElement) {
      this.feedbackElement.className = 'feedback-container feedback-success';
      this.feedbackElement.textContent = message;
      this.logEvent(`Success: ${message}`);

      // Auto-hide after duration
      setTimeout(() => {
        this.hideMessage();
      }, duration || 5000);
    }
    return this.show(message, 'success', duration);
  }

  // Show error feedback
  error(message, duration) {
    if (this.feedbackElement) {
      this.feedbackElement.className = 'feedback-container feedback-error';
      this.feedbackElement.textContent = message;
      this.logEvent(`Error: ${message}`);

      // Auto-hide after duration
      setTimeout(() => {
        this.hideMessage();
      }, duration || 5000);
    }
    return this.show(message, 'error', duration);
  }

  // Show warning feedback
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  // Show info feedback
  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  /**
   * Display a loading message during async operations
   * @param {string} message - The loading message to display
   */
  showLoading(message = 'Processing your request...') {
    if (this.feedbackElement) {
      this.feedbackElement.className = 'feedback-container feedback-loading';
      this.feedbackElement.textContent = message;
      this.logEvent('Loading state activated');
    }
    return this.show(message, 'info');
  }

  /**
   * Hide the current feedback message
   */
  hideMessage() {
    if (this.feedbackElement) {
      this.feedbackElement.className = 'feedback-container';
      this.feedbackElement.textContent = '';
    }
  }

  /**
   * Bind the login form submission to handle feedback
   */
  bindLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
      console.log('Login form not found!');
      return;
    }

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Get form values
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Validate input client-side first
      if (typeof validateLoginForm === 'function' && !validateLoginForm(username, password)) {
        return;
      }

      // Show loading state
      this.showLoading('Authenticating...');

      try {
        // Attempt to authenticate user
        if (typeof authenticateUser === 'function') {
          const result = await authenticateUser(username, password);

          // Handle authentication result
          if (result.success) {
            this.success(result.message || 'Login successful!');

            // Simulate redirect after successful login
            setTimeout(() => {
              this.showLoading('Redirecting to dashboard...');
              // In a real app, this would redirect to another page
            }, 1000);
          } else {
            this.error(result.message || 'Login failed.');
          }
        }
      } catch (error) {
        // Handle authentication errors
        this.error(error.message || 'An unexpected error occurred.');
        console.error('Authentication error:', error);
      }
    });
  }

  /**
   * Log events for debugging
   * @param {string} message - The message to log
   */
  logEvent(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize feedback manager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.feedbackManager = new FeedbackManager();
    console.log('Feedback manager initialized successfully');
  } catch (error) {
    console.error('Failed to initialize feedback manager:', error);
  }
});

// Export the FeedbackManager class
window.FeedbackManager = FeedbackManager;

// Expose simple display feedback API for backward compatibility
window.displayFeedback = function(type, message, duration = 5000) {
  // Validate inputs
  if (!type || !message) {
    console.error('Feedback requires both type and message');
    return;
  }

  // Validate type
  const validTypes = ['success', 'error', 'info', 'warning'];
  if (!validTypes.includes(type)) {
    console.error(`Invalid feedback type: ${type}. Must be one of: ${validTypes.join(', ')}`);
    type = 'info'; // Default to info
  }

  // Log to console for debugging
  console.log(`FEEDBACK [${type}]: ${message}`);
  
  // Use the feedbackManager if available
  if (window.feedbackManager) {
    if (type === 'success') {
      return window.feedbackManager.success(escapeHtml(message), duration);
    } else if (type === 'error') {
      return window.feedbackManager.error(escapeHtml(message), duration);
    } else if (type === 'warning') {
      return window.feedbackManager.warning(escapeHtml(message), duration);
    } else {
      return window.feedbackManager.info(escapeHtml(message), duration);
    }
  } else {
    // Fallback to Feedback if available
    if (window.Feedback) {
      if (type === 'success') {
        return window.Feedback.showSuccess(escapeHtml(message));
      } else if (type === 'error') {
        return window.Feedback.showError(escapeHtml(message));
      } else if (type === 'warning') {
        return window.Feedback.showWarning(escapeHtml(message));
      } else {
        return window.Feedback.showInfo(escapeHtml(message));
      }
    }
  }
};
