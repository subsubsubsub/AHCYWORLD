import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/CalendarStyles.css";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DiaryModal from "./DiaryModal";
import { SERVER_HOST } from "../../../apis/api";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider";
import Layout from "../Layout/Layout";

const DiaryHome = () => {
    const curDate = new Date();
    const [value, onChange] = useState(curDate); // 클릭한 날짜(초기값으로는 현재 날짜)
    // diary에 있는 값
    const [dayList, setDayList] = useState([]);

    // 다이어리 가져오는 값
    // const [showDiaryForm, setShowDiaryForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryContent, setDiaryContent] = useState(null);
    const navigate = useNavigate();
    const { hompyInfo, userInfo } = useContext(LoginContext);

    // 로딩시 초기
    useEffect(() => {
        axios({
            method: "get",
            url: `${SERVER_HOST}/cyworld/cy/diaries/list`,
        })
            .then((response) => {
                const diaries = response.data;
                // console.log("diaries:", diaries);
                const formattedDates = diaries.map((diary) => {
                    // console.log("diaryEvenDate : ", diary.eventDate);
                    const localDate = moment(new Date(diary.eventDate)).format(
                        "YYYY-MM-DD"
                    );
                    // console.log("localDate : ", localDate);
                    return localDate;
                });
                setDayList(formattedDates);
                // console.log("formattedDates: ", formattedDates);
            })
            .catch((error) => {
                console.error("diary 없음...", error);
            });
    }, []);

    // 현재시간의 월
    const monthOfActiveDate = moment(value).format("YYYY-MM");
    const [activeMonth, setActiveMonth] = useState(monthOfActiveDate); // 초기값으로 현재의 달을 넣어줌

    // 받아오는 인자(activeStartDate)에 따라 현재 보여지는 달(activeMonth)의 State를 변경
    const getActiveMonth = (activeStartDate) => {
        const newActiveMonth = moment(activeStartDate).format("YYYY-MM");
        setActiveMonth(newActiveMonth);
    };

    // 각 날짜 타일에 컨텐츠 추가
    const addContent = ({ date, view }) => {
        if (view !== "month") {
            return null;
        }

        const formattedDate = moment(date).format("YYYY-MM-DD");
        // console.log(`Checking date: ${formattedDate}`);

        // date(각 날짜)가 리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘)을 추가
        if (dayList.includes(formattedDate)) {
            console.log(`Adding content for date: ${formattedDate}`);
            return <div key={formattedDate}>⭐️</div>;
        } else {
            console.log(`Date ${formattedDate} not in dayList`);
        }
        return null;
    };

    // 날짜 클릭 핸들러
    const handleDateClick = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setSelectedDate(formattedDate);

        axios
            .get(
                `${SERVER_HOST}/cyworld/cy/diaries/detail-by-date/${formattedDate}`
            )
            .then((response) => {
                setDiaryContent(response.data);
                setShowModal(true);
                console.log("responseData:", response.data);
            })
            .catch((error) => {
                setDiaryContent(null);
                setShowModal(true);
                console.error(
                    "다이어리 내용을 가져오는데 실패 했습니다.",
                    error
                );
            });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDiaryContent(null);
    };

    const handleWriteClick = () => {
        navigate("/write");
    };

    return (
        <>
            <Layout hompy={hompyInfo} user={hompyInfo.user}>
            <div className="calendar-container">
                <Calendar
                    locale="en-US"
                    onChange={onChange}
                    value={value}
                    next2AriaLabel={null} // 년 단위로 이동 버튼
                    prev2AriaLabel={null} // 년 단위로 이동 버튼
                    formatDay={(locale, date) => moment(date).format("D")} // 날짜형태 바꾸는 함수
                    tileContent={addContent} // 날짜 칸에 보여지는 콘텐츠
                    showNeighboringMonth={false} // 앞 뒤 달의 이어지는 날짜 보여주기 여부
                    onActiveStartDateChange={(
                        { activeStartDate } // 활성화된 (현재 보여지는) 년, 월, 일이 변경될 때마다 실행
                    ) => getActiveMonth(activeStartDate)}
                    onClickDay={handleDateClick} // 날짜 클릭 시 핸들러
                />
                <DiaryModal
                    show={showModal}
                    onHide={handleCloseModal}
                    selectedDate={selectedDate}
                    diaryContent={diaryContent}
                    onWriteClick={handleWriteClick}
                    />
            </div>
            </Layout>
        </>
    );
};

export default DiaryHome;
