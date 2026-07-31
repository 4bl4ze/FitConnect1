package com.fitconnect.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fitConnectOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FitConnect API")
                        .description("Backend REST API Documentation for FitConnect Fitness Platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FitConnect Team")
                                .email("support@fitconnect.com")));
    }
}