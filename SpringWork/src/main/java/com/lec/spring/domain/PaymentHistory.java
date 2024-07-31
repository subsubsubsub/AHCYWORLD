package com.lec.spring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PaymentHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @Column(nullable = false)
    private User user;          // 유저 아이디

    @ManyToOne
    @Column(nullable = true)
    private User friendUser;    // 친구 아이디(null 허용)

    @Column(nullable = false)
    private String merchantUid;     // 결제번호

    @Column(nullable = false)
    private String impUid;          // 주문고유번호

    @Column(nullable = false)
    private Long payment;           // 결제금액

    @Column(nullable = false)
    private Long acornCnt;          // 도토리 개수
}
