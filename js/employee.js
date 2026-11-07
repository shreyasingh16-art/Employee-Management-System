document.addEventListener("DOMContentLoaded", function () {

    const employeeForm = document.getElementById("employeeFormData");
    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeSearch = document.getElementById("employeeSearch");
    const employeeFormBox = document.getElementById("employeeForm");

    let employees = [];
    let editingRow = null;
    let employeeCount = 0;

    window.openEmployeeForm = function () {
        employeeFormBox.classList.add("active");
        employeeFormBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    window.closeEmployeeForm = function () {
        employeeFormBox.classList.remove("active");
        employeeForm.reset();
        editingRow = null;
    };

    function generateEmployeeId() {
        employeeCount++;
        return "EMP" + String(employeeCount).padStart(3, "0");
    }

    if (employeeForm) {

        employeeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("employeeName").value.trim();
            const email = document.getElementById("employeeEmail").value.trim();
            const department = document.getElementById("employeeDepartment").value;
            const position = document.getElementById("employeePosition").value.trim();
            const joiningDate = document.getElementById("employeeDate").value;
            const phone = document.getElementById("employeePhone").value.trim();

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

            if (editingRow) {

                editingRow.querySelector(".employee-name").textContent = name;
                editingRow.querySelector(".employee-email").textContent = email;
                editingRow.querySelector(".employee-department").textContent = department;
                editingRow.querySelector(".employee-position").textContent = position;
                editingRow.querySelector(".employee-date").textContent = joiningDate;

                editingRow.querySelector(".employee-id").dataset.phone = phone;

                alert("Employee updated successfully!");

            } else {

                const employeeId = generateEmployeeId();
                const row = document.createElement("tr");

                const idCell = document.createElement("td");
                idCell.className = "employee-id";
                idCell.textContent = employeeId;
                idCell.dataset.phone = phone;

                const nameCell = document.createElement("td");

                const employeeInfo = document.createElement("div");
                employeeInfo.className = "employee-info";

                const nameElement = document.createElement("strong");
                nameElement.className = "employee-name";
                nameElement.textContent = name;

                const emailElement = document.createElement("span");
                emailElement.className = "employee-email";
                emailElement.textContent = email;

                employeeInfo.appendChild(nameElement);
                employeeInfo.appendChild(emailElement);
                nameCell.appendChild(employeeInfo);

                const departmentCell = document.createElement("td");
                departmentCell.className = "employee-department";

                const departmentLabel = document.createElement("span");
                departmentLabel.className = "department";
                departmentLabel.textContent = department;

                departmentCell.appendChild(departmentLabel);

                const positionCell = document.createElement("td");
                positionCell.className = "employee-position";
                positionCell.textContent = position;

                const dateCell = document.createElement("td");
                dateCell.className = "employee-date";
                dateCell.textContent = joiningDate;

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.className = "edit-btn";
                editButton.type = "button";
                editButton.textContent = "Edit";

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";

                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(departmentCell);
                row.appendChild(positionCell);
                row.appendChild(dateCell);
                row.appendChild(actionCell);

                employeeTableBody.insertBefore(
                    row,
                    employeeTableBody.firstChild
                );

                alert("Employee added successfully!");
            }

            employeeForm.reset();
            editingRow = null;
            employeeFormBox.classList.remove("active");

        });
    }

    window.searchEmployee = function () {

        const searchText = employeeSearch.value.toLowerCase().trim();
        const rows = employeeTableBody.querySelectorAll("tr");

        rows.forEach(function (row) {

            const rowText = row.textContent.toLowerCase();

            row.style.display = rowText.includes(searchText) ? "" : "none";

        });
    };

    if (employeeTableBody) {

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
                    row.querySelector(".employee-department").textContent;

                document.getElementById("employeePosition").value =
                    row.querySelector(".employee-position").textContent;

                document.getElementById("employeeDate").value =
                    row.querySelector(".employee-date").textContent;

                document.getElementById("employeePhone").value =
                    row.querySelector(".employee-id").dataset.phone || "";

                employeeFormBox.classList.add("active");

                employeeFormBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            if (event.target.classList.contains("delete-btn")) {

                const confirmDelete = confirm(
                    "Are you sure you want to delete this employee?"
                );

                if (confirmDelete) {

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
    }

});