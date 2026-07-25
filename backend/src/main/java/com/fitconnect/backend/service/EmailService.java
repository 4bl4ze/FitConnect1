
package com.fitconnect.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com");
        message.setTo(toEmail);
        message.setSubject("FitConnect - Password Reset Request");

        // Construct the message body
        String body = "Hi,\n\n" +
                "You requested to reset your password for FitConnect.\n\n" +
                "Your password reset token is: " + resetToken + "\n\n" +
                "If you did not request this, please ignore this email.";

        message.setText(body);
        mailSender.send(message);
    }
}