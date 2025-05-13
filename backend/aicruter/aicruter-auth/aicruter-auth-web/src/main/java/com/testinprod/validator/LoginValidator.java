package com.testinprod.validator;

import com.testinprod.UserAccountService;
import com.testinprod.dto.UserAccountDTO;
import com.testinprod.entity.UserAccount;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class LoginValidator implements Validator {
    private final UserAccountService userService;
    private final PasswordEncoder passwordEncoder;

    public LoginValidator(UserAccountService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public boolean supports(Class<?> clazz) {
        return UserAccountDTO.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "field.required");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "field.required");
        UserAccountDTO userDTO = (UserAccountDTO) target;
        if(!userService.isExisting(userDTO))
            errors.rejectValue("email", "Nu exista niciun cont inregistrat cu acest email!");
        else {
            UserAccount existingUser = userService.getUserByEmail(userDTO.getEmail());
            if(!existingUser.isEnabled()) {
                errors.rejectValue("email", "Un email de confirmare a fost deja trimis catre tine! Confirma-ti adresa de email accesand link-ul din email-ul primit!");
            }
            else {
                if(!passwordEncoder.matches(userDTO.getPassword(), existingUser.getPassword())) {
                    errors.rejectValue("password", "Parola incorecta!");
                }
            }
        }
    }
}
