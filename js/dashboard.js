/* =====================================================
   DASHBOARD JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       CURRENT DATE
    ================================================= */

    const dateElement = document.getElementById("currentDate");

    if (dateElement) {

        const today = new Date();

        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric"
        };

        dateElement.textContent =
            today.toLocaleDateString("en-IN", options);
    }


    /* =================================================
       LOGOUT
    ================================================= */

    const logoutLink = document.querySelector(
        'a[href="login.html"]'
    );

    if (logoutLink) {

        logoutLink.addEventListener("click", function (event) {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) {
                event.preventDefault();
            }

        });

    }


    /* =================================================
       DASHBOARD STATISTICS
    ================================================= */

    const totalEmployee =
        document.getElementById("totalEmployee");

    const presentEmployee =
        document.getElementById("presentEmployee");

    const absentEmployee =
        document.getElementById("absentEmployee");

    const leaveEmployee =
        document.getElementById("leaveEmployee");


    /*
       Temporary data

       Later these values will come from
       Java Backend + Database.
    */

    const dashboardData = {

        totalEmployee: 100,

        presentEmployee: 78,

        absentEmployee: 10,

        leaveEmployee: 9

    };


    /* =================================================
       DISPLAY STATISTICS
    ================================================= */

    if (totalEmployee) {

        totalEmployee.textContent =
            dashboardData.totalEmployee;
    }


    if (presentEmployee) {

        presentEmployee.textContent =
            dashboardData.presentEmployee;
    }


    if (absentEmployee) {

        absentEmployee.textContent =
            dashboardData.absentEmployee;
    }


    if (leaveEmployee) {

        leaveEmployee.textContent =
            dashboardData.leaveEmployee;
    }


    /* =================================================
       ATTENDANCE PERCENTAGE
    ================================================= */

    const total =
        dashboardData.totalEmployee;

    const present =
        dashboardData.presentEmployee;

    const absent =
        dashboardData.absentEmployee;

    const leave =
        dashboardData.leaveEmployee;


    if (total > 0) {

        const presentPercentage =
            ((present / total) * 100).toFixed(1);

        const absentPercentage =
            ((absent / total) * 100).toFixed(1);

        const leavePercentage =
            ((leave / total) * 100).toFixed(1);


        /* Present Progress Bar */

        const presentBar =
            document.querySelector(".progress-present");

        if (presentBar) {

            presentBar.style.width =
                presentPercentage + "%";
        }


        /* Absent Progress Bar */

        const absentBar =
            document.querySelector(".progress-absent");

        if (absentBar) {

            absentBar.style.width =
                absentPercentage + "%";
        }


        /* Leave Progress Bar */

        const leaveBar =
            document.querySelector(".progress-leave");

        if (leaveBar) {

            leaveBar.style.width =
                leavePercentage + "%";
        }


        /* Attendance Percentage Text */

        const attendancePercentage =
            document.querySelector(".stat-success");

        if (attendancePercentage) {

            attendancePercentage.textContent =
                "↑ " + presentPercentage +
                "% attendance";
        }


        /* Absent Percentage Text */

        const absentPercentageText =
            document.querySelector(".stat-danger");

        if (absentPercentageText) {

            absentPercentageText.textContent =
                absentPercentage +
                "% of employee";
        }


        /* Leave Percentage Text */

        const leavePercentageText =
            document.querySelector(".stat-warning");

        if (leavePercentageText) {

            leavePercentageText.textContent =
                leavePercentage +
                "% of employee";
        }

    }


    /* =================================================
       DASHBOARD LOADED MESSAGE
    ================================================= */

    console.log(
        "Employee Management Dashboard loaded successfully."
    );

});