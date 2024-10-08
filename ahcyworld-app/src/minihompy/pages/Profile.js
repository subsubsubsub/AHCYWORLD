import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "./css/Profile.css";
import { LoginContext } from "../../webpage/components/login/context/LoginContextProvider";
import { hompyInfo } from "../../apis/auth";
import { SERVER_HOST } from "../../apis/api";
import { useDispatch } from "react-redux";
import { HompyAction } from "../../redux/actions/HompyAction";

const Profile = () => {
  const { hompyId } = useParams();
  const [hompy, setHompy] = useState({});
  const [profile, setProfile] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true); // CKEditor의 읽기 전용 상태 관리
  const [buttonLabel, setButtonLabel] = useState("프로필 수정"); // 버튼 라벨 관리
  const { userInfo, hompyInfo } = useContext(LoginContext);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${SERVER_HOST}/hompy/${hompyId}`)
      .then((response) => {
        setHompy(response.data);
        setProfile(response.data.profile || "");
      })
      .catch((error) => {
        console.error("에러: 프로필을 가져 올 수 없음", error);
      });
      
      if(hompyId){
        dispatch(HompyAction.findByHompyIdAxios(hompyId))
      }
  }, [hompyId, buttonLabel]);

  const handleProfileUpdate = async () => {
    if (isReadOnly) {
      // 읽기 전용 상태 -> 편집 가능 상태로 전환
      setIsReadOnly(false);
      setButtonLabel("수정완료");
    } else {
      // 편집 가능 상태 -> 읽기 전용 상태로 전환 및 프로필 업데이트
      try {
        const response = await axios.post(
          `${SERVER_HOST}/hompy/${hompyId}/profile`,
          { profile: profile },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        Swal.fire({
          title: "프로필이 업데이트되었습니다!",
          icon: "success",
          confirmButtonText: "확인",
        });
        setProfile(response.data.profile);
        setIsReadOnly(true); // 에디터를 다시 읽기 전용으로 전환
        setButtonLabel("수정하기"); // 버튼 라벨을 "수정하기"로 설정
      } catch (error) {
        console.error("프로필 업데이트 중 오류 발생:", error);
        Swal.fire({
          title: "프로필 업데이트 중 오류 발생!",
          text: error.message,
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }
  };

  return (
    <>
      <div className="profile-container">
        
        {isReadOnly && <CKEditor
          editor={ClassicEditor}
          config={{toolbar:[]}}
          data={profile}
          disabled={isReadOnly} // CKEditor의 읽기 전용 상태 설정
          onChange={(event, editor) => {
            const data = editor.getData();
            setProfile(data);
          }}
        />}

        {isReadOnly === false &&
        <CKEditor
        editor={ClassicEditor}
        data={profile}
        disabled={isReadOnly} // CKEditor의 읽기 전용 상태 설정
        onChange={(event, editor) => {
          const data = editor.getData();
          setProfile(data);
        }}
      />}

        {parseInt(hompyInfo.id) === parseInt(hompyId) && (
          <div className="button-container">
            <button className="profile-btn" onClick={handleProfileUpdate}>
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
