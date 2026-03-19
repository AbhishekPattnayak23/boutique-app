from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from app.models.user import User
from app.services.auth_service import AuthService
import re

auth_blueprint = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate form input
        if not email or not password:
            flash('Email and password are required', 'error')
            return render_template('auth/login.html')

        # Authenticate user
        user, message = auth_service.authenticate(email, password)

        if user:
            # Set session and redirect to dashboard
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful', 'success')
            return redirect(url_for('dashboard.index'))
        else:
            flash(message, 'error')

    return render_template('auth/login.html')

@auth_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Validate form input
        errors = []

        if not username or len(username) < 3:
            errors.append('Username must be at least 3 characters')

        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            errors.append('Please provide a valid email address')

        if not password or len(password) < 8:
            errors.append('Password must be at least 8 characters')

        if password != confirm_password:
            errors.append('Passwords do not match')

        # If there are validation errors
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('auth/register.html')

        # Register the user
        success, message = auth_service.register_user(username, email, password)

        if success:
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(message, 'error')

    return render_template('auth/register.html')

@auth_blueprint.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('auth.login'))
