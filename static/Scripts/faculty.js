let selected_subject;
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the user ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');

    // document.querySelector("wrapper").style.display="block";
    function fetchFacultyDetails() {
        fetch('/getFacultyDetails?userID=' + userID) // Replace with your actual endpoint to fetch faculty details
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch faculty details');
                }
            })
            .then(faculty => {
                // Populate the faculty details on the webpage
                document.getElementById('facultyName').innerText = faculty.facultyName;
                document.getElementById('facultyEmail').innerText = faculty.email;
                document.getElementById('facultyID').innerText = "ID: " + faculty.facultyId;
                // Add more fields as needed
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fetchSubjectButtons() {
        fetch('/getFacultySubjects?userID=' + userID) // Replace with your actual endpoint to fetch faculty subjects
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch faculty subjects');
                }
            })
            .then(subjects => {
                // Populate subject buttons on the webpage
                const nav = document.getElementById('subjectNav');
                subjects.forEach((subject, index) => {
                    const button = document.createElement('button');
                    button.id = `subject-${index}`;
                    button.textContent = subject.subject;
                    button.addEventListener('click', function () {
                        selected_subject = subject.subject;
                        let attendanceSection = document.querySelector(".attendance-section");
                        if (attendanceSection.style.display === "block") {
                            fetchStudentUserIDs(subject.subject);
                        }
                        let defaulter = document.querySelector(".defaulters");
                        if (defaulter.style.display === "block") {
                            fetchDefaulters(subject.subject);
                        }
                    });
                    nav.appendChild(button);
                });
                document.getElementById("subject-0").click();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error, e.g., display error message to the user
            });
    }

    fetchFacultyDetails();
    setTimeout(fetchSubjectButtons, 1000);

    let userIDIndex = 0;
    let studentUserIDs = [];

    function fetchStudentUserIDs(subject) {
        fetch('/getStudentUserIDs?subject=' + subject)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student user IDs');
                }
            })
            .then(data => {
                studentUserIDs = data;
                updateStudentDetails();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateStudentDetails() {
        const userID = studentUserIDs[userIDIndex];
        fetch('/getStudentDetails?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student details');
                }
            })
            .then(student => {
                // Populate student details on the webpage
                document.getElementById('studentName').innerText = student.studentName;
                document.getElementById('rollNumber').innerText = student.studentId;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    document.querySelector('.nextBtn').addEventListener('click', function () {
        userIDIndex = (userIDIndex + 1) % studentUserIDs.length;
        const previousMessageDiv = document.querySelector('.submit').nextElementSibling;
        if (previousMessageDiv) {
            previousMessageDiv.remove();
        }
        updateStudentDetails(); // Update student details
    });

    // Event listener for the "Back" button
    document.querySelector('.backBtn').addEventListener('click', function () {
        userIDIndex = (userIDIndex - 1 + studentUserIDs.length) % studentUserIDs.length; // Decrement the index
        const previousMessageDiv = document.querySelector('.submit').nextElementSibling;
        if (previousMessageDiv) {
            previousMessageDiv.remove();
        }
        updateStudentDetails(); // Update student details
    });
    document.querySelector('.submit').addEventListener('click', function () {
        const studentID = document.getElementById('rollNumber').innerText;

        //check if date is selected
        const date = document.getElementById('date').value;
        if (!date) {
            alert('Please select a date');
            return;
        }

        // Get the selected attendance status from the radio buttons
        let status;

        // Check which radio button is selected
        if (document.getElementById('present').checked) {
            status = 'Present';
        } else if (document.getElementById('absent').checked) {
            status = 'Absent';
        } else {
            // Handle the case where neither radio button is selected
            alert('Please select attendance status');
            return; // Stop execution if attendance status is not selected
        }

        const data = {
            'faculty_id': userID, 'student_id': studentID, 'subject': selected_subject, 'date': date, 'status': status
        };

        fetch('/markAttendance', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to mark attendance');
                }
            })
            .then(data => {
                const previousMessageDiv = document.querySelector('.submit').nextElementSibling;
                if (previousMessageDiv) {
                    previousMessageDiv.remove();
                }
                const messageDiv = document.createElement('div');
                messageDiv.style.marginTop = '15px';
                messageDiv.style.color = 'green';
                messageDiv.textContent = data.message; // Assuming the response contains a 'message' field
                document.querySelector('.submit').insertAdjacentElement('afterend', messageDiv);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function markAttendance() {

        document.querySelector(".mark").classList.add("active");
        document.querySelector(".leave").classList.remove("active");
        document.querySelector(".defaulter_button").classList.remove("active")
        document.querySelector(".logout").classList.remove("active");
        let leaveSection = document.querySelector(".leave-section");
        if (leaveSection.style.display === "block") {
            leaveSection.style.display = "none";
        }
        let attendanceSection = document.querySelector(".attendance-section");
        if (attendanceSection.style.display === "none") {
            document.querySelector(".nextBtn").style.display = "block";
            document.querySelector(".backBtn").style.display = "block";
            attendanceSection.style.display = "block";
        }
        let defaulter = document.querySelector(".defaulters");
        if (defaulter.style.display === "block") {
            defaulter.style.display = "none";
        }
        document.getElementById("subject-0").click();
    }

    function leaveApplication() {

        document.querySelector(".mark").classList.remove("active");
        document.querySelector(".leave").classList.add("active");
        document.querySelector(".defaulter_button").classList.remove("active")
        document.querySelector(".logout").classList.remove("active");
        let attendanceSection = document.querySelector(".attendance-section");
        if (attendanceSection.style.display === "block") {
            attendanceSection.style.display = "none";
            document.querySelector(".nextBtn").style.display = "none";
            document.querySelector(".backBtn").style.display = "none";
        }
        let leaveSection = document.querySelector(".leave-section");
        if (leaveSection.style.display === "none") {
            leaveSection.style.display = "block";
        }
        let defaulter = document.querySelector(".defaulters");
        if (defaulter.style.display === "block") {
            defaulter.style.display = "none";
        }
        fetchLeaveApplication();
    }

    function fetchLeaveApplication() {

        fetch('/getLeaveApplication?userID=' + userID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch leave application');
                }
            })
            .then(leaveApplication => {
                console.log(leaveApplication)
                const tableBody = document.querySelector('#leave_table tbody');
                if (tableBody) {
                    detachLeaveDetailsRow();
                    tableBody.innerHTML = '';
                } else {
                    console.error('Table body not found');
                }

                leaveApplication.forEach(application => {
                    console.log(application);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${application.applicationId}</td>
                    <td>${application.subject}</td>
                    <td>${application.studentId}</td>
                    <td>${application.studentName}</td>
                    <td>${application.status}</td>
                    `;
                    tr.addEventListener('click', function () {
                        reattachLeaveDetailsRow();
                        showLeaveDetails(application);
                    });
                    if (tableBody.firstChild) {
                        tableBody.insertBefore(tr, tableBody.firstChild);
                    } else {
                        tableBody.appendChild(tr);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    const leaveDetailsRow = document.getElementById('some');

    function detachLeaveDetailsRow() {
        if (leaveDetailsRow.parentNode) {
            leaveDetailsRow.parentNode.removeChild(leaveDetailsRow);
        }
    }

    function reattachLeaveDetailsRow() {
        const tableBody = document.querySelector('#leave_table tbody');
        if (tableBody) {
            tableBody.appendChild(leaveDetailsRow);
        }
    }


    function showLeaveDetails(application) {
        document.getElementById('leaveAppID').textContent = application.applicationId;
        document.getElementById('leaveSubject').textContent = application.subject;
        document.getElementById('leaveStudentID').textContent = application.studentId;
        document.getElementById('leaveStudentName').textContent = application.studentName;
        document.getElementById('leaveSDate').textContent = application.start_date.substring(0, 16);
        document.getElementById('leaveEDate').textContent = application.end_date.substring(0, 16);
        document.getElementById('leaveReason').textContent = application.reason;
        document.getElementById('leaveStatus').textContent = application.status;
        //  document.getElementById('leaveDetails').style.display = 'block';
        //  document.getElementById('leaveBtns').style.display = 'block';
        document.getElementById('some').style.display = "";
    }

    document.querySelector('.approveBtn').addEventListener('click', function () {
        approveLeave();
        setTimeout(fetchLeaveApplication, 1000);
    });

    document.querySelector('.rejectBtn').addEventListener('click', function () {
        rejectLeave();
        setTimeout(fetchLeaveApplication, 1000);
    });

    // Close the dropdown if the user clicks outside of it
    function defaulters(subject) {

        document.querySelector(".mark").classList.remove("active");
        document.querySelector(".leave").classList.remove("active");
        document.querySelector(".defaulter_button").classList.add("active")
        document.querySelector(".logout").classList.remove("active");
        let attendanceSection = document.querySelector(".attendance-section");
        if (attendanceSection.style.display === "block") {
            attendanceSection.style.display = "none";
            document.querySelector(".nextBtn").style.display = "none";
            document.querySelector(".backBtn").style.display = "none";
        }
        let leaveSection = document.querySelector(".leave-section");
        if (leaveSection.style.display === "block") {
            leaveSection.style.display = "none";
        }
        let defaulter = document.querySelector(".defaulters");
        if (defaulter.style.display === "none") {
            defaulter.style.display = "block";
        }
        document.getElementById("subject-0").click();
    }

    function approveLeave() {
        const applicationId = document.getElementById('leaveAppID').textContent;
        // Call API to approve the leave application with the provided applicationId
        fetch('/approveLeave', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({applicationId})
        })
            .then(response => {
                if (response.ok) {
                    console.log('Leave application approved successfully');
                    // Optionally, update UI or perform other actions
                } else {
                    throw new Error('Failed to approve leave application');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function rejectLeave() {
        const applicationId = document.getElementById('leaveAppID').textContent;
        // Call API to reject the leave application with the provided applicationId
        fetch('/rejectLeave', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({applicationId})
        })
            .then(response => {
                if (response.ok) {
                    console.log('Leave application rejected successfully');
                    // Optionally, update UI or perform other actions
                } else {
                    throw new Error('Failed to reject leave application');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fetchDefaulters(subject) {
        document.querySelector(".selectSub").innerText = "";
        fetch('/getDefaulters?subject=' + subject)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch attendance data');
                }
            })
            .then(attendance => {
                console.log(attendance)
                if (attendance.length == 0) {
                    console.log('table is empty')
                    document.querySelector(".emptyTable").style.display = "block";
                    document.querySelector("#defaulters_table").style.display = "none"
                } else {
                    document.querySelector(".emptyTable").style.display = "none";
                    document.querySelector("#defaulters_table").style.display = "table"
                }
                const tableBody = document.querySelector('#defaulters_table tbody');
                tableBody.innerHTML = '';
                attendance.forEach(record => {
                    console.log(record);
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                           <!--remove the time part-->
                        <td>${record[0]}</td>  
                        <td>${record[1]}</td>
                        <td>${record[2]}</td>
                        
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    document.querySelector('.mark').addEventListener('click', function () {
        document.getElementById('subjectNav').style.display = "";
        markAttendance();
    });
    document.querySelector('.leave').addEventListener('click', function (e) {
        document.getElementById('subjectNav').style.display = "none";
        leaveApplication();
    });
    document.querySelector('.defaulter_button').addEventListener('click', function () {
        document.getElementById('subjectNav').style.display = "";
        defaulters();
    });
});
/*
document.querySelector('.mark').addEventListener('click', function () {

    document.getElementsByClassName("attendance-section").style.display = "none";
    document.getElementsByClassName("nextBtn").style.display = "visible";
    document.getElementsByClassName("backBtn").style.display = "visible";


});*/
