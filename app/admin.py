from datetime import datetime

from flask import Blueprint, request, render_template, jsonify

from app.connection import *

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/admin')
def admin_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('admin.html', userID=userID)


# Endpoint to find the greatest userId from the login table
@admin_bp.route('/find_greatest_user_id', methods=['GET'])
def find_greatest_user_id():
    try:
        cursor.execute("SELECT MAX(userId) AS greatest_user_id FROM login")
        result = cursor.fetchall()[0]
        greatest_user_id = result['greatest_user_id']

        return jsonify({'greatest_user_id': greatest_user_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/add_member', methods=['POST'])
def add_member():
    cursor.execute("SELECT MAX(userId) AS greatest_user_id FROM login")
    result = cursor.fetchall()[0]
    userId = result['greatest_user_id'] + 1
    data = request.json
    member_type = data.get('memberType')
    name = data.get('name')
    email = data.get('email')
    passwd = data.get('passwd')
    cursor.execute("INSERT INTO login VALUES (%s, %s, %s, %s)", (userId, member_type, email, passwd))
    if member_type == 'student':
        cursor.execute("INSERT INTO student VALUES (%s, %s, %s, %s)", (userId, name, email, "Default"))
    elif member_type == 'faculty':
        cursor.execute("INSERT INTO faculty VALUES (%s, %s, %s, %s, %s, %s)",
                       (userId, name, email, "Default", 75, datetime.now().date()))
    db.commit()

    return jsonify({'message': 'Member added successfully'}), 200


@admin_bp.route('/get_member_details', methods=['GET'])
def get_member_details():
    userId = request.args.get('userId')
    cursor.execute("SELECT * FROM login WHERE userId = %s", (userId,))
    user_data = cursor.fetchone()
    cursor.nextset()
    if user_data:
        if user_data['userType'] == 'Student':
            cursor.execute("SELECT * FROM student WHERE studentId = %s", (userId,))
        elif user_data['userType'] == 'Faculty':
            cursor.execute("SELECT * FROM faculty WHERE facultyId = %s", (userId,))
        member_data = cursor.fetchall()[0]
        return jsonify({'user': user_data, 'member_details': member_data}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@admin_bp.route('/remove_member', methods=['POST'])
def remove_member():
    try:
        userId = request.json['userId']
        cursor.execute("SELECT userType FROM login WHERE userId = %s", (userId,))
        user_type = cursor.fetchall()[0]['userType']
        cursor.execute("DELETE FROM attendance WHERE studentId = %s OR facultyId = %s", (userId, userId))
        cursor.execute("DELETE FROM leave_application WHERE studentId = %s OR facultyId = %s", (userId, userId))
        if user_type == 'Student':
            cursor.execute("DELETE FROM student WHERE studentId = %s", (userId,))
        elif user_type == 'Faculty':
            cursor.execute("DELETE FROM faculty WHERE facultyId = %s", (userId,))

        cursor.execute("DELETE FROM login WHERE userId = %s", (userId,))
        db.commit()
        return jsonify({'message': 'Member removed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint to add a new subject to the database for a student or faculty member
@admin_bp.route('/add_subject', methods=['POST'])
def add_subject():
    # Get data from the request body
    data = request.json
    user_id = data.get('user_id')
    subject_name = data.get('subject_name')
    cursor.execute("SELECT * FROM login WHERE userId = %s", (user_id,))
    user_data = cursor.fetchone()
    print(user_data)
    if user_data:
        userType = user_data['userType']
        if userType == 'Student':
            cursor.execute("SELECT * FROM student WHERE studentId = %s", (user_id,))
            student_data = cursor.fetchall()[0]
            if student_data["subject"] == "Default":
                cursor.execute("UPDATE student SET subject = %s WHERE studentId = %s",
                               (subject_name, user_id))
            else:
                cursor.execute("INSERT INTO student (studentId, studentName, email, subject) "
                               "VALUES (%s, %s, %s, %s)",
                               (user_id, student_data['studentName'], student_data['email'], subject_name))
        elif userType == 'Faculty':
            # Check if default subject exists for the faculty
            cursor.execute("SELECT * FROM faculty WHERE facultyId = %s", (user_id,))
            faculty_data = cursor.fetchall()[0]
            if faculty_data["subject"] == "Default":

                cursor.execute(
                    "UPDATE faculty SET subject = %s, attendencePercentageCriteria = %s WHERE facultyId = %s",
                    (subject_name, data.get("attendance_percentage"), user_id))
            else:
                # Add a new row with all details including the new subject
                cursor.execute("INSERT INTO faculty (facultyId, facultyName, email, subject, "
                               "attendencePercentageCriteria, joiningDate) "
                               "VALUES (%s, %s, %s, %s, %s, %s)",
                               (user_id, faculty_data['facultyName'], faculty_data['email'], subject_name,
                                data.get("attendance_percentage"), faculty_data['joiningDate']))
        db.commit()

        # Return success message
        return jsonify({'message': 'Subject added successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@admin_bp.route('/get_subjects', methods=['GET'])
def get_subjects():
    userId = request.args.get('userId')
    cursor.execute("SELECT * FROM login WHERE userId = %s", (userId,))
    user_data = cursor.fetchone()
    cursor.nextset()
    subject_list = []
    if user_data:
        if user_data['userType'] == 'Student':
            cursor.execute("SELECT subject FROM student WHERE studentId = %s", (userId,))
        elif user_data['userType'] == 'Faculty':
            cursor.execute("SELECT subject FROM faculty WHERE facultyId = %s", (userId,))
        subject_list = cursor.fetchall()
    subject_list = [subject['subject'] for subject in subject_list]
    return jsonify({'subjects': subject_list}), 200


@admin_bp.route('/remove_subject', methods=['POST'])
def remove_subject():
    data = request.json
    userId = data.get('userId')
    subjectName = data.get('subjectName')
    cursor.execute("SELECT * FROM login WHERE userId = %s", (userId,))
    user_data = cursor.fetchone()
    cursor.nextset()
    if user_data:
        if user_data['userType'] == 'Student':
            cursor.execute("DELETE FROM attendance WHERE studentId = %s AND subject = %s", (userId, subjectName))
            cursor.execute("DELETE FROM leave_application WHERE studentId = %s AND subject = %s", (userId, subjectName))
            cursor.execute("SELECT COUNT(*) FROM student WHERE studentId = %s", (userId,))
            subject_count = cursor.fetchone()["COUNT(*)"]
            if subject_count == 1:  # If only one subject left, convert it to "DEFAULT"
                cursor.execute("UPDATE student SET subject = 'Default' WHERE studentId = %s", (userId,))
            else:
                cursor.execute("DELETE FROM student WHERE studentId = %s AND subject = %s", (userId, subjectName))
        elif user_data['userType'] == 'Faculty':
            cursor.execute("DELETE FROM attendance WHERE facultyId = %s AND subject = %s", (userId, subjectName))
            cursor.execute("DELETE FROM leave_application WHERE facultyId = %s AND subject = %s", (userId, subjectName))
            cursor.execute("SELECT COUNT(*) FROM faculty WHERE facultyId = %s", (userId,))
            subject_count = cursor.fetchone()["COUNT(*)"]
            if subject_count == 1:  # If only one subject left, convert it to "DEFAULT"
                cursor.execute("UPDATE faculty SET subject = 'Default' WHERE facultyId = %s", (userId,))
            else:
                cursor.execute("DELETE FROM faculty WHERE facultyId = %s AND subject = %s", (userId, subjectName))
    db.commit()
    return jsonify({'message': 'Subject removed successfully'}), 200
