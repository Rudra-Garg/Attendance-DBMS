drop database if exists attendance_system;
create database attendance_system;
use attendance_system;

create table student
(
    studentId   int,
    studentName varchar(50),
    email       varchar(100),
    subject     varchar(20)
);

create table faculty
(
    facultyId                    int,
    facultyName                  varchar(50),
    email                        varchar(50),
    subject                      varchar(20),
    attendencePercentageCriteria decimal(4, 2),
    joiningDate                  date
);

create table attendance
(
    subject   varchar(20),
    studentId int,
    facultyId int,
    date      date,
    status    enum ("Present", "Absent")
);

create table login
(
    userId   int primary key not NULL,
    userType enum ("Student", "Faculty"),
    userName varchar(50),
    password varchar(50)
);

INSERT INTO login (userId, userType, userName, password)
VALUES (1, 'Student', 'john.doe@example.com', 'password123'),
       (2, 'Student', 'jane.smith@example.com', 'student456'),
       (3, 'Student', 'alice.johnson@example.com', 'pass789'),
       (4, 'Student', 'bob.williams@example.com', 'studentpass'),
       (5, 'Student', 'emily.brown@example.com', 'brownie22'),
       (6, 'Student', 'michael.davis@example.com', 'davismike'),
       (7, 'Student', 'sarah.wilson@example.com', 'wilsonSara'),
       (8, 'Student', 'david.martinez@example.com', 'david123'),
       (9, 'Student', 'olivia.anderson@example.com', 'anderson345'),
       (10, 'Student', 'james.taylor@example.com', 'taylorJames'),
       (11, 'Faculty', 'smith@example.com', 'facultyPass'),
       (12, 'Faculty', 'johnson@example.com', 'johnsonFaculty'),
       (13, 'Faculty', 'brown@example.com', 'profBrown');

INSERT INTO faculty (facultyId, facultyName, email, subject, attendencePercentageCriteria, joiningDate)
VALUES (11, 'Dr. Smith', 'smith@example.com', 'Mathematics', 80.00, '2023-01-15'),
       (11, 'Dr. Smith', 'smith@example.com', 'Economics', 80.00, '2023-01-15'),
       (12, 'Prof. Johnson', 'johnson@example.com', 'Physics', 75.00, '2022-08-20'),
       (12, 'Prof. Johnson', 'johnson@example.com', 'Mechanics', 75.00, '2022-08-20'),
       (13, 'Dr. Brown', 'brown@example.com', 'Biology', 85.00, '2023-03-10'),
       (13, 'Dr. Brown', 'brown@example.com', 'Chemistry', 85.00, '2023-03-10');


INSERT INTO student (studentId, studentName, email, subject)
VALUES (1, 'John Doe', 'john.doe@example.com', 'Mathematics'),
       (1, 'John Doe', 'john.doe@example.com', 'Physics'),
       (1, 'John Doe', 'john.doe@example.com', 'Chemistry'),
       (1, 'John Doe', 'john.doe@example.com', 'Biology'),
       (2, 'Jane Smith', 'jane.smith@example.com', 'Physics'),
       (2, 'Jane Smith', 'jane.smith@example.com', 'Chemistry'),
       (2, 'Jane Smith', 'jane.smith@example.com', 'Biology'),
       (2, 'Jane Smith', 'jane.smith@example.com', 'Economics'),
       (3, 'Alice Johnson', 'alice.johnson@example.com', 'Biology'),
       (3, 'Alice Johnson', 'alice.johnson@example.com', 'Chemistry'),
       (3, 'Alice Johnson', 'alice.johnson@example.com', 'Mathematics'),
       (3, 'Alice Johnson', 'alice.johnson@example.com', 'Mechanics'),
       (4, 'Bob Williams', 'bob.williams@example.com', 'Chemistry'),
       (4, 'Bob Williams', 'bob.williams@example.com', 'Mathematics'),
       (4, 'Bob Williams', 'bob.williams@example.com', 'Physics'),
       (4, 'Bob Williams', 'bob.williams@example.com', 'Mechanics'),
       (5, 'Emily Brown', 'emily.brown@example.com', 'Economics'),
       (5, 'Emily Brown', 'emily.brown@example.com', 'Mathematics'),
       (5, 'Emily Brown', 'emily.brown@example.com', 'Physics'),
       (5, 'Emily Brown', 'emily.brown@example.com', 'Chemistry'),
       (6, 'Michael Davis', 'michael.davis@example.com', 'Physics'),
       (6, 'Michael Davis', 'michael.davis@example.com', 'Chemistry'),
       (6, 'Michael Davis', 'michael.davis@example.com', 'Biology'),
       (6, 'Michael Davis', 'michael.davis@example.com', 'Mathematics'),
       (7, 'Sarah Wilson', 'sarah.wilson@example.com', 'Chemistry'),
       (7, 'Sarah Wilson', 'sarah.wilson@example.com', 'Physics'),
       (7, 'Sarah Wilson', 'sarah.wilson@example.com', 'Biology'),
       (7, 'Sarah Wilson', 'sarah.wilson@example.com', 'Mechanics'),
       (8, 'David Martinez', 'david.martinez@example.com', 'Mathematics'),
       (8, 'David Martinez', 'david.martinez@example.com', 'Physics'),
       (8, 'David Martinez', 'david.martinez@example.com', 'Chemistry'),
       (8, 'David Martinez', 'david.martinez@example.com', 'Mechanics'),
       (9, 'Olivia Anderson', 'olivia.anderson@example.com', 'Physics'),
       (9, 'Olivia Anderson', 'olivia.anderson@example.com', 'Chemistry'),
       (9, 'Olivia Anderson', 'olivia.anderson@example.com', 'Biology'),
       (9, 'Olivia Anderson', 'olivia.anderson@example.com', 'Economics'),
       (10, 'James Taylor', 'james.taylor@example.com', 'Chemistry'),
       (10, 'James Taylor', 'james.taylor@example.com', 'Biology'),
       (10, 'James Taylor', 'james.taylor@example.com', 'Physics'),
       (10, 'James Taylor', 'james.taylor@example.com', 'Economics');


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
    studentId int,
    facultyId int,
    subject   varchar(20),
    start_date      date,
    end_date date,
    reason varchar(200),
    status    enum ("Approved", "Rejected", "Pending")
);

insert into leave_application values (1, 1, 11, 'Mathematics', '2023-04-01', '2023-04-10', 'Sick Leave', 'Pending');