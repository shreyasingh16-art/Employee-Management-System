document.addEventListener("DOMContentLoaded", function () {
    const departmentForm = document.getElementById("departmentForm");
    const departmentTableBody = document.getElementById("departmentTableBody");
    const departmentName = document.getElementById("departmentName");
    const departmentHead = document.getElementById("departmentHead");
    const departmentDescription = document.getElementById("departmentDescription");

    if (!departmentForm || !departmentTableBody) return;

    let departmentCount = departmentTableBody.querySelectorAll("tr").length;
    let editingRow = null;

    departmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = departmentName.value.trim();
        const head = departmentHead.value.trim();
        const description = departmentDescription.value.trim();

        if (!name || !head || !description) {
            alert("Please fill all department details.");
            return;
        }

        const existingRows = Array.from(departmentTableBody.querySelectorAll("tr"));

        const duplicate = existingRows.some(function (row) {
            return row !== editingRow &&
                row.cells[1].textContent.toLowerCase() === name.toLowerCase();
        });

        if (duplicate) {
            alert("This department already exists.");
            return;
        }

        if (editingRow) {
            editingRow.cells[1].textContent = name;
            editingRow.cells[2].textContent = head;
            editingRow.cells[3].textContent = description;
            editingRow = null;
            departmentForm.querySelector("button[type='submit']").textContent = "Add Department";
        } else {
            departmentCount++;

            const row = document.createElement("tr");
            const departmentId = "DEP" + String(departmentCount).padStart(3, "0");

            [departmentId, name, head, description].forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const actionContainer = document.createElement("div");
            actionContainer.className = "department-action";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            actionContainer.append(editButton, deleteButton);
            actionCell.appendChild(actionContainer);
            row.appendChild(actionCell);

            editButton.addEventListener("click", function () {
                editingRow = row;
                departmentName.value = row.cells[1].textContent;
                departmentHead.value = row.cells[2].textContent;
                departmentDescription.value = row.cells[3].textContent;
                departmentForm.querySelector("button[type='submit']").textContent = "Update Department";
                departmentForm.scrollIntoView({ behavior: "smooth" });
            });

            deleteButton.addEventListener("click", function () {
                if (confirm("Are you sure you want to delete this department?")) {
                    if (editingRow === row) {
                        editingRow = null;
                        departmentForm.reset();
                        departmentForm.querySelector("button[type='submit']").textContent = "Add Department";
                    }
                    row.remove();
                }
            });

            departmentTableBody.appendChild(row);
        }

        departmentForm.reset();
    });

    departmentTableBody.querySelectorAll("tr").forEach(function (row) {
        const actionCell = row.cells[4];

        if (actionCell && actionCell.textContent.trim() === "Default") {
            actionCell.textContent = "";

            const actionContainer = document.createElement("div");
            actionContainer.className = "department-action";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            actionContainer.append(editButton, deleteButton);
            actionCell.appendChild(actionContainer);

            editButton.addEventListener("click", function () {
                editingRow = row;
                departmentName.value = row.cells[1].textContent;
                departmentHead.value = row.cells[2].textContent;
                departmentDescription.value = row.cells[3].textContent;
                departmentForm.querySelector("button[type='submit']").textContent = "Update Department";
                departmentForm.scrollIntoView({ behavior: "smooth" });
            });

            deleteButton.addEventListener("click", function () {
                if (confirm("Are you sure you want to delete this department?")) {
                    row.remove();
                }
            });
        }
    });
});
