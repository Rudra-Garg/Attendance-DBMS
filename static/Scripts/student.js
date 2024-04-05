document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');

    function fetchStudentDetails() {
        fetch('/getStudentDetails?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student details');
                }
            })
            .then(student => {
                document.getElementById('studentName').innerText = student.studentName;
                document.getElementById('studentEmail').innerText = student.email;
                document.getElementById('studentID').innerText = 'ID: ' + student.studentId;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fetchSubjectButtons() {
        fetch('/getStudentSubjects?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student subjects');
                }
            })
            .then(subjects => {
                const nav = document.getElementById('subjectNav');
                subjects.forEach((subject, index) => {
                    const button = document.createElement('button');
                    button.textContent = subject.subject;
                    button.id = 'subjectButton_' + index; // Assign indexed ID
                    button.addEventListener('click', function () {
                        fetchAttendanceData(subject.subject);
                    });
                    nav.appendChild(button);
                });
                setTimeout(fetchAttendanceData, 1000, subjects[0].subject);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    function fetchAttendanceData(subject) {
        document.getElementById('attendanceTable').style.display = 'none';
        document.getElementById('attendanceBtnContainer').innerHTML = '';

        fetch('/getStudentAttendance?userID=' + userID + '&subject=' + subject)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch attendance data');
                }
            })
            .then(attendance => {
                console.log(attendance)
                const tableBody = document.querySelector('#attendanceTable tbody');
                tableBody.innerHTML = ''; // Clear existing table rows
                attendance.forEach(record => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                           <!--remove the time part-->
                        <td>${record.date.substring(0, 16)}</td>  
                        <td>${record.status}</td>
                      
                    `;
                    tableBody.appendChild(tr);
                });

                setTimeout(fetchAverageAttendance, 1000, subject);
                /*const showAttendanceBtn = document.createElement('button');
                showAttendanceBtn.textContent = 'Show Attendance';
                showAttendanceBtn.addEventListener('click', function () {
                    document.getElementById('attendanceTable').style.display = 'block';
                    document.getElementById('averageAttendance').style.display = 'block';
                });
                document.getElementById('attendanceBtnContainer').appendChild(showAttendanceBtn);*/
                document.getElementById('attendanceTable').style.display = 'block';
                document.getElementById('averageAttendance').style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fetchAverageAttendance(sub) {
        fetch('/getStudentAverageAttendance?userID=' + userID + '&subject=' + sub)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch average attendance');
                }
            })
            .then(averageAttendance => {
                const Percentage = document.getElementById('percent');
                Percentage.textContent = averageAttendance.average_attendance + "% ";

                const criteria = document.getElementById('criteria');
                criteria.textContent = averageAttendance.criterion + '%';

                const progressBar = document.getElementById('progressBar');
                const bar = progressBar.querySelector('.bar');
                const percentage = averageAttendance.average_attendance;
                bar.style.width = percentage + '%';

                bar.classList.remove('green', 'red', 'blue');

                if (percentage >= averageAttendance.criterion) {
                    bar.classList.add('green');
                    document.querySelector("meta[name=theme-color]").setAttribute("content", "#4CAF50");
                } else {
                    bar.classList.add('red');
                    document.querySelector("meta[name=theme-color]").setAttribute("content", "#FF5722");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function showRecords() {
        document.querySelector(".mark").classList.add("active");
        document.querySelector(".leave").classList.remove("active");
        document.querySelector(".logout").classList.remove("active");
        let leaveSection = document.querySelector(".leave-section");
        if (leaveSection.style.display === "block") {
            leaveSection.style.display = "none";
        }
        let attendanceSection = document.querySelector(".Attendance-Section");
        if (attendanceSection.style.display === "none") {
            attendanceSection.style.display = "block";
            document.getElementById("subjectButton_0").click();
        }
    }

    document.querySelector('.mark').addEventListener('click', function () {
        showRecords();
    });

    function fetchLeaveApplications() {
        fetch('/getLeaveApplications?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch leave applications');
                }
            })
            .then(applications => {
                const tableBody = document.querySelector('#leaveTable tbody');
                tableBody.innerHTML = ''; // Clear existing table rows
                applications.forEach(application => {
                    console.log(application);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${application.applicationId}</td>
                    <td>${application.subject}</td>
                    <td>${application.status}</td>
                `;
                    tr.addEventListener('click', function () {
                        showLeaveDetails(application);
                    });
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

// Function to show leave application details
    function showLeaveDetails(application) {
        document.getElementById('leaveAppID').textContent = application.applicationId;
        document.getElementById('leaveSubject').textContent = application.subject;
        document.getElementById('leaveSDate').textContent = application.start_date.substring(0, 16);
        document.getElementById('leaveEDate').textContent = application.end_date.substring(0, 16);
        document.getElementById('leaveReason').textContent = application.reason;
        document.getElementById('leaveStatus').textContent = application.status;
        document.getElementById('leaveDetails').style.display = 'block';
    }

// Function to handle form submission for creating new leave application
    document.getElementById('leaveForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form field values
        const subject = document.getElementById('subject').value.trim(); // Trim whitespace
        const startDate = document.getElementById('startDate').value.trim(); // Trim whitespace
        const endDate = document.getElementById('endDate').value.trim(); // Trim whitespace
        const reason = document.getElementById('reason').value.trim(); // Trim whitespace

        // Check if any value is empty
        if (subject === '' || startDate === '' || endDate === '' || reason === '') {
            alert('Please fill in all fields before submitting the leave application.');
            return; // Exit the function without submitting the form
        }

        // Create the request body
        const formData = {
            subject: subject,
            startDate: startDate,
            endDate: endDate,
            reason: reason,
            studentId: userID
        };

        // Send a POST request to the Flask API endpoint
        fetch('/submitLeaveApplication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to submit leave application');
                }
            })
            .then(data => {
                // Handle success response from the server
                alert('Leave application submitted successfully!');
                // Clear form fields
                document.getElementById('subject').value = ''; // Reset subject to empty string
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                document.getElementById('reason').value = '';
                fetchLeaveApplications();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error response from the server
                alert('Failed to submit leave application. Please try again later.');
            });
    });


    function fetchSubjectDropdown() {
        fetch('/getStudentSubjects?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student subjects');
                }
            })
            .then(subjects => {
                const subjectDropdown = document.getElementById('subject');
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.subject;
                    option.textContent = subject.subject;
                    subjectDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    function leaveApplication() {
        document.querySelector(".mark").classList.remove("active");
        document.querySelector(".leave").classList.add("active");
        document.querySelector(".logout").classList.remove("active");
        let leaveSection = document.querySelector(".leave-section");
        if (leaveSection.style.display === "none") {
            leaveSection.style.display = "block";
        }
        let attendanceSection = document.querySelector(".Attendance-Section");
        if (attendanceSection.style.display === "block") {
            attendanceSection.style.display = "none";
        }
        fetchLeaveApplications();
        setTimeout(fetchSubjectDropdown, 1000);
    }

    document.querySelector('.leave').addEventListener('click', function () {
        leaveApplication();
    });


    setTimeout(fetchSubjectButtons, 1000);
    fetchStudentDetails();
});

