package com.devtiro.blog.controllers;

import com.devtiro.blog.domain.dtos.AuthResponse;
import com.devtiro.blog.domain.dtos.LoginRequest;
import com.devtiro.blog.domain.dtos.UserProfileDto;
import com.devtiro.blog.domain.entities.User;
import com.devtiro.blog.services.AuthenticationService;
import com.devtiro.blog.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping(path = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping(path = "/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@RequestAttribute UUID userId) {
        User user = userService.getUserById(userId);
        UserProfileDto profile = UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
        return ResponseEntity.ok(profile);
    }
}
