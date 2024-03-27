import mysql.connector
from flask import Blueprint, request, jsonify, render_template

student_bp = Blueprint('student', __name__)

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="saumya@17kala",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)


# Routes related to student functionality
@student_bp.route('/student')
def student_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('student.html', userID=userID)


@student_bp.route('/getStudentDetails', methods=['GET'])
def get_student_details():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM student WHERE studentId = %s", (userID,))
    result = cursor.fetchall()
    student = result[0]
    print(student)
    return jsonify(student)


@student_bp.route('/getStudentSubjects', methods=['GET'])
def get_student_subjects():
    userID = request.args.get('userID')
    cursor.execute("SELECT subject FROM student WHERE studentId = %s", (userID,))
    subjects = cursor.fetchall()
    return jsonify(subjects)


@student_bp.route('/getStudentAttendance', methods=['GET'])
def get_student_attendance():
    userID = request.args.get('userID')
    subject = request.args.get('subject')  # Retrieve subject from query parameter
    cursor.execute("SELECT subject, status, date FROM attendance WHERE studentId = %s AND subject = %s",
                   (userID, subject))
    attendance = cursor.fetchall()
    print(attendance)
    return jsonify(attendance)


@student_bp.route('/getStudentAverageAttendance', methods=['GET'])
def get_student_average_attendance():
    userID = request.args.get('userID')
    subject = request.args.get('subject')
    cursor.execute(
        "SELECT COUNT(*) AS present_count FROM attendance WHERE studentId = %s AND subject = %s AND status = 'Present'",
        (userID, subject))
    present_count = cursor.fetchone()['present_count']
    cursor.execute("SELECT COUNT(*) AS total_count FROM attendance WHERE studentId = %s AND subject = %s",
                   (userID, subject))
    total_count = cursor.fetchone()['total_count']
    if total_count != 0:
        average_attendance = (present_count / total_count) * 100
    else:
        average_attendance = 0
    cursor.execute("select attendencePercentageCriteria from faculty where subject = %s", (subject,))
    criterion = cursor.fetchone()['attendencePercentageCriteria']
    return jsonify({'average_attendance': round(average_attendance,2), 'criterion': criterion})
