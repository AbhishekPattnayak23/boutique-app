/**
 * User feedback module
 * Provides visual feedback for user actions
 */

// DOM element for feedback container
const feedbackContainer = document.getElementById('feedbackContainer');

/**
 * Display success feedback message
 * @param {string} message - Success message to display
 */
function showSuccessFeedback(message) {
    // Clear any existing feedback
    feedbackContainer.classList.remove('error', 'success');

    // Create success message with icon
    feedbackContainer.innerHTML = `
        <img src="assets/images/icons/success.svg" alt="Success" class="feedback-icon">
        ${message}
    `;

    // Apply success styling
    feedbackContainer.classList.add('success');

    // Ensure the feedback is visible
    feedbackContainer.style.display = 'flex';

    // Scroll to top of container for visibility
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Display error feedback message
 * @param {string} message - Error message to display
 */
function showErrorFeedback(message) {
    // Clear any existing feedback
    feedbackContainer.classList.remove('error', 'success');

    // Create error message with icon
    feedbackContainer.innerHTML = `
        <img src="assets/images/icons/error.svg" alt="Error" class="feedback-icon">
        ${message}
    `;

    // Apply error styling
    feedbackContainer.classList.add('error');

    // Ensure the feedback is visible
    feedbackContainer.style.display = 'flex';

    // Add subtle shake animation for emphasis
    feedbackContainer.animate(
        [
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
        ],
        {
            duration: 300,
            iterations: 1
        }
    );

    // Scroll to top of container for visibility
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear all feedback messages
 */
function clearFeedback() {
    feedbackContainer.innerHTML = '';
    feedbackContainer.classList.remove('error', 'success');
    feedbackContainer.style.display = 'none';
}

// Add clear feedback on input focus
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('input');

    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Only clear feedback if it's an error
            if (feedbackContainer.classList.contains('error')) {
                clearFeedback();
            }
        });
    });
});
