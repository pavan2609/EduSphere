package com.edusphere.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.edusphere.backend.dto.LessonFileResponseDto;
import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.LessonFile;
import com.edusphere.backend.repository.LessonFileRepository;
import com.edusphere.backend.repository.LessonRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

@Service
public class LessonFileService {

    private static final long MAX_FILE_SIZE =
            100L * 1024 * 1024;

    private static final List<String> ALLOWED_TYPES =
            List.of(
                    "application/pdf",
                    "video/mp4",
                    "video/webm",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            );

    private final LessonFileRepository lessonFileRepository;
    private final LessonRepository lessonRepository;

    public LessonFileService(
            LessonFileRepository lessonFileRepository,
            LessonRepository lessonRepository) {

        this.lessonFileRepository = lessonFileRepository;
        this.lessonRepository = lessonRepository;
    }

    public LessonFileResponseDto uploadFile(
            Long lessonId,
            MultipartFile file,
            String instructorEmail) throws IOException {

        Lesson lesson = lessonRepository
                .findById(lessonId)
                .orElseThrow(() ->
                        new RuntimeException("Lesson not found"));

        if (!lesson.getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to upload to this lesson"
            );
        }

        validateFile(file);

        Path uploadDirectory =
                Paths.get("uploads");

        Files.createDirectories(uploadDirectory);

        String storedFileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        Path filePath =
                uploadDirectory.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        LessonFile lessonFile = new LessonFile();

        lessonFile.setOriginalFileName(
                file.getOriginalFilename()
        );

        lessonFile.setStoredFileName(
                storedFileName
        );

        lessonFile.setFileType(
                file.getContentType()
        );

        lessonFile.setFileSize(
                file.getSize()
        );

        lessonFile.setFilePath(
                filePath.toString()
        );

        lessonFile.setLesson(lesson);

        LessonFile savedFile =
                lessonFileRepository.save(lessonFile);

        return convertToResponse(savedFile);
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "File is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException(
                    "File size cannot exceed 100 MB"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !ALLOWED_TYPES.contains(contentType)) {

            throw new RuntimeException(
                    "Unsupported file type"
            );
        }
    }

    private LessonFileResponseDto convertToResponse(
            LessonFile file) {

        return new LessonFileResponseDto(
                file.getId(),
                file.getOriginalFileName(),
                file.getFileType(),
                file.getFileSize(),
                file.getLesson().getId()
        );
    }
    public List<LessonFileResponseDto> getLessonFiles(
            Long lessonId,
            String instructorEmail) {

        Lesson lesson = getLessonForInstructor(
                lessonId,
                instructorEmail
        );

        return lessonFileRepository
                .findByLesson(lesson)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
    private Lesson getLessonForInstructor(
            Long lessonId,
            String instructorEmail) {

        Lesson lesson = lessonRepository
                .findById(lessonId)
                .orElseThrow(() ->
                        new RuntimeException("Lesson not found")
                );

        if (!lesson.getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this lesson"
            );
        }

        return lesson;
    }
    public Resource downloadFile(
            Long fileId,
            String instructorEmail) throws IOException {

        LessonFile lessonFile = lessonFileRepository
                .findById(fileId)
                .orElseThrow(() ->
                        new RuntimeException("File not found")
                );

        Lesson lesson = lessonFile.getLesson();

        if (!lesson.getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to download this file"
            );
        }

        Path path = Paths.get(
                lessonFile.getFilePath()
        );

        Resource resource =
                new UrlResource(
                        path.toUri()
                );

        if (!resource.exists() ||
                !resource.isReadable()) {

            throw new RuntimeException(
                    "File does not exist"
            );
        }

        return resource;
    }
    public void deleteFile(
            Long fileId,
            String instructorEmail) throws IOException {

        LessonFile lessonFile =
                lessonFileRepository
                        .findById(fileId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "File not found"
                                )
                        );

        Lesson lesson = lessonFile.getLesson();

        if (!lesson.getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to delete this file"
            );
        }

        Path path = Paths.get(
                lessonFile.getFilePath()
        );

        Files.deleteIfExists(path);

        lessonFileRepository.delete(lessonFile);
    }
    public LessonFileResponseDto getFileInfo(
            Long fileId,
            String instructorEmail) {

        LessonFile lessonFile =
                lessonFileRepository
                        .findById(fileId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "File not found"
                                )
                        );

        if (!lessonFile.getLesson()
                .getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this file"
            );
        }

        return convertToResponse(lessonFile);
    }
}