package com.testinprod.entity;

import com.testinprod.domain.Address;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "applicant")
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_account_id", foreignKey = @ForeignKey(name = "FK_APPLICANT__USER_ACCOUNT"))
    private UserAccount userAccount;

    @OneToOne(optional = false)
    @JoinColumn(name = "resume", foreignKey = @ForeignKey(name = "FK_APPLICANT__RESUME"))
    private Resume resume;

    @Embedded
    private Address legalAddress;

    @Column(name = "description")
    private String description;

    @Column(name = "education")
    private String education;
}
