if (!sessionStorage.getItem("loggedInUser")) {
    sessionStorage.setItem("redirectAfterLogin", "employee.html");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            sessionStorage.removeItem("loggedInUser");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("redirectAfterLogin");

            window.location.href = "login.html";
        });
    }

    const employeeForm = document.getElementById("employeeFormData");
    const employeeFormBox = document.getElementById("employeeForm");
    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeSearch = document.getElementById("employeeSearch");
    const departmentSelect = document.getElementById("employeeDepartment");

    const departmentForm = document.getElementById("departmentForm");
    const departmentTableBody = document.getElementById("departmentTableBody");
    const departmentSection = document.getElementById("departmentSection");
    const departmentSaveBtn = document.getElementById("departmentSaveBtn");

    if (!employeeForm || !employeeFormBox || !employeeTableBody || !departmentSelect) {
        console.error("Employee HTML elements are missing.");
        return;
    }

    function getData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            alert("Unable to save data in browser storage.");
            return false;
        }
    }

    let employees = [];
    let departments = getData("emplyraDepartments");

    let editingEmployeeId = null;
    let editingDepartmentId = null;

    const defaultDepartments = [
        ["IT", "Not Assigned", "Information Technology"],
        ["HR", "Not Assigned", "Human Resources"],
        ["Finance", "Not Assigned", "Financial planning and accounts"],
        ["Marketing", "Not Assigned", "Marketing and promotion"],
        ["Sales", "Not Assigned", "Sales and customer relations"]
    ];

    function generateId(prefix, list) {
        let highest = 0;

        list.forEach(function (item) {
            const match = String(item.id || "").match(
                new RegExp("^" + prefix + "(\\d+)$")
            );

            if (match) {
                highest = Math.max(highest, Number(match[1]));
            }
        });

        return prefix + String(highest + 1).padStart(3, "0");
    }

    departments = departments.filter(item => item && typeof item === "object");

    departments = departments.map(function (department) {
        return {
            id: department.id || generateId("DEP", departments),
            name: department.name || "",
            head: department.head || "Not Assigned",
            description: department.description || ""
        };
    });

    defaultDepartments.forEach(function (item) {
        const exists = departments.some(department =>
            department.name.toLowerCase() === item[0].toLowerCase()
        );

        if (!exists) {
            departments.push({
                id: generateId("DEP", departments),
                name: item[0],
                head: item[1],
                description: item[2]
            });
        }
    });

    saveData("emplyraDepartments", departments);

    function createCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value || "-";
        return cell;
    }

    function createButton(text, action, className) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.className = className;
        button.dataset.action = action;
        return button;
    }

    function loadDepartments(selected = "") {
        departmentSelect.innerHTML = "";

        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "Select Department";
        departmentSelect.appendChild(firstOption);

        departments.forEach(function (department) {
            const option = document.createElement("option");
            option.value = department.name;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });

        if (selected && !departments.some(item => item.name === selected)) {
            const option = document.createElement("option");
            option.value = selected;
            option.textContent = selected;
            departmentSelect.appendChild(option);
        }

        departmentSelect.value = selected;
    }

    function renderEmployees() {
        employeeTableBody.innerHTML = "";

        if (employees.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No employees added yet.");
            cell.colSpan = 7;
            cell.className = "employee-empty";
            row.appendChild(cell);
            employeeTableBody.appendChild(row);
            return;
        }

        employees.forEach(function (employee) {
            const row = document.createElement("tr");
            row.dataset.id = String(employee.id);

            const nameCell = createCell(employee.name);
            const nameText = document.createElement("strong");
            nameText.className = "employee-info";
            nameText.textContent = employee.name || "-";
            nameCell.textContent = "";
            nameCell.appendChild(nameText);

            const departmentCell = createCell("");
            const departmentLabel = document.createElement("span");
            departmentLabel.className = "department";
            departmentLabel.textContent = employee.department || "-";
            departmentCell.appendChild(departmentLabel);

            const actionCell = createCell("");
            actionCell.append(
                createButton("Edit", "edit", "edit-btn"),
                createButton("Delete", "delete", "delete-btn")
            );

            row.append(
                createCell(employee.id),
                nameCell,
                createCell(employee.email),
                departmentCell,
                createCell(employee.position),
                createCell(employee.joiningDate),
                actionCell
            );

            employeeTableBody.appendChild(row);
        });

        window.searchEmployee();
    }

    function renderDepartments() {
        if (!departmentTableBody) return;

        departmentTableBody.innerHTML = "";

        if (departments.length === 0) {
            const row = document.createElement("tr");
            const cell = createCell("No departments added yet.");
            cell.colSpan = 5;
            cell.className = "employee-empty";
            row.appendChild(cell);
            departmentTableBody.appendChild(row);
            return;
        }

        departments.forEach(function (department) {
            const row = document.createElement("tr");
            row.dataset.id = department.id;

            const actionCell = createCell("");
            actionCell.append(
                createButton("Edit", "edit", "edit-btn"),
                createButton("Delete", "delete", "delete-btn")
            );

            row.append(
                createCell(department.id),
                createCell(department.name),
                createCell(department.head),
                createCell(department.description),
                actionCell
            );

            departmentTableBody.appendChild(row);
        });
    }

    function resetEmployeeForm() {
        employeeForm.reset();
        editingEmployeeId = null;
        loadDepartments();

        const heading = employeeFormBox.querySelector(".form-title h2");

        if (heading) {
            heading.textContent = "Add New Employee";
        }
    }

    function resetDepartmentForm() {
        if (!departmentForm) return;

        departmentForm.reset();
        editingDepartmentId = null;

        if (departmentSaveBtn) {
            departmentSaveBtn.textContent = "Save Department";
        }
    }

    function refreshAll() {
        renderEmployees();
        renderDepartments();
        loadDepartments();
    }

    async function loadEmployees() {
        try {
            employees = await getEmployees();
            renderEmployees();
        } catch (error) {
            console.error("Unable to load employees:", error);
            alert("Employees could not be loaded. Please check whether the backend is running.");
        }
    }

    window.openEmployeeForm = function () {
        resetEmployeeForm();
        employeeFormBox.classList.add("active");

        employeeFormBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    window.closeEmployeeForm = function () {
        employeeFormBox.classList.remove("active");
        resetEmployeeForm();
    };

    window.toggleDepartmentSection = function () {
        if (!departmentSection) return;

        const hidden = getComputedStyle(departmentSection).display === "none";
        departmentSection.style.display = hidden ? "block" : "none";

        if (hidden) {
            departmentSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    window.searchEmployee = function () {
        if (!employeeSearch) return;

        const search = employeeSearch.value.toLowerCase().trim();

        employeeTableBody.querySelectorAll("tr").forEach(function (row) {
            row.style.display = row.textContent.toLowerCase().includes(search) ? "" : "none";
        });
    };

    employeeForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const employee = {
            name: document.getElementById("employeeName").value.trim(),
            email: document.getElementById("employeeEmail").value.trim(),
            department: departmentSelect.value,
            position: document.getElementById("employeePosition").value.trim(),
            joiningDate: document.getElementById("employeeDate").value,
            phone: document.getElementById("employeePhone").value.trim()
        };

        if (Object.values(employee).some(value => !value)) {
            alert("Please fill all employee details.");
            return;
        }

        try {
            if (editingEmployeeId !== null) {
                await updateEmployee(editingEmployeeId, employee);
                alert("Employee updated successfully!");
            } else {
                await addEmployee(employee);
                alert("Employee added successfully!");
            }

            employeeFormBox.classList.remove("active");
            resetEmployeeForm();
            await loadEmployees();
        } catch (error) {
            console.error("Employee save error:", error);
            alert("Employee could not be saved. Please check the details and backend.");
        }
    });

    employeeTableBody.addEventListener("click", async function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const row = button.closest("tr");

        if (!row) return;

        const employee = employees.find(
            item => String(item.id) === row.dataset.id
        );

        if (!employee) return;

        if (button.dataset.action === "edit") {
            editingEmployeeId = employee.id;

            document.getElementById("employeeName").value = employee.name || "";
            document.getElementById("employeeEmail").value = employee.email || "";
            document.getElementById("employeePosition").value = employee.position || "";
            document.getElementById("employeeDate").value = employee.joiningDate || "";
            document.getElementById("employeePhone").value = employee.phone || "";

            loadDepartments(employee.department || "");

            employeeFormBox.classList.add("active");

            const heading = employeeFormBox.querySelector(".form-title h2");

            if (heading) {
                heading.textContent = "Update Employee";
            }

            employeeFormBox.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (button.dataset.action === "delete") {
            if (!confirm("Are you sure you want to delete this employee?")) return;

            try {
                await deleteEmployee(employee.id);

                if (String(editingEmployeeId) === String(employee.id)) {
                    employeeFormBox.classList.remove("active");
                    resetEmployeeForm();
                }

                await loadEmployees();
                alert("Employee deleted successfully!");
            } catch (error) {
                console.error("Employee delete error:", error);
                alert("Employee could not be deleted. Please try again.");
            }
        }
    });

    if (departmentForm) {
        departmentForm.addEventListener("submit", async function (event) {
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
                    department.id !== editingDepartmentId;
            });

            if (duplicate) {
                alert("This department already exists.");
                return;
            }

            if (editingDepartmentId) {
                const department = departments.find(
                    item => item.id === editingDepartmentId
                );

                if (!department) return;

                const oldName = department.name;
                const assignedEmployees = employees.filter(
                    employee => employee.department === oldName
                );

                try {
                    if (oldName !== name) {
                        await Promise.all(
                            assignedEmployees.map(function (employee) {
                                return updateEmployee(employee.id, {
                                    name: employee.name,
                                    email: employee.email,
                                    department: name,
                                    position: employee.position,
                                    joiningDate: employee.joiningDate,
                                    phone: employee.phone
                                });
                            })
                        );
                    }

                    department.name = name;
                    department.head = head;
                    department.description = description;

                    if (!saveData("emplyraDepartments", departments)) {
                        return;
                    }

                    await loadEmployees();
                    alert("Department updated successfully!");
                } catch (error) {
                    console.error("Department update error:", error);
                    alert("Department could not be updated. Please try again.");
                    return;
                }
            } else {
                departments.push({
                    id: generateId("DEP", departments),
                    name: name,
                    head: head,
                    description: description
                });

                if (!saveData("emplyraDepartments", departments)) {
                    departments.pop();
                    return;
                }

                alert("Department added successfully!");
            }

            resetDepartmentForm();
            refreshAll();
        });

        departmentForm.addEventListener("reset", function () {
            editingDepartmentId = null;

            if (departmentSaveBtn) {
                departmentSaveBtn.textContent = "Save Department";
            }
        });
    }

    if (departmentTableBody) {
        departmentTableBody.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");

            if (!button) return;

            const row = button.closest("tr");

            if (!row) return;

            const department = departments.find(
                item => item.id === row.dataset.id
            );

            if (!department) return;

            if (button.dataset.action === "edit") {
                editingDepartmentId = department.id;

                document.getElementById("departmentName").value = department.name;
                document.getElementById("departmentHead").value = department.head;
                document.getElementById("departmentDescription").value = department.description;

                if (departmentSaveBtn) {
                    departmentSaveBtn.textContent = "Update Department";
                }

                departmentForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            if (button.dataset.action === "delete") {
                const assigned = employees.some(
                    item => item.department === department.name
                );

                if (assigned) {
                    alert("This department has employees assigned. Change their department first.");
                    return;
                }

                if (!confirm("Are you sure you want to delete this department?")) return;

                const oldDepartments = [...departments];
                departments = departments.filter(
                    item => item.id !== department.id
                );

                if (!saveData("emplyraDepartments", departments)) {
                    departments = oldDepartments;
                    return;
                }

                if (editingDepartmentId === department.id) {
                    resetDepartmentForm();
                }

                refreshAll();
                alert("Department deleted successfully!");
            }
        });
    }

    loadDepartments();
    renderDepartments();
    loadEmployees();
});
