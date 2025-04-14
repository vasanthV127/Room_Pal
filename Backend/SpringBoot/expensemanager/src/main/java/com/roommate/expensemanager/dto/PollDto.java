package com.roommate.expensemanager.dto;

import com.roommate.expensemanager.model.PollStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PollDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime endDate;
    private PollStatus status;
    private Long creatorId;
    private Long roomId;
    private LocalDateTime createdAt;
    private List<PollOptionDto> options;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public PollStatus getStatus() {
        return status;
    }

    public void setStatus(PollStatus status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<PollOptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<PollOptionDto> options) {
        this.options = options;
    }

    public static PollDto fromEntity(com.roommate.expensemanager.model.PurchasePoll poll) {
        PollDto dto = new PollDto();
        dto.setId(poll.getId());
        dto.setTitle(poll.getTitle());
        dto.setDescription(poll.getDescription());
        dto.setEndDate(poll.getEndDate());
        dto.setStatus(poll.getStatus());
        dto.setCreatorId(poll.getCreator().getId());
        dto.setRoomId(poll.getRoom().getId());
        dto.setCreatedAt(poll.getCreatedAt());
        if (poll.getOptions() != null) {
            dto.setOptions(poll.getOptions().stream()
                    .map(PollOptionDto::fromEntity)
                    .toList());
        }
        return dto;
    }
}

@Data
class PollOptionDto {
    private Long id;
    private String name;
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static PollOptionDto fromEntity(com.roommate.expensemanager.model.PollOption option) {
        PollOptionDto dto = new PollOptionDto();
        dto.setId(option.getId());
        dto.setName(option.getName());
        dto.setDescription(option.getDescription());
        return dto;
    }
}