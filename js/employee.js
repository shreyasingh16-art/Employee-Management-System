document.addEventListener("DOMContentLoaded", function () {

    const employeeForm = document.getElementById("employeeFormData");
    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeSearch = document.getElementById("employeeSearch");
    const employeeFormBox = document.getElementById("employeeForm");

    let editingRow = null;
    let employeeCount = 0;

    window.openEmployeeForm = function () {
        employeeFormBox.classList.add("active");
    };

    window.closeEmployeeForm = function () {
        employeeFormBox.classList.remove("active");
        employeeForm.reset();
        editingRow = null;
    };

    employeeForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("employeeName").value.trim();
        const email = document.getElementById("employeeEmail").value.trim();
        const department = document.getElementById("employeeDepartment").value;
        const position = document.getElementById("employeePosition").value.trim();
        const joiningDate = document.getElementById("employeeDate").value;
        const phone = document.getElementById("employeePhone").value.trim();

        if (!name || !email || !department || !position || !joiningDate || !phone) {
            alert("Please fill all employee details.");
            return;
        }

        if (editingRow) {

            editingRow.querySelector(".employee-name").textContent = name;
            editingRow.querySelector(".employee-email").textContent = email;
            editingRow.querySelector(".employee-department").textContent = department;
            editingRow.querySelector(".employee-position").textContent = position;
            editingRow.querySelector(".employee-date").textContent = joiningDate;
            editingRow.dataset.phone = phone;

            alert("Employee updated successfully!");

        } else {

            employeeCount++;

            const employeeId = "EMP" + String(employeeCount).padStart(3, "0");

            const row = document.createElement("tr");

            row.dataset.phone = phone;

            row.innerHTML = `
                <td class="employee-id">${employeeId}</td>

                <td>
                    <strong class="employee-name">${escapeHTML(name)}</strong>
                </td>

                <td class="employee-email">${escapeHTML(email)}</td>

                <td>
                    <span class="department employee-department">
                        ${escapeHTML(department)}
                    </span>
                </td>

                <td class="employee-position">${escapeHTML(position)}</td>

                <td class="employee-date">${joiningDate}</td>

                <td>
                    <button class="edit-btn" type="button">Edit</button>
                    <button class="delete-btn" type="button">Delete</button>
                </td>
            `;

            employeeTableBody.insertBefore(row, employeeTableBody.firstChild);

            alert("Employee added successfully!");
        }

        employeeForm.reset();
        editingRow = null;
        employeeFormBox.classList.remove("active");

    });

    function escapeHTML(value) {
        return value.replace(/[&<>"']/g, function (char) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[char];
        });
    }

    window.searchEmployee = function () {

        const searchText = employeeSearch.value.toLowerCase().trim();

        employeeTableBody.querySelectorAll("tr").forEach(function (row) {

            row.style.display = row.textContent.toLowerCase().includes(searchText)
                ? ""
                : "none";

        });

    };

    employeeTableBody.addEventListener("click", function (event) {

        const row = event.target.closest("tr");

        if (!row) return;

        if (event.target.classList.contains("edit-btn")) {

            editingRow = row;

            document.getElementById("employeeName").value =
                row.querySelector(".employee-name").textContent;

            document.getElementById("employeeEmail").value =
                row.querySelector(".employee-email").textContent;

            document.getElementById("employeeDepartment").value =
                row.querySelector(".employee-department").textContent.trim();

            document.getElementById("employeePosition").value =
                row.querySelector(".employee-position").textContent;

            document.getElementById("employeeDate").value =
                row.querySelector(".employee-date").textContent;

            document.getElementById("employeePhone").value =
                row.dataset.phone || "";

            employeeFormBox.classList.add("active");

            employeeFormBox.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (event.target.classList.contains("delete-btn")) {

            if (confirm("Are you sure you want to delete this employee?")) {

                if (editingRow === row) {
                    editingRow = null;
                    employeeForm.reset();
                    employeeFormBox.classList.remove("active");
                }

                row.remove();

                alert("Employee deleted successfully!");
            }
        }

    });

});