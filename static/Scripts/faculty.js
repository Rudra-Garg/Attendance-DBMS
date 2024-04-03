let selected_subject;
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the user ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');

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
                document.getElementById('facultyID').innerText = "ID: "+faculty.facultyId;
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
                subjects.forEach(subject => {
                    const button = document.createElement('button');
                    button.textContent = subject.subject;
                    button.addEventListener('click', function () {
                        selected_subject = subject.subject;
                        fetchStudentUserIDs(subject.subject);
                    });
                    nav.appendChild(button);
                });
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
        userIDIndex = (userIDIndex + 1) % studentUserIDs.length; // Increment the index
        updateStudentDetails(); // Update student details
    });

    // Event listener for the "Back" button
    document.querySelector('.backBtn').addEventListener('click', function () {
        userIDIndex = (userIDIndex - 1 + studentUserIDs.length) % studentUserIDs.length; // Decrement the index
        updateStudentDetails(); // Update student details
    });
    document.querySelector('.submit').addEventListener('click', function () {
        const studentID = document.getElementById('rollNumber').innerText;
        const date = document.getElementById('date').value;
        let status;

        // Check which radio button is selected
        if (document.getElementById('present').checked) {
            status = 'Present';
        } else if (document.getElementById('absent').checked) {
            status = 'Absent';
        } else {
            // Handle the case where neither radio button is selected
            console.error('Please select attendance status');
            return; // Stop execution if attendance status is not selected
        }

        const data = {
            'faculty_id': userID,
            'student_id': studentID,
            'subject': selected_subject,
            'date': date,
            'status': status
        };

        fetch('/markAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Attendance marked successfully');
                } else {
                    throw new Error('Failed to mark attendance');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

});

document.querySelector('.mark').addEventListener('click', function (){
   
      document.getElementsByClassName("attendance-section").style.display = "none";
      document.getElementsByClassName("nextBtn").style.display = "visible";
      document.getElementsByClassName("backBtn").style.display = "visible";

    
    
    
  });
