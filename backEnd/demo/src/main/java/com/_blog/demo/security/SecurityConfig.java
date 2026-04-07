package com._blog.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // Injecting the custom filter we will build next
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (Cross-Site Request Forgery)
            .csrf(csrf -> csrf.disable())
            
            // 2. Set Session Management to STATELESS
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. The VIP List: Who is allowed in?
          .authorizeHttpRequests(auth -> auth
                // Public routes (Login/Register)
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                
                // 🛑 THE NEW LINE: Lock down the Admin section!
                // This means any URL starting with /api/admin/ is totally blocked unless you are an ADMIN.
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // EVERY other request requires a normal logged-in user
                .anyRequest().authenticated()
            )
            
            // 4. Put our custom JWT filter IN FRONT OF the default password filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 5. The Password Encoder (Hashes passwords so they aren't plain text in the DB)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 6. The Authentication Manager (The boss that actually checks if the password is correct)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}