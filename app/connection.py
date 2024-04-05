# Connect to MySQL database
import mysql.connector

db = mysql.connector.connect(
      host="localhost",
    user="root",
    password="0000",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)

