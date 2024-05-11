document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Here you can add your login functionality
    // For demonstration purposes, let's just log the input values
    console.log("Username:", username);
    console.log("Password:", password);
  });
