package com.testinprod.validator;

import com.testinprod.ConfirmationTokenService;
import com.testinprod.UserAccountService;
import com.testinprod.dto.UserAccountDTO;
import com.testinprod.entity.ConfirmationToken;
import com.testinprod.entity.UserAccount;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;

@Component
public class UserAccountValidator implements Validator {
    private final UserAccountService userService;
    private final ConfirmationTokenService confirmationTokenService;

    public UserAccountValidator(UserAccountService userService, ConfirmationTokenService confirmationTokenService) {
        this.userService = userService;
        this.confirmationTokenService = confirmationTokenService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return UserAccountDTO.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        UserAccountDTO userDTO = (UserAccountDTO) target;
        if(userService.isExisting(userDTO)){
            UserAccount user = userService.getUserByEmail(userDTO.getEmail());
            if(user.isEnabled()) {
                errors.reject("email", "Exista deja un utilizator cu acest email!");
            }
            else {
                ConfirmationToken confirmationToken = confirmationTokenService.getTokenByUserId(user.getId());
                LocalDateTime currentDateAndTime = LocalDateTime.now();
                if(!confirmationToken.getExpiresAt().isBefore(currentDateAndTime)) {
                    errors.reject("email", "Un email de confirmare a fost deja trimis catre tine! Confirma-ti adresa de email accesand link-ul din email-ul primit sau reincearca mai tarziu! ");
                }
            }
        }

    }
}
