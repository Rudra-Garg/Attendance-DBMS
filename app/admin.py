from flask import Blueprint, request, jsonify, render_template

from app.connection import *

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin')
def admin_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('admin.html', userID=userID)

