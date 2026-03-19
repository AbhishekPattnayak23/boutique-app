/**
 * Browser Compatibility Test Suite for Login Page
 * Tests login page functionality across Chrome, Firefox, Safari, and Edge
 */

// Using Cypress for browser testing
// Note: This is a sample script that would be run with Cypress

describe('Login Page Browser Compatibility Tests', () => {
  const browsers = ['chrome', 'firefox', 'edge', 'safari'];

  browsers.forEach(browser => {
    context(`Testing in ${browser}`, () => {
      beforeEach(() => {
        cy.visit('/index.html');
        cy.viewport(1280, 720);
      });

      it('should display login form correctly', () => {
        cy.get('#loginForm').should('be.visible');
        cy.get('#emailField').should('be.visible');
        cy.get('#passwordField').should('be.visible');
        cy.get('#loginButton').should('be.visible');
      });

      it('should validate email input', () => {
        cy.get('#emailField').type('invalid-email');
        cy.get('#loginButton').click();
        cy.get('.error-message').should('be.visible');
        cy.get('.error-message').should('contain', 'Please enter a valid email address');
      });

      it('should validate password input', () => {
        cy.get('#emailField').type('valid@example.com');
        cy.get('#passwordField').type('short');
        cy.get('#loginButton').click();
        cy.get('.error-message').should('be.visible');
        cy.get('.error-message').should('contain', 'Password must be at least 8 characters');
      });

      it('should successfully submit form with valid inputs', () => {
        cy.get('#emailField').type('valid@example.com');
        cy.get('#passwordField').type('validPassword123');
        cy.get('#loginButton').click();
        cy.get('.success-message').should('be.visible');
        cy.get('.success-message').should('contain', 'Login successful');
      });

      it('should mask password characters', () => {
        cy.get('#passwordField').type('password123');
        cy.get('#passwordField').should('have.attr', 'type', 'password');
      });

      it('should navigate form with keyboard', () => {
        cy.get('#emailField').focus().type('test@example.com');
        cy.tab().type('password123');
        cy.tab().type('{enter}');
        cy.get('.success-message').should('be.visible');
      });

      it('should display appropriate error for failed login', () => {
        cy.get('#emailField').type('invalid@example.com');
        cy.get('#passwordField').type('wrongPassword123');
        cy.get('#loginButton').click();
        cy.get('.error-message').should('be.visible');
        cy.get('.error-message').should('contain', 'Invalid credentials');
      });
    });
  });

  // Visual regression testing
  context('Visual appearance tests', () => {
    browsers.forEach(browser => {
      it(`should maintain visual consistency in ${browser}`, () => {
        cy.visit('/index.html');
        cy.viewport(1280, 720);
        cy.matchImageSnapshot(`login-page-${browser}`);
      });
    });
  });
});

// Error handling utility for browser testing
function handleTestError(err, browserName) {
  console.error(`Test failed in ${browserName}: ${err.message}`);
  cy.screenshot(`error-${browserName}-${Date.now()}`);
  throw err;
}
