package com.testinprod;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin
public class EmployerController {
    @GetMapping
    @ResponseBody
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("hello");
    }
}
