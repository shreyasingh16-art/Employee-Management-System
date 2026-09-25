document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // CURRENT DATE
    // =========================================

    const currentDateElement = document.getElementById("currentDate");

    if (currentDateElement) {
        const today = new Date();

        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric"
        };

        currentDateElement.textContent =
            today.toLocaleDateString("en-IN", options);
    }


    // =========================================
    // DASHBOARD DATA
    // =========================================


    const totalEmployees = 14;
    const presentEmployees = 6;
    const absentEmployees = 4;
    const leaveEmployees = 8;


    // =========================================
    // STAT CARDS
    // =========================================

    const totalEmployeeElement =
        document.getElementById("totalEmployee");

    const presentEmployeeElement =
        document.getElementById("presentEmployee");

    const absentEmployeeElement =
        document.getElementById("absentEmployee");

    const leaveEmployeeElement =
        document.getElementById("leaveEmployee");


    if (totalEmployeeElement) {
        totalEmployeeElement.textContent = totalEmployees;
    }

    if (presentEmployeeElement) {
        presentEmployeeElement.textContent = presentEmployees;
    }

    if (absentEmployeeElement) {
        absentEmployeeElement.textContent = absentEmployees;
    }

    if (leaveEmployeeElement) {
        leaveEmployeeElement.textContent = leaveEmployees;
    }


    // =========================================
    // ATTENDANCE PERCENTAGES
    // =========================================

    /*
        Note:
        Current dashboard numbers are temporary.
        Total = 14
        Present = 6
        Absent = 4
        Leave = 8

        For attendance overview, percentages are
        calculated from the total employees.
    */

    const presentPercentage =
        Math.round((presentEmployees / totalEmployees) * 100);

    const absentPercentage =
        Math.round((absentEmployees / totalEmployees) * 100);

    const leavePercentage =
        Math.round((leaveEmployees / totalEmployees) * 100);


    // =========================================
    // STAT CARD TEXT
    // =========================================

    const presentPercentageElement =
        document.getElementById("presentPercentage");

    const absentPercentageElement =
        document.getElementById("absentPercentage");

    const leavePercentageElement =
        document.getElementById("leavePercentage");


    if (presentPercentageElement) {
        presentPercentageElement.textContent =
            presentPercentage + "% attendance";
    }

    if (absentPercentageElement) {
        absentPercentageElement.textContent =
            absentPercentage + "% of employees";
    }

    if (leavePercentageElement) {
        leavePercentageElement.textContent =
            leavePercentage + "% of employees";
    }


    // =========================================
    // ATTENDANCE OVERVIEW
    // =========================================

    const attendancePresent =
        document.getElementById("attendancePresent");

    const attendanceAbsent =
        document.getElementById("attendanceAbsent");

    const attendanceLeave =
        document.getElementById("attendanceLeave");


    if (attendancePresent) {
        attendancePresent.textContent =
            presentPercentage + "%";
    }

    if (attendanceAbsent) {
        attendanceAbsent.textContent =
            absentPercentage + "%";
    }

    if (attendanceLeave) {
        attendanceLeave.textContent =
            leavePercentage + "%";
    }


    // =========================================
    // PROGRESS BARS
    // =========================================

    const presentProgress =
        document.getElementById("presentProgress");

    const absentProgress =
        document.getElementById("absentProgress");

    const leaveProgress =
        document.getElementById("leaveProgress");


    if (presentProgress) {
        presentProgress.style.width =
            presentPercentage + "%";
    }

    if (absentProgress) {
        absentProgress.style.width =
            absentPercentage + "%";
    }

    if (leaveProgress) {
        leaveProgress.style.width =
            leavePercentage + "%";
    }


    // =========================================
    // RECENT EMPLOYEES
    // =========================================

    console.log("Emplyra Dashboard Loaded Successfully");

});