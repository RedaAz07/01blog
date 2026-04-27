package com._blog.demo.controllers;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com._blog.demo.services.MediaUploadService;
import com._blog.demo.validators.FileValidator;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaUploadService mediaUploadService;

    public MediaController(MediaUploadService mediaUploadService) {
        this.mediaUploadService = mediaUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadMultipleMedia(@RequestParam("files") List<MultipartFile> files) {
        
        if (files.size() > 5) {
            return ResponseEntity.badRequest().body("Bro, you can only upload a maximum of 5 files at a time!");
        }

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                FileValidator.validateMediaFile(file);

                String url = mediaUploadService.uploadFile(file);
                uploadedUrls.add(url);

            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Cloudinary upload failed!");
            }
        }
        return ResponseEntity.ok(uploadedUrls);
    }
}