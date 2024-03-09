from flask import *
import mysql.connector

app = Flask(__name__)

# Configure MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)


@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')


# Endpoint to retrieve all students
@app.route('/students', methods=['GET'])
def get_students():
    cursor.execute("SELECT * FROM student")
    students = cursor.fetchall()
    return jsonify(students)


# Endpoint to retrieve all faculty members
@app.route('/faculty', methods=['GET'])
def get_faculty():
    cursor.execute("SELECT * FROM faculty")
    faculty = cursor.fetchall()
    return jsonify(faculty)


# Endpoint to retrieve attendance records
@app.route('/attendance', methods=['GET'])
def get_attendance():
    cursor.execute("SELECT * FROM attendance")
    attendance = cursor.fetchall()
    return jsonify(attendance)


# Endpoint to log in
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor.execute("SELECT * FROM login WHERE userName = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    if user:
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


if __name__ == '__main__':
    app.run(debug=True)
