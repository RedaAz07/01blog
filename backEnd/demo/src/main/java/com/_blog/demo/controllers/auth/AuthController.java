package com._blog.demo.controllers.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.dto.auth.AuthResponseDTO;
import com._blog.demo.dto.auth.LoginRequestDTO;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.security.CustomUserDetailsService;
import com._blog.demo.security.JwtUtil;
import com._blog.demo.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    // 1. REGISTER ENDPOINT
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        String response = userService.registerNewUser(request);
        return ResponseEntity.ok(response);
    }

    // 2. LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {

        // A. Ask the Bouncer to check the username and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // B. If the password is correct, fetch the user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // C. Print a brand new JWT wristband for them
        final String jwt = jwtUtil.generateToken(userDetails);
        user user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isStatus()) {
            throw new RuntimeException("your account is blocked");
        }

        // D. Send the wristband back to Angular
        return ResponseEntity.ok(new AuthResponseDTO(jwt));
    }

}
