package com.testinprod.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "picture", columnDefinition = "BYTEA")
    private byte[] picture;

    @Embedded
    private Address legalAddress;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Employer> employees;

    public Company() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPicture() {
        return picture;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public Address getLegalAddress() {
        return legalAddress;
    }

    public void setLegalAddress(Address legalAddress) {
        this.legalAddress = legalAddress;
    }

    public List<Employer> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employer> employees) {
        this.employees = employees;
    }
}
