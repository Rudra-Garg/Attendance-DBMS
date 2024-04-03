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
                document.getElementById('studentID').innerText = student.studentId;
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
                subjects.forEach(subject => {
                    const button = document.createElement('button');
                    button.textContent = subject.subject;
                    button.addEventListener('click', function () {
                        fetchAttendanceData(subject.subject);
                    });
                    nav.appendChild(button);
                });
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
                const showAttendanceBtn = document.createElement('button');
                showAttendanceBtn.textContent = 'Show Attendance';
                showAttendanceBtn.addEventListener('click', function () {
                    document.getElementById('attendanceTable').style.display = 'block';
                    document.getElementById('averageAttendance').style.display = 'block';
                });
                document.getElementById('attendanceBtnContainer').appendChild(showAttendanceBtn);
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
    
    


    setTimeout(fetchSubjectButtons, 1000);
    fetchStudentDetails(); // Fetch average attendance when the page loads
});

