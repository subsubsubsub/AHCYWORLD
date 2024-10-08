package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.Pagenation;
import com.lec.spring.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {
    @Value("10")
    private int WRITE_PAGE;

    @Value("15")
    private int PAGE_ROWS;

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Item save(Item item) {
        return itemRepository.saveAndFlush(item);
    }

    @Transactional
    public Item update(Item item) {
        Item updateItem = itemRepository.findById(item.getId()).orElse(null);
        if (updateItem == null) {
            return null;
        } else {
            return itemRepository.saveAndFlush(item);
        }
    }

    @Transactional(readOnly = true)
    public Pagenation list(Integer page, String url, String type, String searchItem) {
        Pagenation pagenation = new Pagenation();
        Page<Item> itemPage;
        String[] urlarr = url.split("/");

        //현재 페이지
        if (page == null || page < -1) page = 1;

        if (searchItem.equals("")) {
            if (urlarr[2].equals("admin")) {
                if (type.equals("all")) {
                    itemPage = itemRepository.findAll(PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));

                } else {
                    itemPage = itemRepository.findByItemType(type, PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));
                }
            } else {
                if (type.equals("all")) {
                    itemPage = itemRepository.findByStatus("visible", PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));

                } else {
                    itemPage = itemRepository.findByItemTypeAndStatus(type, "visible", PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));
                }
            }
        } else {
            if (type.equals("all")) {
                itemPage = itemRepository.findByItemNameContaining(searchItem, PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));
            } else {
                itemPage = itemRepository.findByItemNameContainingAndAndItemType(searchItem, type, PageRequest.of(page - 1, PAGE_ROWS, Sort.by(Sort.Order.desc("id"))));
            }
        }


        long cnt = itemPage.getTotalElements();
        int totalPage = itemPage.getTotalPages();

        int startPage = 0;
        int endPage = 0;

        List<Item> list = null;

        if (cnt > 0) {
            if (page > totalPage) page = totalPage;
            startPage = (((page - 1) / WRITE_PAGE) * WRITE_PAGE) + 1;
            endPage = startPage + WRITE_PAGE - 1;
            if (endPage >= totalPage) endPage = totalPage;

            list = itemPage.getContent();

        } else {
            page = 0;
        }

        return pagenation.builder()
                .cnt(cnt)
                .totalPage(totalPage)
                .writepages(WRITE_PAGE)
                .pagerows(PAGE_ROWS)
                .page(page)
                .startpage(startPage)
                .endpage(endPage)
                .items(list)
                .url(url)
                .build();
    }


    public boolean duplication(String itemName) {
        return itemRepository.existsItemByItemName(itemName);
    }
}
