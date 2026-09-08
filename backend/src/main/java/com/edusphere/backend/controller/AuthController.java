package com.edusphere.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.LoginRequestDto;
import com.edusphere.backend.dto.LoginResponseDto;
import com.edusphere.backend.dto.RegisterRequestDto;
import com.edusphere.backend.dto.UserResponseDto;
import com.edusphere.backend.service.AuthService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.edusphere.backend.dto.RefreshTokenRequestDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @Valid @RequestBody RegisterRequestDto request) {

        UserResponseDto response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto request) {

        LoginResponseDto response = authService.login(request);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @RequestBody RefreshTokenRequestDto request) {

        String newAccessToken =
                authService.refreshAccessToken(request.getRefreshToken());

        return ResponseEntity.ok(
                java.util.Map.of(
                        "accessToken",
                        newAccessToken
                )
        );
    }
}

