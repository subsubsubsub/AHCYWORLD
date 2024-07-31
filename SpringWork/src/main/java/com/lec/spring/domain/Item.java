package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;    // 상품이름

    @Column(nullable = false)
    private String itemType;    // 상품타입

    @Column(nullable = false)
    private String sourceName;  // 원본명

    @Column(nullable = false)
    private String fileName;    // 저장명

    @ColumnDefault(value = "0")
    private Long price;         // 도토리 가격

    @ColumnDefault(value = "show")
    private String status;      // 상품 'show','hidden' 상태

    private String bgmImg;      // 노래 이미지
}
