package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.BillDto;
import com.roommate.expensemanager.dto.OcrResponseDto;
import com.roommate.expensemanager.exception.RoomNotFoundException;
import com.roommate.expensemanager.exception.UserNotFoundException;
import com.roommate.expensemanager.model.*;
import com.roommate.expensemanager.repository.*;
import com.roommate.expensemanager.service.BillService;
import com.roommate.expensemanager.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {
    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;
    private final ItemCategoryRepository itemCategoryRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final FileStorageUtil fileStorageUtil;

    public BillServiceImpl(BillRepository billRepository, BillItemRepository billItemRepository, ItemCategoryRepository itemCategoryRepository, UserRepository userRepository, RoomRepository roomRepository, FileStorageUtil fileStorageUtil) {
        this.billRepository = billRepository;
        this.billItemRepository = billItemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.fileStorageUtil = fileStorageUtil;
    }

    @Override
    public String storeImage(MultipartFile file) {
        return fileStorageUtil.storeFile(file);
    }

    @Override
    public BillDto createBill(String imageUrl, Long roomId, String username) {
        Bill bill = new Bill();
        bill.setTitle("Uploaded Bill");
        bill.setReceiptImageUrl(imageUrl);
        bill.setStatus(BillStatus.PENDING);

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        if (!room.getMembers().contains(creator)) {
            throw new IllegalStateException("User is not a member of the room");
        }

        bill.setCreator(creator);
        bill.setRoom(room);
        bill = billRepository.save(bill);
        return BillDto.fromEntity(bill);
    }

    @Override
    public BillDto processOcrResult(Long billId, OcrResponseDto ocrResponse) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        bill.setStoreName(ocrResponse.getStoreName());
        bill.setPurchaseDate(LocalDate.parse(ocrResponse.getPurchaseDate()));
        bill.setTotalAmount(ocrResponse.getTotalAmount());
        bill.setStatus(BillStatus.PROCESSED);

        List<BillItem> items = new ArrayList<>();
        for (OcrResponseDto.OcrItemDto itemDto : ocrResponse.getItems()) {
            BillItem item = new BillItem();
            item.setName(itemDto.getName());
            item.setPrice(itemDto.getPrice());
            item.setQuantity(itemDto.getQuantity());
            item.setBill(bill);

            ItemCategory category = itemCategoryRepository.findByName(itemDto.getCategory())
                    .orElseGet(() -> {
                        ItemCategory newCategory = new ItemCategory();
                        newCategory.setName(itemDto.getCategory());
                        return itemCategoryRepository.save(newCategory);
                    });
            item.setCategory(category);

            items.add(item);
        }

        bill.setItems(items);
        bill = billRepository.save(bill);
        billItemRepository.saveAll(items);

        return BillDto.fromEntity(bill);
    }
}