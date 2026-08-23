document.getElementById("loginForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    // Temporary login for testing
    if (username === "admin" && password === "admin123") {

        message.textContent = "Login successful!";
        message.style.color = "green";

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1000);

    } else {

        message.textContent = "Invalid username or password.";
        message.style.color = "red";

    }

});