document.addEventListener("DOMContentLoaded", function () {

    const leaveForm = document.getElementById("leaveForm");
    const leaveTableBody =
        document.getElementById("leaveTableBody");

    if (!leaveForm) {
        return;
    }

    const employees = {
        "EMP001": "Rishabh Sharma",
        "EMP002": "Priya Yadav",
        "EMP003": "Shreya Singh"
    };

    // Set minimum date
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    if (fromDate) {
        fromDate.min = todayDate;
    }

    if (toDate) {
        toDate.min = todayDate;
    }

    // Keep To Date after From Date
    if (fromDate && toDate) {
        fromDate.addEventListener("change", function () {
            toDate.min = fromDate.value;

            if (toDate.value && toDate.value < fromDate.value) {
                toDate.value = fromDate.value;
            }
        });
    }

    // Submit leave request
    leaveForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const employee =
            document.getElementById("leaveEmployee").value;

        const leaveType =
            document.getElementById("leaveType").value;

        const from =
            document.getElementById("fromDate").value;

        const to =
            document.getElementById("toDate").value;

        const reason =
            document.getElementById("leaveReason").value.trim();

        if (
            employee === "" ||
            leaveType === "" ||
            from === "" ||
            to === "" ||
            reason === ""
        ) {
            alert("Please fill all leave details.");
            return;
        }

        if (to < from) {
            alert("To Date cannot be earlier than From Date.");
            return;
        }

        const employeeName =
            employees[employee] || "Unknown Employee";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee}</td>
            <td>${employeeName}</td>
            <td>${leaveType}</td>
            <td>${from}</td>
            <td>${to}</td>
            <td>${reason}</td>
            <td>
                <span class="leave-status status-pending">
                    Pending
                </span>
            </td>
        `;

        if (leaveTableBody) {
            leaveTableBody.insertBefore(
                row,
                leaveTableBody.firstChild
            );
        }

        alert("Leave request submitted successfully!");

        leaveForm.reset();

        if (fromDate) {
            fromDate.min = todayDate;
        }

        if (toDate) {
            toDate.min = todayDate;
        }
    });

});