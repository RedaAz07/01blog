package com._blog.demo.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Look at the HTTP Header to see if they brought a wristband
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. If there is no header, or it doesn't start with "Bearer ", reject them!
        // (We let the filter continue so the SecurityConfig can block them or allow them if it's a public route like /login)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the wristband string (Remove the "Bearer " part which is 7 characters)
        jwt = authHeader.substring(7);
        // 4. Ask the JwtUtil machine to read the name on the wristband
        try {

            username = jwtUtil.extractUsername(jwt);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Go to the database and fetch the actual user details
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (!userDetails.isEnabled()) {
                    throw new RuntimeException("your account is blocked");
                }
                // 6. Ask the JwtUtil machine if the wristband is valid and not expired
                if (jwtUtil.isTokenValid(jwt, userDetails)) {

                    // 7. If valid, formally introduce the user to Spring Security so they are allowed inside!
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Update the security context (The Bouncer opens the door)
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.out.println("JWT ERROR: Token is invalid or expired - " + e.getMessage());
        }

        // 5. If we found a name, AND the user isn't already logged in right now...
        // Move on to the next filter or the Controller
        filterChain.doFilter(request, response);
    }
}
