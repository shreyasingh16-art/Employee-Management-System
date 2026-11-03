document.addEventListener("DOMContentLoaded", function () {

    const employeeForm = document.getElementById("employeeFormData");
    const employeeTableBody =
        document.getElementById("employeeTableBody");
    const employeeSearch =
        document.getElementById("employeeSearch");

    // Add employee
    if (employeeForm) {
        employeeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name =
                document.getElementById("employeeName").value.trim();

            const email =
                document.getElementById("employeeEmail").value.trim();

            const department =
                document.getElementById("employeeDepartment").value.trim();

            const position =
                document.getElementById("employeePosition").value.trim();

            const joiningDate =
                document.getElementById("employeeDate").value;

            const phone =
                document.getElementById("employeePhone").value.trim();

            if (
                name === "" ||
                email === "" ||
                department === "" ||
                position === "" ||
                joiningDate === "" ||
                phone === ""
            ) {
                alert("Please fill all employee details.");
                return;
            }

            const employeeCount =
                employeeTableBody
                    ? employeeTableBody.querySelectorAll("tr").length + 1
                    : 1;

            const employeeId =
                "EMP" + String(employeeCount).padStart(3, "0");

            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="employee-id">${employeeId}</td>
                <td>
                    <div class="employee-info">
                        <div class="employee-avatar">
                            ${name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>${name}</strong>
                            <span>${email}</span>
                        </div>
                    </div>
                </td>
                <td class="department">${department}</td>
                <td>${position}</td>
                <td>${joiningDate}</td>
                <td>${phone}</td>
                <td>
                    <button class="edit-btn" type="button">
                        Edit
                    </button>
                    <button class="delete-btn" type="button">
                        Delete
                    </button>
                </td>
            `;

            if (employeeTableBody) {
                employeeTableBody.insertBefore(
                    row,
                    employeeTableBody.firstChild
                );
            }

            alert("Employee added successfully!");

            employeeForm.reset();

            const employeeFormBox =
                document.getElementById("employeeForm");

            if (employeeFormBox) {
                employeeFormBox.style.display = "none";
            }
        });
    }

    // Search employees
    if (employeeSearch) {
        employeeSearch.addEventListener("input", function () {

            const searchText =
                employeeSearch.value.toLowerCase().trim();

            const rows =
                employeeTableBody
                    ? employeeTableBody.querySelectorAll("tr")
                    : [];

            rows.forEach(function (row) {

                const rowText =
                    row.textContent.toLowerCase();

                if (rowText.includes(searchText)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // Delete employee
    if (employeeTableBody) {
        employeeTableBody.addEventListener("click", function (event) {

            if (event.target.classList.contains("delete-btn")) {

                const confirmDelete =
                    confirm("Are you sure you want to delete this employee?");

                if (confirmDelete) {
                    const row =
                        event.target.closest("tr");

                    if (row) {
                        row.remove();
                    }
                }
            }
        });
    }

});