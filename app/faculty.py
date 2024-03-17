import mysql.connector
from flask import Blueprint, request, jsonify, render_template

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
    faculty = cursor.fetchall()
    faculty = faculty[0]
    return jsonify(faculty)


@faculty_bp.route('/getFacultySubjects', methods=['GET'])
def get_faculty_subjects():
    userID = request.args.get('userID')
    cursor.execute("SELECT subject FROM faculty WHERE facultyId = %s", (userID,))
    subjects = cursor.fetchall()
    return jsonify(subjects)


@faculty_bp.route('/getStudentDetails', methods=['GET'])
def get_student_details():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM student WHERE studentId = %s", (userID,))
    student = cursor.fetchall()
    student = student[0]
    return jsonify(student)


@faculty_bp.route('/getStudentUserIDs', methods=['GET'])
def get_student_user_ids():
    subject = request.args.get('subject')
    cursor.execute("SELECT studentId FROM student WHERE subject = %s", (subject,))
    user_ids = [result['studentId'] for result in cursor.fetchall()]
    return jsonify(user_ids)



@faculty_bp.route('/markAttendance', methods=['POST'])
def mark_attendance():
    data = request.json
    student_id = data['student_id']
    faculty_id = data['faculty_id']
    subject = data['subject']
    date = data['date']
    status = data['status']
    print(student_id, faculty_id, subject, date, status)
    cursor.execute("INSERT INTO attendance VALUES (%s, %s, %s, %s, %s)",
                   (subject, student_id, faculty_id, date, status))
    db.commit()

    return jsonify({'message': 'Attendance marked successfully'}), 200
