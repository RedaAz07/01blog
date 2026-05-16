package com._blog.demo.services;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class MediaUploadService {

    private final Cloudinary cloudinary;
    
    private final Tika tika = new Tika();
    
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
        "image/jpeg", 
        "image/png", 
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm"
    );

    public MediaUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        
        String realMimeType = tika.detect(file.getInputStream());

        if (!ALLOWED_MIME_TYPES.contains(realMimeType)) {
            throw new IllegalArgumentException("SECURITY ALERT: Invalid file type detected -> " + realMimeType);
        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("resource_type", "auto"));
    
        return uploadResult.get("secure_url").toString();
    }
}