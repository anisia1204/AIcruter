package com.testinprod;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicant")
@CrossOrigin
public class ApplicantController {
    @GetMapping
    @ResponseBody
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("hello");
    }
}
