package com.edusphere.backend.dto;

public class LessonFileResponseDto {

    private Long id;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private Long lessonId;

    public LessonFileResponseDto() {
    }

    public LessonFileResponseDto(
            Long id,
            String originalFileName,
            String fileType,
            Long fileSize,
            Long lessonId) {

        this.id = id;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.lessonId = lessonId;
    }

    public Long getId() {
        return id;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public String getFileType() {
        return fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public Long getLessonId() {
        return lessonId;
    }
}