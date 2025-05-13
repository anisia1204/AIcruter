package com.testinprod;

import com.testinprod.dto.UserAccountDTO;
import com.testinprod.validator.LoginValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user-account")
@CrossOrigin
public class UserAccountController {
    private UserAccountService userAccountService;
    private final LoginValidator loginValidator;

    public UserAccountController(UserAccountService userAccountService, LoginValidator loginValidator) {
        this.userAccountService = userAccountService;
        this.loginValidator = loginValidator;
    }

    @GetMapping("/confirm")
    public ResponseEntity<?> confirmUser(@RequestParam("token") String token) {
        userAccountService.confirmUser(token);
        return ResponseEntity.ok("Te-ai inregistrat cu succes!");
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> authenticate(@RequestBody UserAccountDTO userDTO, BindingResult bindingResult){
        loginValidator.validate(userDTO, bindingResult);
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getCode();
                errors.put(fieldName, errorMessage);
            });
            return ResponseEntity.badRequest().body(errors);
        }
        return ResponseEntity.ok(userAccountService.login(userDTO));
    }
}
