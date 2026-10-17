package com.devtiro.blog.controllers;

import com.devtiro.blog.domain.CreatePostRequest;
import com.devtiro.blog.domain.PostStatus;
import com.devtiro.blog.domain.UpdatePostRequest;
import com.devtiro.blog.domain.dtos.CreatePostRequestDto;
import com.devtiro.blog.domain.dtos.PostDto;
import com.devtiro.blog.domain.dtos.UpdatePostRequestDto;
import com.devtiro.blog.domain.entities.Post;
import com.devtiro.blog.domain.entities.User;
import com.devtiro.blog.mappers.PostMapper;
import com.devtiro.blog.services.PostService;
import com.devtiro.blog.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID tagId) {
        List<PostDto> postDtos = postService.getAllPosts(categoryId, tagId)
                .stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping(path = "/drafts")
    public ResponseEntity<List<PostDto>> getDrafts(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        List<PostDto> postDtos = postService.getDraftPosts(loggedInUser)
                .stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody CreatePostRequestDto createPostRequestDto,
            @RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        CreatePostRequest request = postMapper.toCreatePostRequest(createPostRequestDto);
        Post createdPost = postService.createPost(loggedInUser, request);
        return new ResponseEntity<>(postMapper.toDto(createdPost), HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequestDto updatePostRequestDto,
            @RequestAttribute UUID userId) {
        UpdatePostRequest request = postMapper.toUpdatePostRequest(updatePostRequestDto);
        Post updatedPost = postService.updatePost(id, userId, request);
        return ResponseEntity.ok(postMapper.toDto(updatedPost));
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<PostDto> getPost(@PathVariable UUID id) {
        Post post = postService.getPost(id);
        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new EntityNotFoundException("Post does not exist with ID " + id);
        }
        return ResponseEntity.ok(postMapper.toDto(post));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable UUID id,
            @RequestAttribute UUID userId) {
        postService.deletePost(id, userId);
        return ResponseEntity.noContent().build();
    }
}
