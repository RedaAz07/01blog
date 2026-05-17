package com._blog.demo.services;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.demo.exceptions.ApiException;
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
            "video/mp4",
            "video/webm");

    public MediaUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) throws IOException {

        String realMimeType = tika.detect(
                file.getInputStream(),
                file.getOriginalFilename());

        if (!ALLOWED_MIME_TYPES.contains(realMimeType)) {
            throw ApiException.badRequest(
                    "invalid media uploaded: " + realMimeType);
        }

        File tempFile = File.createTempFile(
                "upload-",
                file.getOriginalFilename());

        file.transferTo(tempFile);

        try {

            Map uploadResult = cloudinary.uploader().upload(
                    tempFile,
                    ObjectUtils.asMap(
                            "resource_type", "auto"));

            return uploadResult.get("secure_url").toString();

        } finally {
            tempFile.delete();
        }
    }
}