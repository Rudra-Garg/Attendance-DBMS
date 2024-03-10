document.getElementById('loginBtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    var username = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;

    // Create an object with username and password
    var data = {
        username: username,
        password: password
    };

    // Send a POST request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse response JSON data
            } else {
                throw new Error('Failed to login');
            }
        })
        .then(data => {
            console.log('Login successful:', data);
            // Check user type and redirect accordingly
            if (data.usertype === 'Student') {
                window.location.href = '/student?userID=' + data.userID; // Redirect to student webpage with userID
            } else if (data.usertype === 'Faculty') {
                window.location.href = '/faculty?userID=' + data.userID;  // Redirect to faculty webpage
            } else {
                console.error('Unknown user type');
                // Handle unknown user type error
            }
        })
        .catch(error => {
            // Handle login error
            console.error('Login failed:', error);
            // Display error message to the user
            if (error.message === 'Invalid username or password') {
                // Display error message for invalid username or password
                // You can use JavaScript to update HTML elements to display the error message
                // For example:
                document.getElementById('errorMessage').innerText = 'Invalid username or password';
            } else {
                // Display generic error message for other errors
                // For example:
                document.getElementById('errorMessage').innerText = 'Failed to login. Please try again later.';
            }
        });
});
