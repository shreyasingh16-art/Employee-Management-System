document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "" || password === "") {
            alert("Please enter username and password.");
            return;
        }

        window.location.href = "dashboard.html";

    });

});