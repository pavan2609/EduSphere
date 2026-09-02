package com.edusphere.backend.controller;

import com.edusphere.backend.entity.User;
import com.edusphere.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody User user) {
		User registeredUser = userService.registerUser(user);
		return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
	}
}