package com._blog.demo.controllers;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/editor-upload")
    public ResponseEntity<Map<String, Object>> uploadEditorImage(@RequestParam("image") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Use our awesome bouncer to check for viruses/types
            FileValidator.validateMediaFile(file);

            // 2. Upload the single file to Cloudinary
            String url = mediaUploadService.uploadFile(file);

            // 3. 🟢 SUCCESS: Build the exact JSON Editor.js wants
            response.put("success", 1);

            Map<String, String> fileData = new HashMap<>();
            fileData.put("url", url);
            response.put("file", fileData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("🚨 EDITOR UPLOAD FAILED: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + e.getMessage());
            response.put("success", 0);
            return ResponseEntity.badRequest().body(response);
        }
    }

}