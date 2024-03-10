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
    return render_template('student.html')


@app.route('/faculty')
def faculty_page():
    return render_template('faculty.html')


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
    if user:
        return jsonify({'message': 'Login successful', 'usertype': user}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


def userType(username, password):
    cursor.execute("SELECT * FROM login WHERE userName = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    if user:
        return user['userType']
    else:
        return None


if __name__ == '__main__':
    app.run(debug=True)
