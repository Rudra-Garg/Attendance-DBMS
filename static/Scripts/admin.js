document.addEventListener('DOMContentLoaded', function () {

    fetch('/find_greatest_user_id')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch greatest user ID');
            }
        })
        .then(data => {
            document.getElementById('UserId').textContent = data.greatest_user_id + 1;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // Add event listener to the add member form
    const addMemberForm = document.getElementById('addMemberForm');

    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Gather the form data
        const formData = {
            memberType: document.getElementById('memberType').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            passwd: document.getElementById('passwd').value
        };
        // Send a POST request to the Flask endpoint
        fetch('/add_member', {
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
                    throw new Error('Failed to add member');
                }
            })
            .then(data => {

                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = 'Member added successfully!';
                successMessage.style.display = 'block';
                location.reload();
                // You can optionally redirect or display a success message here
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                // You can display an error message to the user here
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const removeMemberForm = document.getElementById('removeMemberForm');
    const confirmationSection = document.getElementById('confirmationSection');
    const memberDetails = document.getElementById('memberDetails');
    const successMessage = document.getElementById('successMessage');

    removeMemberForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Gather the form data
        const memberIDToRemove = document.getElementById('memberIDToRemove').value;

        // Send a POST request to the Flask endpoint to get member details
        fetch(`/get_member_details?userId=${memberIDToRemove}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch member details');
                }
            })
            .then(data => {
                console.log(data);
                // Display member details in the confirmation section
                memberDetails.innerHTML = ``;
                if (data.member_details) {
                    // Additional member details based on member type (student or faculty)
                    if (data.user.userType === 'Student') {
                        memberDetails.innerHTML += `<p>Name: ${data.member_details.studentName}</p><p>Email: ${data.user.userName}</p><p>Student ID: ${data.member_details.studentId}</p>`;
                    } else if (data.user.userType === 'Faculty') {
                        memberDetails.innerHTML += `<p>Name: ${data.member_details.facultyName}</p><p>Email: ${data.user.userName}</p><p>Student ID: ${data.member_details.facultyId}</p>`;
                    }
                }
                confirmationSection.style.display = 'block';
                location.reload();
            })
            .catch(error => {
                document.getElementById('successMessageRm').innerText = 'Incorrect UserId';
                document.getElementById('successMessageRm').style.display = 'block';
            });

    });

    document.getElementById('confirmBtn').addEventListener('click', function () {
        // Assuming memberIDToRemove is the ID of the member to be removed
        const memberIDToRemove = document.getElementById('memberIDToRemove').value;
        // Send a POST request to the Flask endpoint to remove the member
        fetch('/remove_member', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: memberIDToRemove})
        })
            .then(response => {
                if (response.ok) {
                    // Hide the confirmation section
                    document.getElementById('confirmationSection').style.display = 'none';
                    // Show success message
                    document.getElementById('successMessageRm').innerText = 'Member removed successfully.';

                    document.getElementById('successMessageRm').style.display = 'block';
                } else {
                    throw new Error('Failed to remove member');
                }
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                // You can display an error message to the user here
                document.getElementById('successMessageRm').innerText = 'Failed to remove member. Please try again later.';

                document.getElementById('successMessageRm').style.display = 'block';
            });
    });


    document.getElementById('cancelBtn').addEventListener('click', function () {
        confirmationSection.style.display = 'none'; // Hide the confirmation section
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const addSubjectForm = document.getElementById('AddSubjectForm');
    const confirmationSection = document.getElementById('confirmationSectionAs');
    const subjectDetails = document.getElementById('subjectDetails');
    const successMessage = document.getElementById('successMessageAs');
    const facultyAttendancePercentage = document.getElementById('facultyAttendancePercentage');

    addSubjectForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const userID = document.getElementById('AddSubjectID').value;
        const subjectName = document.getElementById('subjectName').value;

        fetch(`/get_member_details?userId=${userID}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch user details');
                }
            })
            .then(data => {
                    console.log(data);
                    subjectDetails.innerHTML = ``;
                    if (data.member_details) {
                        // Additional member details based on member type (student or faculty)
                        if (data.user.userType === 'Student') {
                            subjectDetails.innerHTML += `<p>Name: ${data.member_details.studentName}</p><p>Email: ${data.user.userName}</p><p>Student ID: ${data.member_details.studentId}</p>`;
                        } else if (data.user.userType === 'Faculty') {
                            const attendancePercentage = prompt('Enter attendance percentage for the subject:');
                            if (attendancePercentage) {
                                facultyAttendancePercentage.value = attendancePercentage;
                                confirmationSection.style.display = 'block';
                                subjectDetails.innerHTML += `<p>Name: ${data.member_details.facultyName}</p><p>Email: ${data.user.userName}</p><p>Percentage: ${attendancePercentage}%</p>`;
                            }
                        }
                    }
                    confirmationSection.style.display = 'block';
                }
            )
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                // You can display an error message to the user here
            });
    });

    document.getElementById('confirmBtnAs').addEventListener('click', function () {
        // Gather the form data
        const userID = document.getElementById('AddSubjectID').value;
        const subjectName = document.getElementById('subjectName').value;
        const attendancePercentage = facultyAttendancePercentage.value;

        // Send a POST request to add the subject
        fetch('/add_subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userID,
                subject_name: subjectName,
                attendance_percentage: attendancePercentage
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add subject');
                }
            })
            .then(data => {
                successMessage.innerText = 'Subject added successfully!';
                successMessage.style.display = 'block';
                location.reload();
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                // You can display an error message to the user here
            });
    });

    document.getElementById('cancelBtnAs').addEventListener('click', function () {
        confirmationSection.style.display = 'none'; // Hide the confirmation section
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const removeSubjectForm = document.getElementById('RemoveSubjectForm');
    const removeSubjectUserId = document.getElementById('removeSubjectUserId');
    const removeSubjectName = document.getElementById('removeSubjectName');

    removeSubjectUserId.addEventListener('change', function () {
        const userId = removeSubjectUserId.value;
        // Fetch subjects corresponding to the selected user ID
        fetch(`/get_subjects?userId=${userId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch subjects');
                }
            })
            .then(data => {
                // Clear existing options
                removeSubjectName.innerHTML = '';
                // Populate dropdown with fetched subjects
                data.subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject;
                    option.textContent = subject;
                    removeSubjectName.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // You can display an error message to the user here
            });
    });

    removeSubjectForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const userId = removeSubjectUserId.value;
        const subjectName = removeSubjectName.value;

        // Send a POST request to remove the subject
        fetch('/remove_subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, subjectName })
        })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    console.log('Subject removed successfully');
                    removeSubjectForm.reset();
                    location.reload();
                } else {
                    throw new Error('Failed to remove subject');
                }
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                // You can display an error message to the user here
            });
    });
});


