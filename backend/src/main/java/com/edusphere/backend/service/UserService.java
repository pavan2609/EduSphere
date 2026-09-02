package com.edusphere.backend.service;

import com.edusphere.backend.dto.RegisterRequestDto;
import com.edusphere.backend.dto.UserResponseDto;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.exception.UserAlreadyExistsException;
import com.edusphere.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserResponseDto registerUser(RegisterRequestDto request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("Email already registered");
		}
		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		if (request.getRole() == null || request.getRole().isBlank()) {
			user.setRole("STUDENT");
		} else {
			user.setRole(request.getRole());
		}
		User savedUser = userRepository.save(user);
		return new UserResponseDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
	}
}