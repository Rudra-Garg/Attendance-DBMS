from flask import Blueprint, request, jsonify, render_template
import mysql.connector

faculty_bp = Blueprint('faculty', __name__)

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)

# Routes related to faculty functionality
@faculty_bp.route('/faculty')
def faculty_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('faculty.html', userID=userID)

@faculty_bp.route('/getFacultyDetails', methods=['GET'])
def get_faculty_details():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM faculty WHERE facultyId = %s", (userID,))
    faculty = cursor.fetchone()
    return jsonify(faculty)

@faculty_bp.route('/getFacultySubjects', methods=['GET'])
def get_faculty_subjects():
    userID = request.args.get('userID')
    cursor.execute("SELECT subject FROM faculty WHERE facultyId = %s", (userID,))
    subjects = cursor.fetchall()
    return jsonify(subjects)

# Add more routes related to faculty functionality as needed
