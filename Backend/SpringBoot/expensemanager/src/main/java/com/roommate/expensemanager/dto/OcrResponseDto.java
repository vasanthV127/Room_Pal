package com.roommate.expensemanager.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OcrResponseDto {
    private String storeName;
    private String purchaseDate;
    private BigDecimal totalAmount;
    private List<OcrItemDto> items;

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OcrItemDto> getItems() {
        return items;
    }

    public void setItems(List<OcrItemDto> items) {
        this.items = items;
    }

    @Data
    public static class OcrItemDto {
        private String name;
        private BigDecimal price;
        private Integer quantity;
        private String category;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
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

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}