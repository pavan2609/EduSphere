package com.edusphere.backend.service;

import com.edusphere.backend.dto.RegisterRequestDto;
import com.edusphere.backend.dto.UserResponseDto;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.exception.UserAlreadyExistsException;
import com.edusphere.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.edusphere.backend.dto.LoginRequestDto;
import com.edusphere.backend.dto.LoginResponseDto;
import com.edusphere.backend.exception.InvalidCredentialsException;
import com.edusphere.backend.security.JwtService;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {

		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
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

	public LoginResponseDto loginUser(LoginRequestDto request) {

	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new InvalidCredentialsException("Invalid email or password"));

	    boolean passwordMatches = passwordEncoder.matches(
	            request.getPassword(),
	            user.getPassword()
	    );

	    if (!passwordMatches) {
	        throw new InvalidCredentialsException("Invalid email or password");
	    }

	    String token = jwtService.generateToken(
	            user.getEmail(),
	            user.getRole()
	    );
	    String refreshToken = jwtService.generateRefreshToken(
                user.getEmail()
        );
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

}