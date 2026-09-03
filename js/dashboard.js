// =========================================
// EMPLOYEE MANAGEMENT JAVASCRIPT
// =========================================


// ---------- OPEN FORM ----------

function openEmployeeForm() {

    const form = document.getElementById("employeeForm");

    if (form) {
        form.style.display = "block";
    }

}


// ---------- CLOSE FORM ----------

function closeEmployeeForm() {

    const form = document.getElementById("employeeForm");

    if (form) {
        form.style.display = "none";
    }

}


// ---------- ADD EMPLOYEE ----------

function addEmployee(event) {

    event.preventDefault();


    // Get values

    const name =
        document.getElementById("employeeName").value.trim();

    const email =
        document.getElementById("employeeEmail").value.trim();

    const department =
        document.getElementById("employeeDepartment").value;

    const position =
        document.getElementById("employeePosition").value.trim();


    // Basic validation

    if (
        name === "" ||
        email === "" ||
        department === "" ||
        position === ""
    ) {

        alert("Please fill all employee details.");

        return;
    }


    // Get table

    const tableBody =
        document.getElementById("employeeTableBody");


    // Create Employee ID

    const id =
        "EMP" +
        String(tableBody.rows.length + 1)
            .padStart(3, "0");


    // Create initials

    const initials =
        name
            .split(" ")
            .filter(word => word.length > 0)
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();


    // Create new row

    const row =
        tableBody.insertRow();


    row.innerHTML = `

        <td>

            <span class="employee-id">
                ${id}
            </span>

        </td>


        <td>

            <div class="employee-info">

                <div class="employee-avatar">
                    ${initials}
                </div>

                <span>
                    ${name}
                </span>

            </div>

        </td>


        <td>
            ${email}
        </td>


        <td>

            <span class="department">
                ${department}
            </span>

        </td>


        <td>
            ${position}
        </td>


        <td>

            <button
                class="delete-btn"
                onclick="deleteEmployee(this)">

                Delete

            </button>

        </td>

    `;


    // Reset form

    document
        .getElementById("employeeFormData")
        .reset();


    // Close form

    closeEmployeeForm();

}


// ---------- DELETE EMPLOYEE ----------

function deleteEmployee(button) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (confirmation) {

        const row =
            button.closest("tr");

        if (row) {
            row.remove();
        }

    }

}


// ---------- SEARCH EMPLOYEE ----------

function searchEmployee() {

    const searchInput =
        document.getElementById("employeeSearch");


    const tableBody =
        document.getElementById("employeeTableBody");


    if (!searchInput || !tableBody) {
        return;
    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const rows =
        tableBody.getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        const rowText =
            rows[i]
                .textContent
                .toLowerCase();


        if (rowText.includes(search)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}