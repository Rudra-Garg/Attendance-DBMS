import mysql.connector
from flask import *

app = Flask(__name__)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)


@app.route('/')
def login_page():
    return render_template('login.html')


@app.route('/student')
def student_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('student.html', userID=userID)


@app.route('/faculty')
def faculty_page():
    userID = request.args.get('userID')  # Retrieve user ID from query parameter
    return render_template('faculty.html', userID=userID)


@app.route('/getStudents', methods=['GET'])
def get_students():
    cursor.execute("SELECT * FROM student")
    students = cursor.fetchall()
    return jsonify(students)


# Endpoint to retrieve all faculty members
@app.route('/getFaculty', methods=['GET'])
def get_faculty():
    cursor.execute("SELECT * FROM faculty")
    faculty = cursor.fetchall()
    return jsonify(faculty)


# Endpoint to retrieve attendance records
@app.route('/getAttendance', methods=['GET'])
def get_attendance():
    cursor.execute("SELECT * FROM attendance")
    attendance = cursor.fetchall()
    return jsonify(attendance)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = userType(username, password)
    print(user)
    if user:
        return jsonify({'message': 'Login successful', 'usertype': user['userType'], 'userID': user['userId']}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


def userType(username, password):
    cursor.execute("SELECT * FROM login WHERE userName = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    if user:
        return user
    else:
        return None


@app.route('/getStudentDetails', methods=['GET'])
def get_student_details():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM student WHERE studentId = %s", (userID,))
    student = cursor.fetchone()
    return jsonify(student)


@app.route('/getStudentSubjects', methods=['GET'])
def get_student_subjects():
    userID = request.args.get('userID')
    cursor.execute("select subject from student where studentId = %s", (userID,))
    subjects = cursor.fetchall()
    return jsonify(subjects)


@app.route('/getStudentAttendance', methods=['GET'])
def get_student_attendance():
    userID = request.args.get('userID')
    cursor.execute("SELECT subject, status, date FROM attendance WHERE studentId = %s", (userID,))
    attendance = cursor.fetchall()
    return jsonify(attendance)


@app.route('/getFacultyDetails', methods=['GET'])
def get_faculty_details():
    userID = request.args.get('userID')
    cursor.execute("SELECT * FROM faculty WHERE facultyId = %s", (userID,))
    student = cursor.fetchone()
    return jsonify(student)


@app.route('/getFacultySubjects', methods=['GET'])
def get_faculty_subjects():
    userID = request.args.get('userID')
    cursor.execute("select subject from faculty where facultyId = %s", (userID,))
    subjects = cursor.fetchall()
    print(subjects)
    return jsonify(subjects)


@app.route('/getfacultyAttendance', methods=['GET'])
def get_faculty_attendance():
    userID = request.args.get('userID')
    cursor.execute("SELECT subject, status, date FROM attendance WHERE facultyId = %s", (userID,))
    attendance = cursor.fetchall()
    return jsonify(attendance)


if __name__ == '__main__':
    app.run(debug=True)
