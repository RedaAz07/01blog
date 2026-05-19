package com._blog.demo.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // <-- ADD THIS IMPORT
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository; // <-- ADD THIS IMPORT

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User myUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                myUser.getUsername(),
                myUser.getPassword(),
                myUser.isStatus(), // <-- 1. enabled: We pass your database status right here!
                true, // <-- 2. accountNonExpired
                true, // <-- 3. credentialsNonExpired
                true, // <-- 4. accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority(myUser.getRole()))
        );
    }
}
