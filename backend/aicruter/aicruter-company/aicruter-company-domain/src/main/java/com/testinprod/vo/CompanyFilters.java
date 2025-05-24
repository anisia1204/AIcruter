package com.testinprod.vo;

public class CompanyFilters {
    private String name;
    private String state;
    private String city;

    public CompanyFilters(String name, String state, String city) {
        this.name = name;
        this.state = state;
        this.city = city;
    }

    public String getName() {
        return name;
    }

    public String getState() {
        return state;
    }

    public String getCity() {
        return city;
    }
}
