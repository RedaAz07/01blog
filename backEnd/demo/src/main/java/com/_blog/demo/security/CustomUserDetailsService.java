package com._blog.demo.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // <-- ADD THIS IMPORT
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository; // <-- ADD THIS IMPORT

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        user myUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // 🛑 THE NEW LOGIC: Take the role from your database, and add "ROLE_" to the front of it.
        // If myUser.getRole() is "ADMIN", this creates "ROLE_ADMIN".
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + myUser.getRole().toUpperCase());

        return new org.springframework.security.core.userdetails.User(
                myUser.getUsername(),
                myUser.getPassword(),
                Collections.singletonList(authority) // Hand the role to Spring Security!
        );
    }
}