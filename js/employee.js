document.addEventListener("DOMContentLoaded", function () {
    const employeeForm = document.getElementById("employeeFormData");
    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeSearch = document.getElementById("employeeSearch");
    const employeeFormBox = document.getElementById("employeeForm");
    const departmentSelect = document.getElementById("employeeDepartment");

    const departmentForm = document.getElementById("departmentForm");
    const departmentTableBody = document.getElementById("departmentTableBody");
    const departmentSection = document.getElementById("departmentSection");
    const departmentSaveBtn = document.getElementById("departmentSaveBtn");

    let editingRow = null;
    let editingDepartmentRow = null;
    let employeeCount = 0;
    let departmentCount = 0;

    let departments = [];

    try {
        departments = JSON.parse(localStorage.getItem("emplyraDepartments") || "[]");
        if (!Array.isArray(departments)) departments = [];
    } catch {
        departments = [];
    }

    function saveDepartments() {
        localStorage.setItem("emplyraDepartments", JSON.stringify(departments));
    }

    function loadDepartments() {
        if (!departmentSelect) return;

        const selectedValue = departmentSelect.value;

        departmentSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Department";
        departmentSelect.appendChild(defaultOption);

        if (departments.length === 0) {
            ["IT", "HR", "Finance", "Marketing", "Sales"].forEach(function (name) {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                departmentSelect.appendChild(option);
            });
            return;
        }

        departments.forEach(function (department) {
            const option = document.createElement("option");
            option.value = department.name;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });

        departmentSelect.value = selectedValue;
    }

    function renderDepartments() {
        if (!departmentTableBody) return;

        departmentTableBody.innerHTML = "";

        if (departments.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.className = "employee-empty";
            cell.textContent = "No departments added yet.";

            row.appendChild(cell);
            departmentTableBody.appendChild(row);
            return;
        }

        departments.forEach(function (department) {
            const row = document.createElement("tr");
            row.dataset.id = department.id;

            const idCell = document.createElement("td");
            idCell.className = "employee-id";
            idCell.textContent = department.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = department.name;

            const headCell = document.createElement("td");
            headCell.textContent = department.head;

            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = department.description || "-";

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            actionCell.append(editButton, deleteButton);

            row.append(
                idCell,
                nameCell,
                headCell,
                descriptionCell,
                actionCell
            );

            departmentTableBody.appendChild(row);
        });
    }

    function resetDepartmentForm() {
        if (!departmentForm) return;

        departmentForm.reset();
        editingDepartmentRow = null;

        if (departmentSaveBtn) {
            departmentSaveBtn.textContent = "Save Department";
        }
    }

    loadDepartments();
    renderDepartments();

    window.toggleDepartmentSection = function () {
        if (!departmentSection) return;

        const isHidden = departmentSection.style.display === "none";

        departmentSection.style.display = isHidden ? "block" : "none";

        if (isHidden) {
            departmentSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    window.openEmployeeForm = function () {
        if (!employeeFormBox) return;

        employeeFormBox.classList.add("active");
        loadDepartments();
    };

    window.closeEmployeeForm = function () {
        if (!employeeFormBox || !employeeForm) return;

        employeeFormBox.classList.remove("active");
        employeeForm.reset();
        editingRow = null;
    };

    if (employeeForm) {
        employeeForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("employeeName").value.trim();
            const email = document.getElementById("employeeEmail").value.trim();
            const department = departmentSelect.value;
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

                const idCell = document.createElement("td");
                idCell.className = "employee-id";
                idCell.textContent = employeeId;

                const nameCell = document.createElement("td");
                const nameElement = document.createElement("strong");
                nameElement.className = "employee-name";
                nameElement.textContent = name;
                nameCell.appendChild(nameElement);

                const emailCell = document.createElement("td");
                emailCell.className = "employee-email";
                emailCell.textContent = email;

                const departmentCell = document.createElement("td");
                const departmentElement = document.createElement("span");
                departmentElement.className = "department employee-department";
                departmentElement.textContent = department;
                departmentCell.appendChild(departmentElement);

                const positionCell = document.createElement("td");
                positionCell.className = "employee-position";
                positionCell.textContent = position;

                const dateCell = document.createElement("td");
                dateCell.className = "employee-date";
                dateCell.textContent = joiningDate;

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "edit-btn";
                editButton.textContent = "Edit";

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "delete-btn";
                deleteButton.textContent = "Delete";

                actionCell.append(editButton, deleteButton);

                row.append(
                    idCell,
                    nameCell,
                    emailCell,
                    departmentCell,
                    positionCell,
                    dateCell,
                    actionCell
                );

                employeeTableBody.insertBefore(row, employeeTableBody.firstChild);

                alert("Employee added successfully!");
            }

            employeeForm.reset();
            editingRow = null;
            employeeFormBox.classList.remove("active");
        });
    }

    window.searchEmployee = function () {
        if (!employeeSearch || !employeeTableBody) return;

        const searchText = employeeSearch.value.toLowerCase().trim();

        employeeTableBody.querySelectorAll("tr").forEach(function (row) {
            row.style.display = row.textContent.toLowerCase().includes(searchText) ? "" : "none";
        });
    };

    if (employeeTableBody) {
        employeeTableBody.addEventListener("click", function (event) {
            const row = event.target.closest("tr");

            if (!row) return;

            if (event.target.classList.contains("edit-btn")) {
                editingRow = row;

                loadDepartments();

                document.getElementById("employeeName").value = row.querySelector(".employee-name").textContent;
                document.getElementById("employeeEmail").value = row.querySelector(".employee-email").textContent;
                departmentSelect.value = row.querySelector(".employee-department").textContent.trim();
                document.getElementById("employeePosition").value = row.querySelector(".employee-position").textContent;
                document.getElementById("employeeDate").value = row.querySelector(".employee-date").textContent;
                document.getElementById("employeePhone").value = row.dataset.phone || "";

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
    }

    if (departmentForm) {
        departmentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("departmentName").value.trim();
            const head = document.getElementById("departmentHead").value.trim();
            const description = document.getElementById("departmentDescription").value.trim();

            if (!name || !head) {
                alert("Please enter department name and department head.");
                return;
            }

            const duplicate = departments.some(function (department) {
                return department.name.toLowerCase() === name.toLowerCase() &&
                    department !== editingDepartmentRow;
            });

            if (duplicate) {
                alert("This department already exists.");
                return;
            }

            if (editingDepartmentRow) {
                const oldName = editingDepartmentRow.name;

                editingDepartmentRow.name = name;
                editingDepartmentRow.head = head;
                editingDepartmentRow.description = description;

                if (employeeTableBody && oldName !== name) {
                    employeeTableBody.querySelectorAll("tr").forEach(function (row) {
                        const departmentCell = row.querySelector(".employee-department");

                        if (departmentCell && departmentCell.textContent.trim() === oldName) {
                            departmentCell.textContent = name;
                        }
                    });
                }

                alert("Department updated successfully!");
            } else {
                departmentCount++;

                const departmentId = "DEP" + String(departmentCount).padStart(3, "0");

                departments.push({
                    id: departmentId,
                    name: name,
                    head: head,
                    description: description
                });

                alert("Department added successfully!");
            }

            saveDepartments();
            renderDepartments();
            loadDepartments();
            resetDepartmentForm();
        });
    }

    if (departmentForm) {
        departmentForm.addEventListener("reset", function () {
            editingDepartmentRow = null;

            if (departmentSaveBtn) {
                departmentSaveBtn.textContent = "Save Department";
            }
        });
    }

    if (departmentTableBody) {
        departmentTableBody.addEventListener("click", function (event) {
            const row = event.target.closest("tr");

            if (!row) return;

            const department = departments.find(function (item) {
                return item.id === row.dataset.id;
            });

            if (!department) return;

            if (event.target.classList.contains("edit-btn")) {
                editingDepartmentRow = department;

                document.getElementById("departmentName").value = department.name;
                document.getElementById("departmentHead").value = department.head;
                document.getElementById("departmentDescription").value = department.description || "";

                if (departmentSaveBtn) {
                    departmentSaveBtn.textContent = "Update Department";
                }

                departmentForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            if (event.target.classList.contains("delete-btn")) {
                const confirmed = confirm("Are you sure you want to delete this department?");

                if (confirmed) {
                    departments = departments.filter(function (item) {
                        return item.id !== department.id;
                    });

                    saveDepartments();
                    renderDepartments();
                    loadDepartments();

                    if (editingDepartmentRow === department) {
                        resetDepartmentForm();
                    }

                    alert("Department deleted successfully!");
                }
            }
        });
    }
});
