package com._blog.demo.validators;

import java.util.Arrays;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FileTypeValidator implements ConstraintValidator<ValidFileType, MultipartFile> {

    private String[] allowedTypes;

    @Override
    public void initialize(ValidFileType constraintAnnotation) {
        // Get the list of allowed types from the annotation in the DTO
        this.allowedTypes = constraintAnnotation.allowedTypes();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        // If the file is null or empty, we return true here. 
        // (Use @NotNull in your DTO if you want to force them to upload a file)
        if (file == null || file.isEmpty()) {
            return true; 
        }
        
        // Grab the actual MIME type of the uploaded file
        String contentType = file.getContentType();
        System.out.println("DEBUG - Postman sent MIME type: [" + contentType + "]");
        // Check if it matches our allowed list
        return Arrays.asList(allowedTypes).contains(contentType);
    }
}