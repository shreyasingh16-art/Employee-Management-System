function openEmployeeForm() {
    const form = document.getElementById("employeeForm");

    if (form) {
        form.style.display = "block";
    }
}

function closeEmployeeForm() {
    const form = document.getElementById("employeeForm");

    if (form) {
        form.style.display = "none";
    }
}