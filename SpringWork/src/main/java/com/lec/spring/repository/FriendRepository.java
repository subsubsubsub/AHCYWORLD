package com.lec.spring.repository;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    Optional<Friend> findByUserAndFriendUser(User user, User friendUser);
    boolean existsByUserAndFriendUserAndFriendStatus(User user, User friendUser, String friendStatus);
    List<Friend> findByUserId(Long userId);
    Friend findByUserIdAndFriendUserId(Long userId, Long friendUserId);

    Friend findByFriendUserIdAndUserId(Long friendUserId, Long userId);
    List<Friend> findByUserIdAndFriendStatus(Long userId, String status);

}

