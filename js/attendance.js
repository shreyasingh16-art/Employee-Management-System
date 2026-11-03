document.addEventListener("DOMContentLoaded", function () {

    const attendanceForm = document.getElementById("attendanceForm");
    const attendanceDate = document.getElementById("attendanceDate");
    const attendanceTableBody =
        document.getElementById("attendanceTableBody");

    // Set today's date
    if (attendanceDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        attendanceDate.value = `${year}-${month}-${day}`;
    }

    if (!attendanceForm) {
        return;
    }

    // Submit attendance
    attendanceForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const employee =
            document.getElementById("employee").value;

        const date =
            document.getElementById("attendanceDate").value;

        const status =
            document.getElementById("status").value;

        if (employee === "" || date === "" || status === "") {
            alert("Please fill all attendance details.");
            return;
        }

        const employeeNames = {
            "EMP001": "Rishabh Sharma",
            "EMP002": "Priya Yadav",
            "EMP003": "Shreya Singh"
        };

        const employeeName =
            employeeNames[employee] || "Unknown Employee";

        let statusClass = "";

        if (status === "Present") {
            statusClass = "status-present";
        } else if (status === "Absent") {
            statusClass = "status-absent";
        } else if (status === "Leave") {
            statusClass = "status-leave";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee}</td>
            <td>${employeeName}</td>
            <td>${date}</td>
            <td>
                <span class="attendance-status ${statusClass}">
                    ${status}
                </span>
            </td>
        `;

        if (attendanceTableBody) {
            attendanceTableBody.insertBefore(
                row,
                attendanceTableBody.firstChild
            );
        }

        alert("Attendance recorded successfully!");

        attendanceForm.reset();

        // Set today's date again after reset
        if (attendanceDate) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            attendanceDate.value = `${year}-${month}-${day}`;
        }
    });

});