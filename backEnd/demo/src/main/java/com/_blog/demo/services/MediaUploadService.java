 package com._blog.demo.services;
import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class MediaUploadService {

    private final Cloudinary cloudinary;

    public MediaUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("resource_type", "auto"));
    
        return uploadResult.get("secure_url").toString();
    }
}