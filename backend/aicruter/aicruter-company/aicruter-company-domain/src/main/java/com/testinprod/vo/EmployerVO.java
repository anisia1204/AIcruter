package com.testinprod.vo;

import com.testinprod.entity.EmployeeRole;

public class EmployerVO {
    private Long id;
    private EmployeeRole role;
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;

    public EmployerVO(Long id, EmployeeRole role, String firstName, String lastName, String email, String telephone) {
        this.id = id;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
    }

    public Long getId() {
        return id;
    }

    public EmployeeRole getRole() {
        return role;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getTelephone() {
        return telephone;
    }
}
