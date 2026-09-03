package com.edusphere.backend.controller;

import com.edusphere.backend.dto.RegisterRequestDto;
import com.edusphere.backend.dto.UserResponseDto;
import com.edusphere.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.edusphere.backend.dto.LoginRequestDto;
import com.edusphere.backend.dto.LoginResponseDto;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<UserResponseDto> register(@RequestBody RegisterRequestDto request) {
		UserResponseDto response = userService.registerUser(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
		LoginResponseDto response = userService.loginUser(request);
		return ResponseEntity.ok(response);
	}

}