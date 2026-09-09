package com.edusphere.backend.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.edusphere.backend.dto.LessonFileResponseDto;
import com.edusphere.backend.service.LessonFileService;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/instructor/lessons")
public class LessonFileController {

    private final LessonFileService lessonFileService;

    public LessonFileController(
            LessonFileService lessonFileService) {

        this.lessonFileService = lessonFileService;
    }

    @PostMapping("/{lessonId}/files")
    public ResponseEntity<LessonFileResponseDto> uploadFile(
            @PathVariable Long lessonId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        String instructorEmail =
                authentication.getName();

        LessonFileResponseDto response =
                lessonFileService.uploadFile(
                        lessonId,
                        file,
                        instructorEmail
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping("/{lessonId}/files")
    public ResponseEntity<List<LessonFileResponseDto>> getLessonFiles(
            @PathVariable Long lessonId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                lessonFileService.getLessonFiles(
                        lessonId,
                        instructorEmail
                )
        );
    }
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            Authentication authentication)
            throws IOException {

        String instructorEmail =
                authentication.getName();

        LessonFileResponseDto fileInfo =
                lessonFileService.getFileInfo(
                        fileId,
                        instructorEmail
                );

        Resource resource =
                lessonFileService.downloadFile(
                        fileId,
                        instructorEmail
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                        fileInfo.getOriginalFileName() +
                        "\""
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        fileInfo.getFileType()
                )
                .body(resource);
    }
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long fileId,
            Authentication authentication)
            throws IOException {

        String instructorEmail =
                authentication.getName();

        lessonFileService.deleteFile(
                fileId,
                instructorEmail
        );

        return ResponseEntity.noContent().build();
    }
}