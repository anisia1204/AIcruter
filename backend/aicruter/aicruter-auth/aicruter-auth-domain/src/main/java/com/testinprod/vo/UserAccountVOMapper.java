package com.testinprod.vo;

import com.testinprod.entity.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class UserAccountVOMapper {
    public UserAccountVO getVOFromEntity(UserAccount userAccount) {
        return new UserAccountVO(
                userAccount.getFirstName(),
                userAccount.getLastName(),
                userAccount.getEmail(),
                userAccount.getTelephone()
        );
    }
}
