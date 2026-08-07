package com.bk.mail_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
@EnableDiscoveryClient
@EnableDubbo
@RefreshScope
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MailServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MailServiceApplication.class, args);
    }

}
