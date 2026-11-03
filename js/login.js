document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();


        // Check empty fields

        if (username === "" || password === "") {

            alert("Please enter username and password.");

            return;

        }


        // Temporary frontend login
        // Backend connect hone ke baad yahan API call hogi.

        alert("Login successful!");

        window.location.href = "dashboard.html";

    });

});