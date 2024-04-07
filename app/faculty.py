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
    print("UID; ", userID)
    cursor.execute("SELECT * FROM faculty WHERE facultyId = %s", (userID,))
    faculty = cursor.fetchall()
    faculty = faculty[0]
    return jsonify(faculty)


@faculty_bp.route('/getFacultySubjects', methods=['GET'])
def get_faculty_subjects():
    userID = request.args.get('userID')
    print(userID)
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
    results = cursor.fetchall()
    user_ids = [result['studentId'] for result in results]
    return jsonify(user_ids)


@faculty_bp.route('/markAttendance', methods=['POST'])
def mark_attendance():
    data = request.json
    student_id = data['student_id']
    faculty_id = data['faculty_id']
    subject = data['subject']
    date = data['date']
    status = data['status']

    # Check if the attendance record already exists
    cursor.execute("SELECT * FROM attendance WHERE subject = %s AND studentId = %s AND date = %s",
                   (subject, student_id, date))
    existing_record = cursor.fetchone()

    if existing_record:
        # If the record exists, update the status
        cursor.execute("UPDATE attendance SET status = %s WHERE subject = %s AND studentId = %s AND date = %s",
                       (status, subject, student_id, date))
        db.commit()
        return jsonify({'message': 'Attendance updated successfully'}), 200
    else:
        # If the record does not exist, insert a new record
        cursor.execute(
            "INSERT INTO attendance (subject, studentId, facultyId, date, status) VALUES (%s, %s, %s, %s, %s)",
            (subject, student_id, faculty_id, date, status))
        db.commit()
        return jsonify({'message': 'Attendance marked successfully'}), 200


@faculty_bp.route('/getLeaveApplication', methods=['GET'])
def get_leave_applications():
    userID = request.args.get('userID')
    cursor.execute("select * from leave_application where facultyId = %s", (userID,))
    applications = cursor.fetchall()
    for i in applications:
        cursor.execute("SELECT studentName FROM student WHERE studentId = %s", (i['studentId'],))
        i['studentName'] = cursor.fetchall()[0]['studentName']
    return jsonify(applications)


@faculty_bp.route('/approveLeave', methods=['POST'])
def approve_leave():
    # Get application ID from request body
    application_id = request.json['applicationId']
    cursor.execute("UPDATE leave_application SET status = 'Approved' WHERE applicationId = %s", (application_id,))
    # update the attendance table data if marked as absent
    cursor.execute("SELECT * FROM leave_application WHERE applicationId = %s", (application_id,))
    application = cursor.fetchall()[0]
    print(application)
    cursor.execute("UPDATE attendance SET status = 'Present' WHERE studentId = %s and status = 'Absent' "
                   "and date between %s and %s and subject = %s", (application['studentId'], application['start_date'],
                                                                   application['end_date'], application['subject']))

    db.commit()
    return jsonify({'message': 'Leave application approved successfully'}), 200


# Endpoint to reject leave application
@faculty_bp.route('/rejectLeave', methods=['POST'])
def reject_leave():
    # Get application ID from request body
    application_id = request.json['applicationId']
    cursor.execute("UPDATE leave_application SET status = 'Rejected' WHERE applicationId = %s", (application_id,))
    db.commit()
    return jsonify({'message': 'Leave application rejected successfully'}), 200


@faculty_bp.route('/getDefaulters', methods=['GET'])
def get_defaulters():
    subject = request.args.get('subject')
    attendance = []
    cursor.execute("SELECT studentId FROM student WHERE subject = %s", (subject,))
    user_ids = [result['studentId'] for result in cursor.fetchall()]
    cursor.execute("select attendencePercentageCriteria from faculty where subject = %s", (subject,))
    criterion = cursor.fetchall()[0]['attendencePercentageCriteria']
    for id in user_ids:
        cursor.execute(
            "SELECT COUNT(*) AS present_count FROM attendance WHERE studentId = %s AND subject = %s AND status = 'Present'",
            (id, subject))
        present_count = cursor.fetchall()[0]['present_count']
        cursor.execute("SELECT COUNT(*) AS total_count FROM attendance WHERE studentId = %s AND subject = %s",
                       (id, subject))
        total_count = cursor.fetchall()[0]['total_count']
        if total_count != 0:
            average_attendance = (present_count / total_count) * 100
        else:
            average_attendance = 0
        if average_attendance < criterion:
            temp = [id]
            cursor.execute("SELECT studentName FROM student WHERE studentId = %s", (id,))
            temp.append(cursor.fetchall()[0]['studentName'])
            average_attendance = round(average_attendance, 2)
            temp.append(average_attendance)
            attendance.append(temp)

    return jsonify(attendance)
