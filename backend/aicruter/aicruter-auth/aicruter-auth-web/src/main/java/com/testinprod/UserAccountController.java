package com.testinprod;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-account")
@CrossOrigin
public class UserAccountController {
    private UserAccountService userAccountService;

    public UserAccountController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("hello");
    }
}
