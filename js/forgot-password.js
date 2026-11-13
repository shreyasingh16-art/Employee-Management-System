document.addEventListener("DOMContentLoaded", function () {
    const forgotForm = document.getElementById("forgotForm");
    const emailInput = document.getElementById("email");
    const resetMessage = document.getElementById("resetMessage");

    if (!forgotForm) return;

    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (email === "") {
            resetMessage.textContent = "Please enter your email address.";
            return;
        }

        if (!emailInput.checkValidity()) {
            resetMessage.textContent = "Please enter a valid email address.";
            return;
        }

        resetMessage.textContent = "If an account exists with this email, password reset instructions will be sent.";

        forgotForm.reset();
    });
});
