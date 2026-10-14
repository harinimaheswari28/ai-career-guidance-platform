from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from backend.app import db
from backend.app.models.user import User

def get_current_user():
    user_id = get_jwt_identity()
    if not user_id:
        return None
    return db.session.get(User, int(user_id))

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = db.session.get(User, int(user_id)) if user_id else None
            if not user or user.role != 'admin':
                return jsonify({
                    'status': 'error',
                    'message': 'Admin privilege required to perform this action.'
                }), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
