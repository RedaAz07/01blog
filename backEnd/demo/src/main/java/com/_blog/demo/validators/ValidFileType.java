package com._blog.demo.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = FileTypeValidator.class) // Links to the logic class we will build next
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFileType {
    
    String message() default "Invalid file type. Only specific images and videos are allowed.";
    
    // This allows us to pass a list of valid MIME types in the DTO
    String[] allowedTypes(); 
    
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}