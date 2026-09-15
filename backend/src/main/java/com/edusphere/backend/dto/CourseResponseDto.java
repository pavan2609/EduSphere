package com.edusphere.backend.dto;

public class CourseResponseDto {

    private Long id;
    private String title;
    private String description;
    private String status;
    private Long instructorId;
    private String instructorName;
    private Integer maxSeats;
    
    public Integer getMaxSeats() {
		return maxSeats;
	}

	public void setMaxSeats(Integer maxSeats) {
		this.maxSeats = maxSeats;
	}

	public CourseResponseDto() {
    }

    public CourseResponseDto(
            Long id,
            String title,
            String description,
            String status,
            Long instructorId,
            String instructorName, 
            Integer maxSeats) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        this.maxSeats = maxSeats;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }
}