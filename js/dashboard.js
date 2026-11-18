document.addEventListener("DOMContentLoaded", function () {
    const currentDate = document.getElementById("currentDate");

    const today = new Date();
    const todayDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (currentDate) {
        currentDate.textContent = today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    function getData(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function percentage(value, total) {
        return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    }

    function updateProgress(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.style.width = `${Math.min(value, 100)}%`;
        }
    }

    function updateDashboard() {
        const employees = getData("emplyraEmployees");
        const attendance = getData("emplyraAttendance");
        const leaves = getData("emplyraLeaves");

        const totalEmployees = employees.length;

        const todayAttendance = attendance.filter(function (record) {
            return record.date === todayDate;
        });

        const attendanceMap = new Map();

        todayAttendance.forEach(function (record) {
            attendanceMap.set(record.employeeId, record.status.toLowerCase());
        });

        const onLeave = new Set();

        leaves.forEach(function (leave) {
            if (
                leave.status.toLowerCase() === "approved" &&
                leave.fromDate <= todayDate &&
                leave.toDate >= todayDate
            ) {
                onLeave.add(leave.employeeId);
            }
        });

        todayAttendance.forEach(function (record) {
            if (record.status.toLowerCase() === "leave") {
                onLeave.add(record.employeeId);
            }
        });

        const present = employees.filter(function (employee) {
            return attendanceMap.get(employee.id) === "present" &&
                !onLeave.has(employee.id);
        }).length;

        const absent = employees.filter(function (employee) {
            return attendanceMap.get(employee.id) === "absent" &&
                !onLeave.has(employee.id);
        }).length;

        const leaveCount = onLeave.size;

        const presentPercent = percentage(present, totalEmployees);
        const absentPercent = percentage(absent, totalEmployees);
        const leavePercent = percentage(leaveCount, totalEmployees);

        setText("totalEmployee", totalEmployees);
        setText("presentEmployee", present);
        setText("absentEmployee", absent);
        setText("leaveEmployee", leaveCount);

        setText("presentPercentage", `${presentPercent}% attendance`);
        setText("absentPercentage", `${absentPercent}% of employees`);
        setText("leavePercentage", `${leavePercent}% of employees`);

        setText("attendancePresent", `${presentPercent}%`);
        setText("attendanceAbsent", `${absentPercent}%`);
        setText("attendanceLeave", `${leavePercent}%`);

        updateProgress("presentProgress", Number(presentPercent));
        updateProgress("absentProgress", Number(absentPercent));
        updateProgress("leaveProgress", Number(leavePercent));

        updateRecentEmployees(employees);
    }

    function updateRecentEmployees(employees) {
        const tableBody = document.getElementById("recentEmployeesTable");

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        const recentEmployees = [...employees]
            .sort(function (a, b) {
                return (b.joiningDate || "").localeCompare(a.joiningDate || "");
            })
            .slice(0, 5);

        if (recentEmployees.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No employees found.";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        recentEmployees.forEach(function (employee) {
            const row = document.createElement("tr");

            const employeeCell = document.createElement("td");
            const employeeInfo = document.createElement("div");
            const avatar = document.createElement("div");
            const details = document.createElement("div");
            const name = document.createElement("strong");
            const employeeId = document.createElement("small");

            employeeInfo.className = "employee-info";
            avatar.className = "employee-avatar";

            avatar.textContent = employee.name
                .split(" ")
                .filter(Boolean)
                .map(part => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("");

            name.textContent = employee.name;
            employeeId.textContent = employee.id;

            details.appendChild(name);
            details.appendChild(employeeId);
            employeeInfo.appendChild(avatar);
            employeeInfo.appendChild(details);
            employeeCell.appendChild(employeeInfo);

            const departmentCell = document.createElement("td");
            departmentCell.textContent = employee.department || "-";

            const positionCell = document.createElement("td");
            positionCell.textContent = employee.position || "-";

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = "employee-status active-status";
            statusBadge.textContent = "Active";

            statusCell.appendChild(statusBadge);

            row.appendChild(employeeCell);
            row.appendChild(departmentCell);
            row.appendChild(positionCell);
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
    }

    updateDashboard();
});
