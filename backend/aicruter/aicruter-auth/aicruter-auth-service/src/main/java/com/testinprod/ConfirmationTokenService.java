package com.testinprod;

import com.testinprod.entity.ConfirmationToken;
import com.testinprod.entity.UserAccount;

import java.util.Optional;

public interface ConfirmationTokenService {
    void generateTokenAndSendEmailConfirmationToUser(UserAccount userAccount);
    Optional<ConfirmationToken> getByToken(String token);
    void setConfirmedAt(String token);
    ConfirmationToken getTokenByUserId(Long id);
}