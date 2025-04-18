package com.testinprod.entity;

import com.testinprod.domain.Address;
import jakarta.persistence.*;

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

    public Applicant() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public Address getLegalAddress() {
        return legalAddress;
    }

    public void setLegalAddress(Address legalAddress) {
        this.legalAddress = legalAddress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }
}
