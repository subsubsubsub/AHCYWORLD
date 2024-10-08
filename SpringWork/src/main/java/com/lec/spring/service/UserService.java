package com.lec.spring.service;

import com.lec.spring.domain.*;
import com.lec.spring.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HompyRepository hompyRepository;
    private final BoardTypeRepository boardTypeRepository;
    private final FolderRepository folderRepository;

    private final EmailAuthenticationRepository emailAuthenticationRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, HompyRepository hompyRepository, BoardTypeRepository boardTypeRepository, FolderRepository folderRepository, EmailAuthenticationRepository emailAuthenticationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.hompyRepository = hompyRepository;
        this.boardTypeRepository = boardTypeRepository;
        this.folderRepository = folderRepository;
        this.emailAuthenticationRepository = emailAuthenticationRepository;
    }

    // 특정 ID로 User 조회
    public Optional<User> findByUserId(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User join(User user, String provider) {

        String username = user.getUsername();
        String password = user.getPassword();
        String email = user.getEmail();
        String name = user.getName();
        String gender = user.getGender();
        LocalDate birthDay = user.getBirthDay();

        if (provider == null) {
            EmailAuthentication emailAuthentication = emailAuthenticationRepository.findByEmail(email).orElse(null);
            boolean authCheck = emailAuthentication != null && emailAuthentication.getStatus().equals("인증완료");

            if (authCheck) {
                emailAuthenticationRepository.delete(emailAuthentication);
            } else {
                return null;
            }
        }

        if (userRepository.existsByUsername(username)) {
            return null;
        }

        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email.toLowerCase());
        user.setName(name);
        user.setGender(gender);
        user.setBirthDay(birthDay);
        user.setRole("ROLE_MEMBER");

        User savedUser = userRepository.save(user);

        Hompy hompy = Hompy.builder()
                .user(savedUser)
                .title(name + "님의 미니홈피")
                .menuColor("#147DAF")
                .menuText("#FFF")
                .menuBorder("#000000")
                .menuStatus("visible,visible,visible,visible")
                .build();

        hompyRepository.save(hompy);

        // 기본폴더 추가.
        List<BoardType> boardTypes = boardTypeRepository.findAll();
        for (BoardType boardType : boardTypes) {
            Folder folder = new Folder();
            folder.baseFolder(hompy,boardType);
            folderRepository.save(folder);
        }

//        System.out.println("hompy만들었지롱~ " + hompy);
        return savedUser;
    }


    public User findByUsername(String username) {
        return userRepository.findByUsername(username.toUpperCase());
    }

    public boolean usernameAvailable(String username) {
        return !userRepository.existsByUsername(username.toUpperCase());
    }

    public boolean emailAvailable(String email) {
        return !userRepository.existsByEmail(email.toUpperCase());
    }

    public List<User> list() {
        return userRepository.findAll();
    }

    public String OAuthAddInfo(String username, String gender, String birthday) {
        User user = userRepository.findByUsername(username);
        Hompy hompy = hompyRepository.findByUser(user);

        LocalDate birthDay = LocalDate.parse(birthday);

        if (user != null) {
            user.setBirthDay(birthDay);
            user.setGender(gender);
            userRepository.saveAndFlush(user);
            if (gender.equals("MALE")) {
                hompy.setMinimiPicture("male.png");
            } else {
                hompy.setMinimiPicture("female.png");
            }
            hompyRepository.saveAndFlush(hompy);
            return "ok";
        }

        return "ok";

    }

    @Transactional
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User update(User user) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저정보 찾기 실패"));

        existingUser.setName(user.getName());
        existingUser.setGender(user.getGender());
        if(user.getGender().equals(existingUser.getGender())){
            Hompy hompy = hompyRepository.findByUser(existingUser);
            if(hompy.getMinimiPicture().equals("male.png") || hompy.getMinimiPicture().equals("female.png")){
                hompy.setMinimiPicture(user.getGender().toLowerCase()+".png");
            }
        }
        existingUser.setBirthDay(user.getBirthDay());
        existingUser.setPassword(user.getPassword());

        return userRepository.save(existingUser);
    }


}
