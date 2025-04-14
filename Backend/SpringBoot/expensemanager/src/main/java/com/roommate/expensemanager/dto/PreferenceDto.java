package com.roommate.expensemanager.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PreferenceDto {
    private Long id;
    private Long itemCategoryId;
    private String itemCategoryName;
    private Float preferenceScore;
    private Integer usageCount;
    private LocalDateTime lastUpdated;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemCategoryId() {
        return itemCategoryId;
    }

    public void setItemCategoryId(Long itemCategoryId) {
        this.itemCategoryId = itemCategoryId;
    }

    public String getItemCategoryName() {
        return itemCategoryName;
    }

    public void setItemCategoryName(String itemCategoryName) {
        this.itemCategoryName = itemCategoryName;
    }

    public Float getPreferenceScore() {
        return preferenceScore;
    }

    public void setPreferenceScore(Float preferenceScore) {
        this.preferenceScore = preferenceScore;
    }

    public Integer getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public static PreferenceDto fromEntity(com.roommate.expensemanager.model.Preference preference) {
        PreferenceDto dto = new PreferenceDto();
        dto.setId(preference.getId());
        dto.setItemCategoryId(preference.getItemCategory().getId());
        dto.setItemCategoryName(preference.getItemCategory().getName());
        dto.setPreferenceScore(preference.getPreferenceScore());
        dto.setUsageCount(preference.getUsageCount());
        dto.setLastUpdated(preference.getLastUpdated());
        return dto;
    }
}