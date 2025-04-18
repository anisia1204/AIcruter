package com.testinprod.email;

public interface EmailSender {
    void sendEmailConfirmation(String to, String name, String token);
}
