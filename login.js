
// function authenticate(){
//   var name = document.getElementById('UserName').value;
//         var password = document.getElementById('Password').value;
//         console.log(name);
//         console.log(password);
//         window.open = 'student/test.html'
// } 

document.addEventListener("DOMContentLoaded", function() {
  // Find the button element
  var button = document.getElementById("loginBtn");

  // Add a click event listener to the button
  button.addEventListener("click", function() {
      // Open a new window
       window.open("student/test.html", "_blank");
      // window.location.href = "student/test.html";
  });
});


// document.addEventListener("DOMContentLoaded", function() {
//   // Find the button element
//   var button = document.getElementById("loginBtn");

//   // Add a click event listener to the button
//   button.addEventListener("click", function(event) {
//       // Prevent the default behavior (page reload)
//       event.preventDefault();

//       // Your custom JavaScript code here
//   });
// });
