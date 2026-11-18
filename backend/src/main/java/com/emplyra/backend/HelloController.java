package com.emplyra.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/test")
    public String test() {
        return "Emplyra Backend is Running Successfully!";
    }
}

