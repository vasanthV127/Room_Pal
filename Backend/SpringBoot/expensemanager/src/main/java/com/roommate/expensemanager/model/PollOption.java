package com.roommate.expensemanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class PollOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    private PurchasePoll poll;

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

    public PurchasePoll getPoll() {
        return poll;
    }

    public void setPoll(PurchasePoll poll) {
        this.poll = poll;
    }
}