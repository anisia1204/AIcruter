package com.testinprod.dto;

public class ResumeDTO {
    private Long id;
    private String name;
    private Long size;
    private byte[] content;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public byte[] getContent() {
        return content;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
