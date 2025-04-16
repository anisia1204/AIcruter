package com.testinprod.impl;

import com.testinprod.ConfirmationTokenService;
import com.testinprod.email.EmailSender;
import com.testinprod.entity.ConfirmationToken;
import com.testinprod.entity.UserAccount;
import com.testinprod.repository.ConfirmationTokenJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {
    private final ConfirmationTokenJPARepository confirmationTokenJPARepository;
    private final EmailSender emailSender;

    public ConfirmationTokenServiceImpl(ConfirmationTokenJPARepository confirmationTokenJPARepository, EmailSender emailSender) {
        this.confirmationTokenJPARepository = confirmationTokenJPARepository;
        this.emailSender = emailSender;
    }

    @Override
    @Transactional
    public void generateTokenAndSendEmailConfirmationToUser(UserAccount userAccount) {
        ConfirmationToken confirmationToken = saveToken(userAccount);
        emailSender.sendEmailConfirmation(userAccount.getEmail(), userAccount.getFirstName(), confirmationToken.getToken());
    }


    @Transactional
    public ConfirmationToken saveToken(UserAccount userAccount) {
        ConfirmationToken token = new ConfirmationToken();
        token.setToken(generateConfirmationToken());
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(token.getCreatedAt().plusMinutes(15));
        token.setUserAccount(userAccount);
        return persist(token);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ConfirmationToken> getByToken(String token) {
        return confirmationTokenJPARepository.findByToken(token);
    }

    @Override
    @Transactional
    public void setConfirmedAt(String token) {
        ConfirmationToken confirmationToken = getByToken(token).orElseThrow();
        confirmationToken.setConfirmedAt(LocalDateTime.now());
        persist(confirmationToken);
    }

    @Override
    @Transactional(readOnly = true)
    public ConfirmationToken getTokenByUserId(Long id) {
        return confirmationTokenJPARepository.findByUserAccountId(id);
    }

    private static String generateConfirmationToken() {
        return UUID.randomUUID().toString();
    }

    private ConfirmationToken persist(ConfirmationToken confirmationToken) {
        return confirmationTokenJPARepository.save(confirmationToken);
    }
}
