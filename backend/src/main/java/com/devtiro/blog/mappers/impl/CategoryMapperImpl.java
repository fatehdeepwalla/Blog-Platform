package com.devtiro.blog.mappers.impl;

import com.devtiro.blog.domain.PostStatus;
import com.devtiro.blog.domain.dtos.CategoryDto;
import com.devtiro.blog.domain.dtos.CreateCategoryRequest;
import com.devtiro.blog.domain.entities.Category;
import com.devtiro.blog.mappers.CategoryMapper;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapperImpl implements CategoryMapper {
    @Override
    public CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .postCount(category.getPosts() == null ? 0L :
                        category.getPosts().stream()
                                .filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                                .count())
                .build();
    }

    @Override
    public Category toEntity(CreateCategoryRequest createCategoryRequest) {
        return Category.builder().name(createCategoryRequest.getName().trim()).build();
    }
}