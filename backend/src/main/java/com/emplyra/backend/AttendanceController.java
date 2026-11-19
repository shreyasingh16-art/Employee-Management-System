package com.emplyra.backend;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceController(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {

        Employee employee = employeeRepository.findById(attendance.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));

        if (attendance.getDate() == null || attendance.getStatus() == null
                || attendance.getStatus().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Date and status are required");
        }

        if (!List.of("Present", "Absent", "Leave").contains(attendance.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid attendance status");
        }

        if (attendanceRepository.existsByEmployeeIdAndDate(
                employee.getId(), attendance.getDate())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Attendance already recorded for this date");
        }

        attendance.setEmployeeName(employee.getName());

        return attendanceRepository.save(attendance);
    }
}
