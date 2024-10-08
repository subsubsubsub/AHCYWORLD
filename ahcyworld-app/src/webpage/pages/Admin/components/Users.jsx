import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../../components/login/context/LoginContextProvider";
import { hompyList, resetHompy, userList } from "../../../../apis/auth";
import "../css/Users.css";
import { RiHomeHeartLine } from "react-icons/ri";
import { Pagination } from "react-bootstrap";
import SendMessageModal from "./SendMessageModal";
import { IoIosSend } from "react-icons/io";
import * as Swal from "../../../../apis/alert";
import { BsSearch } from "react-icons/bs";
import { REACT_HOST } from "../../../../apis/api";

const Users = () => {
    const { isLogin, roles } = useContext(LoginContext);
    const [users, setUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortUserOrder, setSortUserOrder] = useState("desc");
    const [sortUserBy, setSortUserBy] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage] = useState(20);
    const [pageRange] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const getUserAndHompList = async () => {
            try {
                const userResponse = await userList();
                const userData = userResponse.data;

                const hompyResponse = await hompyList();
                const hompyData = hompyResponse.data;

                const updatedUsers = userData.map((user) => {
                    const userHompy = hompyData.find((hompy) => hompy.user.id === user.id);
                    return {
                        ...user,
                        hompyId: userHompy ? userHompy.id : "",
                    };
                });
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            } catch (error) {
                console.error("hompyList Error: ", error);
            }
        };

        getUserAndHompList();
    }, []);

    useEffect(() => {
        sortUsers(sortUserOrder, sortUserBy);
    }, [sortUserOrder, sortUserBy, filteredUsers]);

    const sortUsers = (order, by) => {
        const sorted = [...filteredUsers].sort((a, b) => {
            if (order === "asc") {
                return a[by] > b[by] ? 1 : -1;
            } else {
                return a[by] < b[by] ? 1 : -1;
            }
        });
        setSortedUsers(sorted); // 정렬된 목록을 상태에 저장
    };

    const handleSortOrderChange = (e) => {
        setSortUserOrder(e.target.value);
    };

    const handleSortBy = (e) => {
        setSortUserBy(e.target.value);
    };

    const resetMiniHompy = async (id) => {
        try {
            console.log(id);
            if (!id) return;

            Swal.confirm("홈페이지를 초기화 하시겠습니까?", "홈페이지를 초기화 합니다.", "warning", (result) => {
                if (result.isConfirmed) {
                    resetHompy(id);

                    Swal.alert("홈페이지 초기화 완료", "사용자목록으로 이동합니다.", "success");
                }
            });
        } catch (error) {
            console.error("resetHompy Error: ", error);
        }
    };

    const goMinihompy = (hompyId) => {
        window.open(
            `${REACT_HOST}/hompy/${hompyId}`,
            "_blank",
            "width=1700,height=825,menubar=no,toolbar=no,scrollbars=no,resizable=no"
        );
    };

    const openSendMessageModal = (user) => {
        setSelectedUser(user);
        setIsSendMessageModalOpen(true);
    };

    const closeSendMessageModal = () => {
        setSelectedUser(null);
        setIsSendMessageModalOpen(false);
    };

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    // 검색 버튼 클릭 시 필터링 적용
    const handleSearchClick = () => {
        const filteredData = users.filter((user) => user.username.includes(searchName.toUpperCase()));

        setFilteredUsers(filteredData);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    // 페이지네이션 로직
    const indexOfLastUser = currentPage * userPerPage;
    const indexOfFirstUser = indexOfLastUser - userPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(sortedUsers.length / userPerPage);

    // 현재 페이지를 기준으로 페이지 범위 계산
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    // 페이지 번호 배열 생성
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <div className='sort-search-box'>
                <div className='user-sort-controls'>
                    <label>
                        <input
                            type='radio'
                            name='sortUserBy'
                            value='id'
                            checked={sortUserBy === "id"}
                            onChange={handleSortBy}
                        />
                        &nbsp;최신순
                    </label>
                    <label style={{ fontWeight: "bold" }}>|</label>
                    <label>
                        <input
                            type='radio'
                            name='sortUserOrder'
                            value='desc'
                            checked={sortUserOrder === "desc"}
                            onChange={handleSortOrderChange}
                        />
                        &nbsp;내림차순
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='sortUserOrder'
                            value='asc'
                            checked={sortUserOrder === "asc"}
                            onChange={handleSortOrderChange}
                        />
                        &nbsp;오름차순
                    </label>
                </div>
                <div className='users-search-box'>
                    <input
                        type='text'
                        placeholder='Search by username'
                        value={searchName}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button type='button' onClick={handleSearchClick}>
                        <BsSearch />
                    </button>
                </div>
            </div>
            <table className='users-table'>
                <thead className='users-thead'>
                    <tr>
                        <th>id</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>생일</th>
                        <th>성별</th>
                        <th>도토리</th>
                        <th>가입날짜</th>
                        <th>미니홈피</th>
                        <th>메세지</th>
                    </tr>
                </thead>
                <tbody className='users-tbody'>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.birthDay}</td>
                                <td>{user.gender}</td>
                                <td>{user.acorn}</td>
                                <td>{user.createAt}</td>
                                <td className='hompy-btn-box'>
                                    <button className='minihompy-go' onClick={() => goMinihompy(user.hompyId)}>
                                        <RiHomeHeartLine />
                                    </button>
                                    <button className='reset-btn' onClick={() => resetMiniHompy(user.hompyId)}>
                                        reset
                                    </button>
                                </td>
                                <td className='message-btn-td'>
                                    <button className='message-btn' onClick={() => openSendMessageModal(user)}>
                                        <IoIosSend />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan='9'>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className='user-pagination-box'>
                <Pagination className='user-pagination'>
                    <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
            {isSendMessageModalOpen && selectedUser && (
                <SendMessageModal
                    isOpen={isSendMessageModalOpen}
                    onClose={closeSendMessageModal}
                    selectedUser={selectedUser}
                />
            )}
        </>
    );
};

export default Users;
