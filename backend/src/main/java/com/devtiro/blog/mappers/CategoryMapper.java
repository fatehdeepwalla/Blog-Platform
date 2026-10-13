package com.devtiro.blog.mappers;

import com.devtiro.blog.domain.dtos.CategoryDto;
import com.devtiro.blog.domain.dtos.CreateCategoryRequest;
import com.devtiro.blog.domain.entities.Category;

public interface CategoryMapper {

    CategoryDto toDto(Category category);

    Category toEntity(CreateCategoryRequest createCategoryRequest);

}
