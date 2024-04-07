# Connect to MySQL database
import mysql.connector

db = mysql.connector.connect(
     host="localhost",
    user="root",
    password="ManHunter@471",
    database="attendance_system"
)

cursor = db.cursor(dictionary=True)
