package com._blog.demo.config;

import java.util.Date;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;

@Configuration
public class AdminSeeder {

    @Bean
    public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@blog.com");
                
                admin.setPassword(passwordEncoder.encode("admin123")); 
                
                admin.setRole("ROLE_ADMIN");
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setBirthDate(new Date());
                admin.setStatus(true); 
                
                userRepository.save(admin);
            }
        };
    }
}