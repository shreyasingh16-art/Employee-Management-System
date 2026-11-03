document.addEventListener("DOMContentLoaded", function () {

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        const today = new Date();

        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric"
        };

        currentDate.textContent = today.toLocaleDateString(
            "en-IN",
            options
        );
    }

});