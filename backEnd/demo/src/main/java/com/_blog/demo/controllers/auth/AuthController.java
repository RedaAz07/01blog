package com._blog.demo.controllers.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.dto.Response;
import com._blog.demo.dto.auth.AuthResponseDTO;
import com._blog.demo.dto.auth.LoginRequestDTO;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.security.CustomUserDetailsService;
import com._blog.demo.security.JwtUtil;
import com._blog.demo.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            JwtUtil jwtUtil,
            UserService userService,
            UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // 1. REGISTER ENDPOINT
    @PostMapping("/register")
    public ResponseEntity<Response> register(@Valid @RequestBody RegisterRequestDTO request) {
        String response = userService.registerNewUser(request);
        return ResponseEntity.ok(new Response(response));
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
     

        // D. Send the wristband back to Angular
        return ResponseEntity.ok(new AuthResponseDTO(jwt));
    }

}
