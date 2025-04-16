package com.testinprod.dto;

import com.testinprod.entity.UserAccount;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserAccountDTOMapper {

    private final PasswordEncoder passwordEncoder;

    public UserAccountDTOMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public UserAccount getEntityFromDTO(UserAccountDTO userAccountDTO) {
        UserAccount userAccount = new UserAccount();
        userAccount.setFirstName(userAccountDTO.getFirstName());
        userAccount.setLastName(userAccountDTO.getLastName());
        userAccount.setEmail(userAccountDTO.getEmail());
        userAccount.setPassword(passwordEncoder.encode(userAccountDTO.getPassword()));
        userAccount.setTelephone(userAccountDTO.getTelephone());
        userAccount.setRole(userAccountDTO.getRole());
        return userAccount;
    }
    public UserAccountDTO getDTOFromEntity(UserAccount entity) {
        UserAccountDTO userAccountDTO = new UserAccountDTO();
        userAccountDTO.setFirstName(entity.getFirstName());
        userAccountDTO.setLastName(entity.getLastName());
        userAccountDTO.setEmail(entity.getEmail());
        userAccountDTO.setPassword(entity.getPassword());
        userAccountDTO.setTelephone(entity.getTelephone());
        userAccountDTO.setRole(entity.getRole());
        return userAccountDTO;
    }
}
