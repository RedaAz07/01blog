package com._blog.demo.validators;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class FileValidator {

  
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        "jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"
    );

    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/webp", "image/gif",
        "video/mp4", "video/quicktime", "video/webm"
    );

    public static void validateMediaFile(MultipartFile file) {
        
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload an empty file!");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new RuntimeException("File must have an extension!");
        }
        
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("Invalid file extension! We don't accept ." + extension);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new RuntimeException("Invalid file content type! Rejected: " + contentType);
        }
    }
}