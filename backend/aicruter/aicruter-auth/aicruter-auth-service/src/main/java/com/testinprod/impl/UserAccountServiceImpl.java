package com.testinprod.impl;

import com.testinprod.ConfirmationTokenService;
import com.testinprod.UserAccountService;
import com.testinprod.dto.LoggedInUserDTO;
import com.testinprod.dto.LoggedInUserDTOMapper;
import com.testinprod.dto.UserAccountDTO;
import com.testinprod.dto.UserAccountDTOMapper;
import com.testinprod.entity.ConfirmationToken;
import com.testinprod.entity.UserAccount;
import com.testinprod.filter.JwtService;
import com.testinprod.repository.UserAccountJPARepository;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountJPARepository jpaRepository;
    private final UserAccountDTOMapper userAccountDTOMapper;
    private final ConfirmationTokenService confirmationTokenService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoggedInUserDTOMapper loggedInUserDTOMapper;

    public UserAccountServiceImpl(UserAccountJPARepository jpaRepository, UserAccountDTOMapper userAccountDTOMapper, ConfirmationTokenService confirmationTokenService, AuthenticationManager authenticationManager, JwtService jwtService, LoggedInUserDTOMapper loggedInUserDTOMapper) {
        this.jpaRepository = jpaRepository;
        this.userAccountDTOMapper = userAccountDTOMapper;
        this.confirmationTokenService = confirmationTokenService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.loggedInUserDTOMapper = loggedInUserDTOMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isExisting(UserAccountDTO userDTO) {
        return jpaRepository.findByEmail(userDTO.getEmail()).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public UserAccount getUserByEmail(String email) {
        return jpaRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public UserAccount save(UserAccountDTO userAccountDTO) {
        UserAccount userAccount = userAccountDTOMapper.getEntityFromDTO(userAccountDTO);
        userAccount.setCreatedAt(LocalDateTime.now());
        userAccount.setEnabled(false);
        return persist(userAccount);
    }

    @Override
    @Transactional
    public UserAccount update(UserAccountDTO userAccountDTO) {
        UserAccount userAccount = getById(userAccountDTO.getId());
        userAccountDTOMapper.updateEntityFields(userAccount, userAccountDTO);
        userAccount = persist(userAccount);
        return userAccount;
    }

    @Override
    @Transactional
    public void confirmUser(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getByToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);
        UserAccount user = confirmationToken.getUserAccount();
        enableUser(user);
    }

    @Override
    public LoggedInUserDTO login(UserAccountDTO userDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDTO.getEmail(),
                        userDTO.getPassword()
                )
        );
        UserAccount user = getUserByEmail(userDTO.getEmail());
        LoggedInUserDTO loggedInUserDTO = loggedInUserDTOMapper.getDTOFromEntity(user);

        String jwtToken = jwtService.generateJwtToken(user);
        loggedInUserDTO.setToken(jwtToken);
        loggedInUserDTO.setTokenExpirationDate(jwtService.extractClaim(jwtToken, Claims::getExpiration));

        return loggedInUserDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public UserAccount getById(Long id) {
        return null;
    }

    private void enableUser(UserAccount user) {
        user.setEnabled(true);
        persist(user);
    }

    private UserAccount persist(UserAccount userAccount) {
        return jpaRepository.save(userAccount);
    }
}
