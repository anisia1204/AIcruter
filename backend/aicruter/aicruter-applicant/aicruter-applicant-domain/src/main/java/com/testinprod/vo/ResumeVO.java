package com.testinprod.vo;

public class ResumeVO {
    private Long id;
    private String name;
    private Long size;
    private byte[] content;
    private String base64EncodedStringOfFileContent;

    public ResumeVO(Long id, String name, Long size, byte[] content, String base64EncodedStringOfFileContent) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.content = content;
        this.base64EncodedStringOfFileContent = base64EncodedStringOfFileContent;
    }

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

    public String getBase64EncodedStringOfFileContent() {
        return base64EncodedStringOfFileContent;
    }
}
