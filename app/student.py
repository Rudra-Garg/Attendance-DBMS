from flask import Blueprint, request, jsonify, render_template

from app.connection import *

student_bp = Blueprint('student', __name__)


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
    subject = request.args.get('subject')
    db.reconnect()  # Retrieve subject from query parameter
    cursor.execute("SELECT subject, status, date FROM attendance WHERE studentId = %s AND subject = %s",
                   (userID, subject))
    attendance = cursor.fetchall()
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
    criterion = cursor.fetchall()[0]['attendencePercentageCriteria']
    return jsonify({'average_attendance': round(average_attendance, 2), 'criterion': criterion})


@student_bp.route('/getLeaveApplications', methods=['GET'])
def get_leave_applications():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM leave_application WHERE studentId = %s", (userID,))
    applications = cursor.fetchall()
    return jsonify(applications)


@student_bp.route('/submitLeaveApplication', methods=['POST'])
def submit_leave_application():
    try:
        # Get data from the request body
        data = request.json

        # Extract data
        subject = data.get('subject')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        reason = data.get('reason')
        student_id = data.get('studentId')
        # Fetch facultyid from faculty table
        cursor.execute("SELECT facultyId FROM faculty WHERE subject = %s", (subject,))
        faculty_id = cursor.fetchall()[0]['facultyId']
        # Fetch last application id from leave_application table
        cursor.execute("SELECT applicationId FROM leave_application ORDER BY applicationId DESC LIMIT 1")
        last_application_id = cursor.fetchall()[0]['applicationId']
        sql = "INSERT INTO leave_application VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        val = (last_application_id + 1, student_id, faculty_id, subject, startDate, endDate, reason, "Pending")
        cursor.execute(sql, val)
        db.commit()

        return jsonify({"message": "Leave application submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
