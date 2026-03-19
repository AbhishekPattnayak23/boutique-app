/**
 * Form Validation Test Script
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Form Validation Tests');
  console.log('=====================');

  // Mock DOM elements for testing
  const mockForm = document.createElement('form');
  mockForm.id = 'loginForm';

  const mockEmailInput = document.createElement('input');
  mockEmailInput.id = 'email';
  mockEmailInput.type = 'email';

  const mockPasswordInput = document.createElement('input');
  mockPasswordInput.id = 'password';
  mockPasswordInput.type = 'password';

  const mockErrorMessage = document.createElement('div');
  mockErrorMessage.id = 'errorMessage';

  document.body.appendChild(mockForm);
  document.body.appendChild(mockEmailInput);
  document.body.appendChild(mockPasswordInput);
  document.body.appendChild(mockErrorMessage);

  // Test email validation
  function testEmailValidation() {
    console.log('\nEmail Validation Tests:');

    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user-name@domain.co.uk'
    ];

    const invalidEmails = [
      'test',
      'test@',
      '@example.com',
      'test@example',
      'test@@example.com'
    ];

    // Test function to validate email
    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    }

    // Test valid emails
    validEmails.forEach(email => {
      if (validateEmail(email)) {
        console.log(` PASS: "${email}" correctly validated as a valid email`);
      } else {
        console.log(` FAIL: "${email}" incorrectly rejected as an invalid email`);
      }
    });

    // Test invalid emails
    invalidEmails.forEach(email => {
      if (!validateEmail(email)) {
        console.log(` PASS: "${email}" correctly rejected as an invalid email`);
      } else {
        console.log(` FAIL: "${email}" incorrectly validated as a valid email`);
      }
    });
  }

  // Test password validation
  function testPasswordValidation() {
    console.log('\nPassword Validation Tests:');

    const validPasswords = [
      'password123',
      'P@ssw0rd!',
      '12345678'
    ];

    const invalidPasswords = [
      '1234',
      'pass',
      '123'
    ];

    // Test function to validate password length
    function validatePasswordLength(password) {
      return password.length >= 8;
    }

    // Test valid passwords
    validPasswords.forEach(password => {
      if (validatePasswordLength(password)) {
        console.log(` PASS: Password with length ${password.length} correctly validated`);
      } else {
        console.log(` FAIL: Password with length ${password.length} incorrectly rejected`);
      }
    });

    // Test invalid passwords
    invalidPasswords.forEach(password => {
      if (!validatePasswordLength(password)) {
        console.log(` PASS: Password with length ${password.length} correctly rejected`);
      } else {
        console.log(` FAIL: Password with length ${password.length} incorrectly validated`);
      }
    });
  }

  // Run tests
  testEmailValidation();
  testPasswordValidation();

  console.log('\nTo run these tests in a browser:');
  console.log('1. Open the test_form_validation.html file in a browser');
  console.log('2. Check the console for test results');

  // Clean up
  document.body.removeChild(mockForm);
  document.body.removeChild(mockEmailInput);
  document.body.removeChild(mockPasswordInput);
  document.body.removeChild(mockErrorMessage);
});
