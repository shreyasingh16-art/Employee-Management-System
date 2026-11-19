package com.emplyra.backend;

import java.time.LocalDate;
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
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveController(
            LeaveRepository leaveRepository,
            EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @PostMapping
    public Leave addLeave(@RequestBody Leave leave) {

        Employee employee = employeeRepository.findById(leave.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found"));

        if (leave.getLeaveType() == null || leave.getLeaveType().isBlank()
                || leave.getFromDate() == null || leave.getToDate() == null
                || leave.getReason() == null || leave.getReason().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "All leave details are required");
        }

        if (!List.of("Casual Leave", "Sick Leave", "Annual Leave", "Emergency Leave")
                .contains(leave.getLeaveType())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid leave type");
        }

        if (leave.getToDate().isBefore(leave.getFromDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "To date cannot be before from date");
        }

        if (leave.getFromDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Leave date cannot be in the past");
        }

        leave.setEmployeeName(employee.getName());
        leave.setStatus("Pending");

        return leaveRepository.save(leave);
    }
}
