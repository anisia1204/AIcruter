package com.testinprod.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Service
public class EmailService implements EmailSender{
    private final static Logger LOGGER = LoggerFactory
            .getLogger(EmailService.class);


    private final JavaMailSender mailSender;
    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendEmailConfirmation(String to, String name, String token) {
        String link = "http://localhost:8080/api/user-account/confirm?token=" + token; //TODO: retrieve link based on profile
        String subject = "Confirmare adresa email";
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(buildEmail(name, link), true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("studmarket12@gmail.com");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            LOGGER.error("failed to send email", e);
            throw new IllegalStateException("failed to send email");
        }
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:'Lucida Sans', Arial, sans-serif;font-size:16px;margin:0;color:#333;\">\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "<table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td width=\"100%\" height=\"80\" style=\"background: linear-gradient(90deg, #5eac90, #8f94fb);\">\n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:600px;margin:auto\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody>\n" +
                "            <tr>\n" +
                "              <td valign=\"middle\" style=\"text-align:center;padding:10px;\">\n" +
                "                <span style=\"font-family:'Lucida Sans', Arial, sans-serif;font-weight:700;color:#ffffff;font-size:32px;text-decoration:none;vertical-align:middle;display:inline-block\">Confirmă-ți adresa de e-mail</span>\n" +
                "              </td>\n" +
                "            </tr>\n" +
                "          </tbody>\n" +
                "        </table>\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "<table role=\"presentation\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:600px;width:100%!important;margin:auto\" width=\"100%\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "          <tbody>\n" +
                "            <tr>\n" +
                "              <td bgcolor=\"#5eac90\" width=\"100%\" height=\"10\"></td>\n" +
                "            </tr>\n" +
                "          </tbody>\n" +
                "        </table>\n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "<table role=\"presentation\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:600px;width:100%!important;margin:auto\" width=\"100%\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:'Lucida Sans', Arial, sans-serif;font-size:18px;line-height:1.6;max-width:580px;color:#444;\">\n" +
                "        <p style=\"margin:0 0 20px 0;font-size:18px;line-height:25px;\">Salut " + name + ",</p>\n" +
                "        <p style=\"margin:0 0 20px 0;font-size:18px;line-height:25px;\">Te rog accesează următorul link pentru a-ți activa contul:</p>\n" +
                "        <blockquote style=\"margin:0 0 20px 0;border-left:10px solid #5eac90;padding:15px;font-size:18px;line-height:25px;background:#f9f9f9;\">\n" +
                "          <p style=\"margin:0;\"><a href=\"" + link + "\" style=\"color:#5eac90;text-decoration:none;font-weight:bold;\">Activează acum</a></p>\n" +
                "        </blockquote>\n" +
                "        <p style=\"margin:0 0 20px 0;font-size:18px;line-height:25px;\">Link-ul va expira în 15 minute.</p>\n" +
                "        <p style=\"margin:0 0 20px 0;font-size:18px;line-height:25px;\">Ne vedem curând!</p>\n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "<div class=\"yj6qo\"></div>\n" +
                "<div class=\"adL\"></div>\n" +
                "</div>\n";
    }
}
