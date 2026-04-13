package com._blog.demo.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // This is the physical folder on your computer where files will be saved
    private final String UPLOAD_DIR = "uploads/images/";

    public FileStorageService() {
        // When Spring Boot starts, this checks if the folder exists. If not, it creates it!
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            // 1. Get the original file extension (e.g., ".jpg", ".png")
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 2. Generate a random unique name (e.g., "550e8400-e29b-41d4-a716-446655440000.jpg")
            // This prevents two users from uploading "profile.jpg" and overwriting each other!
            String newFilename = UUID.randomUUID().toString() + extension;

            // 3. Define the exact path where it will be saved
            Path filePath = Paths.get(UPLOAD_DIR + newFilename);

            // 4. Save the actual file to your hard drive
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Return the URL path that you will save in the Database
            return "/uploads/images/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}