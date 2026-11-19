document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username === "" || password === "") {
            alert("Please enter username and password.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Invalid username or password.");
                return;
            }

            sessionStorage.setItem("loggedInUser", data.username);
            sessionStorage.setItem("userRole", data.role);

            alert("Login successful!");

           const redirectPage = sessionStorage.getItem("redirectAfterLogin") || "dashboard.html";

            sessionStorage.removeItem("redirectAfterLogin");

            window.location.href = redirectPage;
        } catch (error) {
            alert("Backend connection failed. Please start the backend server.");
        }

    });

});
