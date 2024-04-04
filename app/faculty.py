from flask import Blueprint, request, jsonify, render_template

from app.connection import *

faculty_bp = Blueprint('faculty', __name__)


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
    cursor.execuuserIDte("INSERT INTO attendance VALUES (%s, %s, %s, %s, %s)",
                         (subject, student_id, faculty_id, date, status))
    db.commit()
    return jsonify({'message': 'Attendance marked successfully'}), 200


@faculty_bp.route('/getDefaulters', methods=['GET'])
def get_defaulters():
    subject = request.args.get('subject')
    attendance = []
    cursor.execute("SELECT studentId FROM student WHERE subject = %s", (subject,))
    user_ids = [result['studentId'] for result in cursor.fetchall()]
    cursor.execute("select attendencePercentageCriteria from faculty where subject = %s", (subject,))
    criterion = cursor.fetchone()['attendencePercentageCriteria']
    print(criterion, user_ids)
    for id in user_ids:
        cursor.execute(
            "SELECT COUNT(*) AS present_count FROM attendance WHERE studentId = %s AND subject = %s AND status = 'Present'",
            (id, subject))
        present_count = cursor.fetchone()['present_count']
        cursor.execute("SELECT COUNT(*) AS total_count FROM attendance WHERE studentId = %s AND subject = %s",
                       (id, subject))
        total_count = cursor.fetchone()['total_count']
        if total_count != 0:
            average_attendance = (present_count / total_count) * 100
        else:
            average_attendance = 0
        print(average_attendance, criterion)
        if average_attendance < criterion:
            temp = [id]
            cursor.execute("SELECT studentName FROM student WHERE studentId = %s", (id,))
            temp.append(cursor.fetchall()[0]['studentName'])
            temp.append(average_attendance)
            attendance.append(temp)

    print(attendance)
    return jsonify(attendance)
