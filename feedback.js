/**
 * Feedback Manager
 * Handles user feedback and notifications with error handling
 */

// Feedback utilities
const FeedbackManager = {
  /**
   * Shows an error message
   * @param {string} message - The error message to display
   */
  showError: function(message) {
    const errorElement = document.getElementById('error-message');
    const successElement = document.getElementById('success-message');

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('d-none');

      // Hide success message if visible
      if (successElement) {
        successElement.classList.add('d-none');
      }

      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorElement.classList.add('d-none');
      }, 5000);
    } else {
      console.error('Error element not found in the DOM');
      alert('Error: ' + message);
    }
  },

  /**
   * Shows a success message
   * @param {string} message - The success message to display
   */
  showSuccess: function(message) {
    const successElement = document.getElementById('success-message');
    const errorElement = document.getElementById('error-message');

    if (successElement) {
      successElement.textContent = message;
      successElement.classList.remove('d-none');

      // Hide error message if visible
      if (errorElement) {
        errorElement.classList.add('d-none');
      }

      // Auto-hide after 5 seconds
      setTimeout(() => {
        successElement.classList.add('d-none');
      }, 5000);
    } else {
      console.error('Success element not found in the DOM');
      alert('Success: ' + message);
    }
  },

  /**
   * Clears all feedback messages
   */
  clearFeedback: function() {
    const errorElement = document.getElementById('error-message');
    const successElement = document.getElementById('success-message');

    if (errorElement) {
      errorElement.classList.add('d-none');
    }

    if (successElement) {
      successElement.classList.add('d-none');
    }
  },

  /**
   * Logs an event for analytics or debugging
   * @param {string} eventType - The type of event
   * @param {Object} data - Additional data about the event
   */
  logEvent: function(eventType, data = {}) {
    const logData = {
      eventType,
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('Event logged:', logData);

    // Here you could send the event to an analytics service
    try {
      // Example: send to analytics
      // navigator.sendBeacon('/api/analytics', JSON.stringify(logData));
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }
};

// Set up feedback manager
document.addEventListener('DOMContentLoaded', function() {
  // Example of form interaction with feedback
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    // Clear feedback when form is interacted with
    loginForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        FeedbackManager.clearFeedback();
      });
    });
  }

  // Log page load event
  FeedbackManager.logEvent('page_view', { page: 'login' });
});
