package com.roommate.expensemanager.dto;

import com.roommate.expensemanager.model.BillStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal totalAmount;
    private String receiptImageUrl;
    private String storeName;
    private LocalDate purchaseDate;
    private BillStatus status;
    private Long roomId;
    private Long creatorId;
    private LocalDateTime createdAt;
    private List<BillItemDto> items;

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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getReceiptImageUrl() {
        return receiptImageUrl;
    }

    public void setReceiptImageUrl(String receiptImageUrl) {
        this.receiptImageUrl = receiptImageUrl;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<BillItemDto> getItems() {
        return items;
    }

    public void setItems(List<BillItemDto> items) {
        this.items = items;
    }

    public static BillDto fromEntity(com.roommate.expensemanager.model.Bill bill) {
        BillDto dto = new BillDto();
        dto.setId(bill.getId());
        dto.setTitle(bill.getTitle());
        dto.setDescription(bill.getDescription());
        dto.setTotalAmount(bill.getTotalAmount());
        dto.setReceiptImageUrl(bill.getReceiptImageUrl());
        dto.setStoreName(bill.getStoreName());
        dto.setPurchaseDate(bill.getPurchaseDate());
        dto.setStatus(bill.getStatus());
        dto.setRoomId(bill.getRoom().getId());
        dto.setCreatorId(bill.getCreator().getId());
        dto.setCreatedAt(bill.getCreatedAt());
        if (bill.getItems() != null) {
            dto.setItems(bill.getItems().stream()
                    .map(BillItemDto::fromEntity)
                    .toList());
        }
        return dto;
    }
}

@Data
class BillItemDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Long categoryId;

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public static BillItemDto fromEntity(com.roommate.expensemanager.model.BillItem item) {
        BillItemDto dto = new BillItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setCategoryId(item.getCategory().getId());
        return dto;
    }
}