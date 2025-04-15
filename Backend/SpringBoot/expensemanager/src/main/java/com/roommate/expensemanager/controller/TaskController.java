package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.TaskDto;
import com.roommate.expensemanager.model.Room;
import com.roommate.expensemanager.model.Task;
import com.roommate.expensemanager.repository.RoomRepository;
import com.roommate.expensemanager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final RoomRepository roomRepository;

    public TaskController(TaskRepository taskRepository, RoomRepository roomRepository) {
        this.taskRepository = taskRepository;
        this.roomRepository = roomRepository;
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto) {
        Room room = roomRepository.findById(taskDto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        Task task = new Task();
        task.setName(taskDto.getName());
        task.setDueDateTime(taskDto.getDueDateTime());
        task.setPriority(taskDto.getPriority());
        task.setCompleted(false);
        task.setRoom(room);
        task.setAssignedUserIds(taskDto.getAssignedUserIds());
        task = taskRepository.save(task);
        return ResponseEntity.ok(TaskDto.fromEntity(task));
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks(@RequestParam Long roomId) {
        return ResponseEntity.ok(
                taskRepository.findByRoomId(roomId).stream()
                        .map(TaskDto::fromEntity)
                        .collect(Collectors.toList())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTaskCompletion(
            @PathVariable Long id,
            @RequestBody TaskDto taskDto
    ) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        task.setCompleted(taskDto.isCompleted());
        task = taskRepository.save(task);
        return ResponseEntity.ok(TaskDto.fromEntity(task));
    }
}