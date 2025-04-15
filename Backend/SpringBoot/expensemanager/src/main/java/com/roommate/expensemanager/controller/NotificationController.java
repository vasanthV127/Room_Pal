package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.NotificationDto;
import com.roommate.expensemanager.model.Notification;
import com.roommate.expensemanager.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setMessage(notificationDto.getMessage());
        notification.setUserId(notificationDto.getUserId());
        notification.setCreatedAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);
        return ResponseEntity.ok(NotificationDto.fromEntity(notification));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(
                notificationRepository.findByUserId(userId).stream()
                        .map(NotificationDto::fromEntity)
                        .collect(Collectors.toList())
        );
    }
}