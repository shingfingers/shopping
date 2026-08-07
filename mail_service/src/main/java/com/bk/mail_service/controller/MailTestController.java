package com.bk.mail_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MailTestController {
    
    @Value("${mail.user}")
    private String mailUser;
    
    @Value("${mail.password}")
    private String mailPassword;
    
    @GetMapping("/mail/config")
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("mail.user", mailUser);
        config.put("mail.password", mailPassword != null ? "已配置(长度:" + mailPassword.length() + ")" : "未配置");
        return config;
    }
}
