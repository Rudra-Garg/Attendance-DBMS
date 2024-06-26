from flask import Blueprint, request, jsonify

from app.connection import *

login_bp = Blueprint('login', __name__)


# Routes related to log in functionality
@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = user_type(username, password)
    if user:
        return jsonify({'message': 'Login successful', 'usertype': user['userType'], 'userID': user['userId']}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


def user_type(username, password):
    cursor.execute("SELECT * FROM login WHERE userName = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    if user:
        return user
    else:
        return None

# Add more routes related to log in functionality as needed
