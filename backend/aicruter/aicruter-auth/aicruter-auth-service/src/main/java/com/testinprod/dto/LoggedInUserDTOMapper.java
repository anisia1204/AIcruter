package com.testinprod.dto;

import com.testinprod.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class LoggedInUserDTOMapper {
    public LoggedInUserDTO getDTOFromEntity(UserAccount user) {
        LoggedInUserDTO loggedInUserDTO = new LoggedInUserDTO();

        loggedInUserDTO.setId(user.getId());
        loggedInUserDTO.setFirstName(user.getFirstName());
        loggedInUserDTO.setLastName(user.getLastName());
        loggedInUserDTO.setEmail(user.getEmail());
        loggedInUserDTO.setRole(user.getRole());

        return loggedInUserDTO;
    }
}
