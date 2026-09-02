package com.edusphere.backend.service;

import com.edusphere.backend.entity.User;
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

	public User registerUser(User user) {
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already registered");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		if (user.getRole() == null || user.getRole().isBlank()) {
			user.setRole("STUDENT");
		}
		return userRepository.save(user);
	}
}