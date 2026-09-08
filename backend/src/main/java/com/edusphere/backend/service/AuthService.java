package com.edusphere.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edusphere.backend.dto.LoginRequestDto;
import com.edusphere.backend.dto.LoginResponseDto;
import com.edusphere.backend.dto.RegisterRequestDto;
import com.edusphere.backend.dto.UserResponseDto;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.UserRepository;
import com.edusphere.backend.security.JwtService;
import com.edusphere.backend.exception.DuplicateEmailException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public UserResponseDto register(RegisterRequestDto request) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        // 2. Create User entity
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 3. Encode password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4. Set role
        user.setRole(request.getRole().toUpperCase());

        // 5. Save user
        User savedUser = userRepository.save(user);

        // 6. Return DTO instead of User entity
        return new UserResponseDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
   

    public LoginResponseDto login(LoginRequestDto request) {

        // 1. Authenticate email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Get user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
        String refreshToken = jwtService.generateRefreshToken(
                user.getEmail()
        );
        // 4. Return login response
        return new LoginResponseDto(
                "Login successful",
                token,
                refreshToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
    public String refreshAccessToken(String refreshToken) {

        if (!jwtService.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String email = jwtService.extractEmailFromRefreshToken(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }

}

