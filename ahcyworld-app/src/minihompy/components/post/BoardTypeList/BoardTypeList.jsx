import React, { useContext, useEffect, useMemo } from "react";
import "./BoardTypeList.style.css";
import { Button, ListGroup, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider" 
import Folder  from "./Folder/Folder";
import FolderModal from "./Folder/FolderModal/FolderModal";
import { folderDelete, handleShow } from "../utils/FolderUtils";
import { hompyFriendListAxios } from "../utils/FriendUtils";

const BoardTypeList = () => {
  const { postName, hompyId } = useParams();
  const { hompyInfo, userInfo, roles } = useContext(LoginContext);
  const dispatch = useDispatch();
  const username = useSelector((state) => state.hompy.hompy.user?.username);
  const folderList = useSelector((state) => state.folder.folderList);
  const hompyFriendList = useSelector((state) =>
    state.friend.hompyFriendList.map((item) => {
      return item.friendUser?.id;
    })
  );
  const folder = useSelector((state) => state.folder.folder);
  const BoardTypeName = useMemo(()=> folderList?.[0]?.boardType.name,[folderList]) ;


  useEffect(() => {
    hompyFriendListAxios(username, dispatch);
  }, [username]);

  return (
    <>
      <Container>
        <div className="board-type-name">
          <h2>{BoardTypeName}</h2>
        </div>
        
        <ListGroup className="board-type-list-group">
          {folderList &&
            folderList.map((item) =>{
              const itemStatusCheck = (item.status === "전체공개") || (item.status === "일촌공개" &&
              (parseInt(hompyId) === hompyInfo.id || roles.isAdmin ||
              hompyFriendList.some(
                  (item) => parseInt(item) === parseInt(userInfo.id)
                )))|| (item.status === "비공개" && (roles.isAdmin ||
                  parseInt(hompyId) === hompyInfo.id))
             return (
                itemStatusCheck && <Folder key={item.id} item={item} />
              )
          })}
        </ListGroup>

        {(parseInt(hompyId) === hompyInfo?.id || roles.isAdmin) && (
          <div className="board-type-folder">
            {parseInt(hompyId) === hompyInfo?.id &&
            
            <Button className="diarywriteok-btn" variant="none" onClick={(e) => handleShow(e, dispatch)} value="폴더 생성">
              추가
            </Button>
            }

            <Button
              className="diarywriteno-btn"
              variant="none"
              onClick={() =>
                folderDelete(dispatch, hompyId, postName, folder?.id)
              }
            >
              삭제
            </Button>
          </div>
        )}
      </Container>
      {parseInt(hompyId) === hompyInfo?.id && (
        <>
          <FolderModal />
        </>
      )}
    </>
  );
};
export default BoardTypeList;
