package com.devtiro.blog.services.impl;

import com.devtiro.blog.domain.entities.Post;
import com.devtiro.blog.domain.entities.User;
import com.devtiro.blog.repositories.PostRepository;
import com.devtiro.blog.services.CategoryService;
import com.devtiro.blog.services.TagService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceImplTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private TagService tagService;

    @InjectMocks
    private PostServiceImpl postService;

    @Test
    void cannotDeleteAnotherUsersPost() {
        UUID postId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        UUID otherUserId = UUID.randomUUID();

        User owner = new User();
        owner.setId(ownerId);

        Post post = new Post();
        post.setId(postId);
        post.setAuthor(owner);
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        assertThrows(EntityNotFoundException.class, () -> postService.deletePost(postId, otherUserId));
        verify(postRepository, never()).delete(any(Post.class));
    }

    @Test
    void ownerCanDeleteTheirPost() {
        UUID postId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();

        User owner = new User();
        owner.setId(ownerId);

        Post post = new Post();
        post.setId(postId);
        post.setAuthor(owner);
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        postService.deletePost(postId, ownerId);

        verify(postRepository).delete(post);
    }
}
