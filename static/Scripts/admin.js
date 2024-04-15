document.addEventListener('DOMContentLoaded', function () {


    // Add event listener to the add member form
    document.getElementById('addMemberForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve form data
        const memberType = document.getElementById('memberType').value;
        const userName = document.getElementById('userName').value;
        const passwd = document.getElementById('passwd').value;

        // Do something with the form data, like sending it to the server
        console.log('Member Type:', memberType);
        console.log('UserName:', userName);
        console.log('Password:', passwd);

        // Clear the form fields after submission
        document.getElementById('userName').value = '';
        document.getElementById('passwd').value = '';
    });

    // Add event listener to the remove member form
    document.getElementById('removeMemberForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve form data
        const memberIDToRemove = document.getElementById('memberIDToRemove').value;

        // Do something with the form data, like sending it to the server
        console.log('Member ID to Remove:', memberIDToRemove);

        // Clear the form field after submission
        document.getElementById('memberIDToRemove').value = '';
    });

    // Get the user ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get('userID');

});
