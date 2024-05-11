document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    var firstName = document.getElementById("first_name").value;
    var lastName = document.getElementById("last_name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Here you can add your sign-up functionality
    var user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    // Check if the user already exists in localStorage
    if (localStorage.getItem(email)) {
      alert(
        "User with this email already exists. Please use a different email."
      );
      return;
    }

    // Store the user data in localStorage
    localStorage.setItem(email, JSON.stringify(user));

    // Display success message
    alert("Account created successfully!");

    // For demonstration purposes, let's just log the input values
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
  });
