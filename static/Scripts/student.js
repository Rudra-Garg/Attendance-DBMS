document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the user ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');

    // Function to fetch student details using the user ID
    function fetchStudentDetails() {
        fetch('/getStudentDetails?userID=' + userID) // Replace with your actual endpoint to fetch student details
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student details');
                }
            })
            .then(student => {
                // Populate the student details on the webpage
                document.getElementById('studentName').innerText = student.name;
                document.getElementById('studentEmail').innerText = student.email;
                document.getElementById('studentID').innerText = student.studentID;
                // Add more fields as needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error, e.g., display error message to the user
            });
    }

    // Function to fetch subject buttons for the student
    function fetchSubjectButtons() {
        fetch('/getStudentSubjects?userID=' + userID) // Replace with your actual endpoint to fetch student subjects
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch student subjects');
                }
            })
            .then(subjects => {
                // Populate subject buttons on the webpage
                const nav = document.getElementById('subjectNav');
                subjects.forEach(subject => {
                    console.log(subject)
                    const button = document.createElement('button');
                    button.textContent = subject.subject;
                    // Add event listener to each button if needed
                    nav.appendChild(button);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error, e.g., display error message to the user
            });
    }

    // Function to fetch attendance data for the student
    function fetchAttendanceData() {
        fetch('/getStudentAttendance?userID=' + userID) // Replace with your actual endpoint to fetch student attendance
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch attendance data');
                }
            })
            .then(attendance => {
                // Populate attendance data on the webpage
                const tableBody = document.querySelector('#attendanceTable tbody');
                attendance.forEach(record => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${record.subject}</td>
                        <td>${record.status}</td>
                        <td>${record.date}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error, e.g., display error message to the user
            });
    }

    // Call fetchStudentDetails function when the page loads
    // fetchStudentDetails();

    // Call fetchSubjectButtons function when the page loads
    setTimeout(fetchSubjectButtons, 1000);

    // Call fetchAttendanceData function when the page loads
    fetchAttendanceData();
});
