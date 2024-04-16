drop database if exists attendance_system;
create database attendance_system;
use attendance_system;
create table login
(
    userId   int primary key not NULL,
    userType enum ("Student", "Faculty", "Admin"),
    userName varchar(50),
    password varchar(50)
);
create table student
(
    studentId   int,
    studentName varchar(50),
    email       varchar(100),
    subject     varchar(20),
    primary key (studentId, subject),
    foreign key (studentId) references login (userId)
);

create table faculty
(
    facultyId                    int,
    facultyName                  varchar(50),
    email                        varchar(50),
    subject                      varchar(20),
    attendencePercentageCriteria decimal(4, 2),
    joiningDate                  date,
    primary key (facultyId, subject),
    foreign key (facultyId) references login (userId)
);

create table attendance
(
    subject   varchar(20),
    studentId int,
    facultyId int,
    date      date,
    status    enum ("Present", "Absent"),
    foreign key (studentId, subject) references student (studentId, subject),
    foreign key (facultyId, subject) references faculty (facultyId, subject),
    primary key (subject, studentId, facultyId, date)
);

INSERT INTO login (userId, userType, userName, password)
VALUES (0, 'Admin', 'Admin', 'Admin'),
       (1, 'Student', 'raj.sharma@iiitg.ac.in', 'password123'),
       (2, 'Student', 'priya.singh@iiitg.ac.in', 'student456'),
       (3, 'Student', 'anita.patel@iiitg.ac.in', 'pass789'),
       (4, 'Student', 'vivek.kumar@iiitg.ac.in', 'studentpass'),
       (5, 'Student', 'meera.gupta@iiitg.ac.in', 'brownie22'),
       (6, 'Student', 'arjun.reddy@iiitg.ac.in', 'davismike'),
       (7, 'Student', 'sunita.rai@iiitg.ac.in', 'wilsonSara'),
       (8, 'Student', 'rohan.biswas@iiitg.ac.in', 'david123'),
       (9, 'Student', 'isha.chopra@iiitg.ac.in', 'anderson345'),
       (10, 'Student', 'aman.malhotra@iiitg.ac.in', 'taylorJames'),
       (11, 'Faculty', 'gupta@iiitg.ac.in', 'facultyPass'),
       (12, 'Faculty', 'iyer@iiitg.ac.in', 'johnsonFaculty'),
       (13, 'Faculty', 'deshmukh@iiitg.ac.in', 'profBrown');

INSERT INTO faculty (facultyId, facultyName, email, subject, attendencePercentageCriteria, joiningDate)
VALUES (11, 'Dr. Gupta', 'gupta@iiitg.ac.in', 'Mathematics', 80.00, '2023-01-15'),
       (11, 'Dr. Gupta', 'gupta@iiitg.ac.in', 'Economics', 80.00, '2023-01-15'),
       (12, 'Prof. Iyer', 'iyer@iiitg.ac.in', 'Physics', 75.00, '2022-08-20'),
       (12, 'Prof. Iyer', 'iyer@iiitg.ac.in', 'Mechanics', 75.00, '2022-08-20'),
       (13, 'Dr. Deshmukh', 'deshmukh@iiitg.ac.in', 'Biology', 85.00, '2023-03-10'),
       (13, 'Dr. Deshmukh', 'deshmukh@iiitg.ac.in', 'Chemistry', 85.00, '2023-03-10');

INSERT INTO student (studentId, studentName, email, subject)
VALUES (1, 'Raj Sharma', 'raj.sharma@iiitg.ac.in', 'Mathematics'),
       (1, 'Raj Sharma', 'raj.sharma@iiitg.ac.in', 'Physics'),
       (1, 'Raj Sharma', 'raj.sharma@iiitg.ac.in', 'Chemistry'),
       (1, 'Raj Sharma', 'raj.sharma@iiitg.ac.in', 'Biology'),
       (2, 'Priya Singh', 'priya.singh@iiitg.ac.in', 'Physics'),
       (2, 'Priya Singh', 'priya.singh@iiitg.ac.in', 'Chemistry'),
       (2, 'Priya Singh', 'priya.singh@iiitg.ac.in', 'Biology'),
       (2, 'Priya Singh', 'priya.singh@iiitg.ac.in', 'Economics'),
       (3, 'Anita Patel', 'anita.patel@iiitg.ac.in', 'Biology'),
       (3, 'Anita Patel', 'anita.patel@iiitg.ac.in', 'Chemistry'),
       (3, 'Anita Patel', 'anita.patel@iiitg.ac.in', 'Mathematics'),
       (3, 'Anita Patel', 'anita.patel@iiitg.ac.in', 'Mechanics'),
       (4, 'Vivek Kumar', 'vivek.kumar@iiitg.ac.in', 'Chemistry'),
       (4, 'Vivek Kumar', 'vivek.kumar@iiitg.ac.in', 'Mathematics'),
       (4, 'Vivek Kumar', 'vivek.kumar@iiitg.ac.in', 'Physics'),
       (4, 'Vivek Kumar', 'vivek.kumar@iiitg.ac.in', 'Mechanics'),
       (5, 'Meera Gupta', 'meera.gupta@iiitg.ac.in', 'Economics'),
       (5, 'Meera Gupta', 'meera.gupta@iiitg.ac.in', 'Mathematics'),
       (5, 'Meera Gupta', 'meera.gupta@iiitg.ac.in', 'Physics'),
       (5, 'Meera Gupta', 'meera.gupta@iiitg.ac.in', 'Chemistry'),
       (6, 'Arjun Reddy', 'arjun.reddy@iiitg.ac.in', 'Physics'),
       (6, 'Arjun Reddy', 'arjun.reddy@iiitg.ac.in', 'Chemistry'),
       (6, 'Arjun Reddy', 'arjun.reddy@iiitg.ac.in', 'Biology'),
       (6, 'Arjun Reddy', 'arjun.reddy@iiitg.ac.in', 'Mathematics'),
       (7, 'Sunita Rai', 'sunita.rai@iiitg.ac.in', 'Chemistry'),
       (7, 'Sunita Rai', 'sunita.rai@iiitg.ac.in', 'Physics'),
       (7, 'Sunita Rai', 'sunita.rai@iiitg.ac.in', 'Biology'),
       (7, 'Sunita Rai', 'sunita.rai@iiitg.ac.in', 'Mechanics'),
       (8, 'Rohan Biswas', 'rohan.biswas@iiitg.ac.in', 'Mathematics'),
       (8, 'Rohan Biswas', 'rohan.biswas@iiitg.ac.in', 'Physics'),
       (8, 'Rohan Biswas', 'rohan.biswas@iiitg.ac.in', 'Chemistry'),
       (8, 'Rohan Biswas', 'rohan.biswas@iiitg.ac.in', 'Mechanics'),
       (9, 'Isha Chopra', 'isha.chopra@iiitg.ac.in', 'Physics'),
       (9, 'Isha Chopra', 'isha.chopra@iiitg.ac.in', 'Chemistry'),
       (9, 'Isha Chopra', 'isha.chopra@iiitg.ac.in', 'Biology'),
       (9, 'Isha Chopra', 'isha.chopra@iiitg.ac.in', 'Economics'),
       (10, 'Aman Malhotra', 'aman.malhotra@iiitg.ac.in', 'Chemistry'),
       (10, 'Aman Malhotra', 'aman.malhotra@iiitg.ac.in', 'Biology'),
       (10, 'Aman Malhotra', 'aman.malhotra@iiitg.ac.in', 'Physics'),
       (10, 'Aman Malhotra', 'aman.malhotra@iiitg.ac.in', 'Economics');


-- Change delimiter to //
DELIMITER //

CREATE PROCEDURE generate_random_attendance()
BEGIN
    -- Loop through each student for each subject
    DECLARE student_count INT DEFAULT 1;
    DECLARE subject_count INT DEFAULT 1;
    DECLARE date_counter DATE DEFAULT '2024-03-01'; -- Start date
    DECLARE present_probability FLOAT DEFAULT 0.8; -- 80% probability of being present

    WHILE student_count <= 10
        DO
            -- Assuming 10 students
            WHILE subject_count <= 6
                DO -- Assuming 6 subjects
            -- Fetch facultyId for the subject
                    SET @subject_name = (SELECT subject
                                         FROM student
                                         WHERE studentId = student_count
                                         ORDER BY RAND()
                                         LIMIT 1 -- Randomly select one subject per student
                    );

                    SET @faculty_id = (SELECT facultyId
                                       FROM faculty
                                       WHERE subject = @subject_name
                                       ORDER BY RAND()
                                       LIMIT 1 -- Randomly select one faculty member for the subject
                    );

                    WHILE date_counter <= DATE_ADD('2024-03-14', INTERVAL 1 DAY)
                        DO -- Extend attendance for two weeks
                    -- Check if attendance record already exists for the student, subject, and date
                            IF NOT EXISTS (SELECT 1
                                           FROM attendance
                                           WHERE studentId = student_count
                                             AND subject = @subject_name
                                             AND date = date_counter) THEN
                                -- Insert random attendance status
                                INSERT INTO attendance (subject, studentId, facultyId, date, status)
                                VALUES (@subject_name,
                                        student_count,
                                        @faculty_id,
                                        date_counter,
                                        CASE WHEN RAND() < present_probability THEN 'Present' ELSE 'Absent' END);
                            END IF;

                            SET date_counter = DATE_ADD(date_counter, INTERVAL 1 DAY); -- Move to the next date
                        END WHILE;

                    SET date_counter = '2024-03-01'; -- Reset date for the next subject
                    SET subject_count = subject_count + 1; -- Move to the next subject
                END WHILE;

            SET subject_count = 1; -- Reset subject for the next student
            SET student_count = student_count + 1; -- Move to the next student
        END WHILE;
END//

-- Reset delimiter to ;
DELIMITER ;
call generate_random_attendance();

select *
from student;
select *
from faculty;
select *
from attendance;
select *
from login;

create table leave_application
(
    applicationId int primary key not NULL,
    studentId     int,
    facultyId     int,
    subject       varchar(20),
    start_date    date,
    end_date      date,
    reason        varchar(200),
    status        enum ("Approved", "Rejected", "Pending"),
    foreign key (studentId, subject) references student (studentId, subject),
    foreign key (facultyId, subject) references faculty (facultyId, subject)
);

insert into leave_application
values (1, 1, 11, 'Mathematics', '2023-04-01', '2023-04-10', 'Sick Leave', 'Pending');