package com.testinprod;

import com.testinprod.dto.LoggedInUserDTO;
import com.testinprod.dto.UserAccountDTO;
import com.testinprod.entity.UserAccount;

public interface UserAccountService {
    boolean isExisting(UserAccountDTO userDTO0);
    UserAccount getUserByEmail(String email);
    UserAccount save(UserAccountDTO userAccountDTO);
    void confirmUser(String token);
    LoggedInUserDTO login(UserAccountDTO userDTO);
}
