package com.devtiro.blog.mappers;

import com.devtiro.blog.domain.PostStatus;
import com.devtiro.blog.domain.dtos.CategoryDto;
import com.devtiro.blog.domain.dtos.CreateCategoryRequest;
import com.devtiro.blog.domain.entities.Category;
import com.devtiro.blog.domain.entities.Post;
import com.devtiro.blog.mappers.impl.CategoryMapperImpl;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class CategoryMapperImplTest {
    private final CategoryMapperImpl mapper = new CategoryMapperImpl();

    @Test
    void mapsCategoryIdNameAndPostCount() {
        UUID categoryId = UUID.randomUUID();
        Post published = new Post();
        published.setStatus(PostStatus.PUBLISHED);
        Post draft = new Post();
        draft.setStatus(PostStatus.DRAFT);
        Category category = new Category();
        category.setId(categoryId);
        category.setName("Engineering");
        category.setPosts(List.of(published, draft));

        CategoryDto dto = mapper.toDto(category);
        assertEquals(categoryId, dto.getId());
        assertEquals("Engineering", dto.getName());
        assertEquals(2L, dto.getPostCount());
    }

    @Test
    void mapsCreateRequestToCategoryAndTrimsName() {
        CreateCategoryRequest request = CreateCategoryRequest.builder().name("  Engineering  ").build();
        Category category = mapper.toEntity(request);
        assertNotNull(category);
        assertEquals("Engineering", category.getName());
    }
}
