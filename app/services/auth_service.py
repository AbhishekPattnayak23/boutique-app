from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

class AuthService:
    def authenticate(self, email, password):
        """
        Authenticates a user with the provided email and password.
        Returns a tuple of (user, message)
        """
        user = User.query.filter_by(email=email).first()

        if not user:
            return None, "Invalid email or password"

        if not check_password_hash(user.password_hash, password):
            return None, "Invalid email or password"

        return user, "Login successful"

    def register_user(self, username, email, password):
        """
        Registers a new user with the provided details.
        Returns a tuple of (success, message)
        """
        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == email) | (User.username == username)
        ).first()

        if existing_user:
            if existing_user.email == email:
                return False, "Email already registered"
            else:
                return False, "Username already taken"

        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=password_hash
        )

        try:
            from app import db
            db.session.add(new_user)
            db.session.commit()
            return True, "Registration successful"
        except Exception as e:
            return False, f"Registration failed: {str(e)}"
