package com._blog.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring Boot: 
        // "If someone types /uploads/... in their browser, go look inside the physical 'uploads/' folder on my computer!"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}