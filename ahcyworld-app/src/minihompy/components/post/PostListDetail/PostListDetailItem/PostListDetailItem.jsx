import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginContext } from "../../../../../webpage/components/login/context/LoginContextProvider";

import {
  detailListHandleOpen,
  photoAndVideoCommentListAxios,
  postDelete,
} from "../../utils/postUtils";

import Comment from "./PostListDetailItemComment/Comment";
import DetailModal from "./PostListDetailItemModal/DetailModal";
import DetailScrapModal from "./PostListDetailItemModal/DetailScrapModal";
import "./PostListDetailItem.style.css";

const PostListDetailItem = ({ item }) => {
  const { hompyInfo, userInfo } = useContext(LoginContext);
  const { postName, hompyId, folderId } = useParams();
  const [show, setShow] = useState({
    folderMove: false,
    scrapFolder: false,
  });
  const [commentShow, setCommentShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postId = item?.id;

  useEffect(() => {
    if(folderId){

      photoAndVideoCommentListAxios(dispatch, postId);
    }
  }, [folderId,postName,hompyId]);

  return (
    <div className="postDetailListItem">
      <div className="postDetailListItemHeader1">
        <span>작성번호 : {item.id}</span>
        <span>제목 : {item.subject}</span>
        {!(parseInt(hompyId) === hompyInfo?.id) && (
          <>
            <Button
              name="scrapPost"
              onClick={(e) =>
                detailListHandleOpen(
                  e,
                  setShow,
                  show,
                  dispatch,
                  hompyId,
                  postName
                )
              }
            >
              스크랩
            </Button>
          </>
        )}
        {parseInt(hompyId) === hompyInfo?.id && (
          <>
            <Button
              onClick={() =>
                navigate(
                  `/hompy/${hompyId}/${postName}/${folderId}/update/${postId}`
                )
              }
            >
              수정
            </Button>
            <Button
              name="folderMove"
              onClick={(e) =>
                detailListHandleOpen(
                  e,
                  setShow,
                  show,
                  dispatch,
                  hompyId,
                  postName
                )
              }
            >
              이동
            </Button>
            <Button
              onClick={() =>
                postDelete(
                  dispatch,
                  hompyId,
                  postName,
                  folderId,
                  postId,
                  navigate
                )
              }
            >
              삭제
            </Button>
          </>
        )}
      </div>
      <div className="postDetailListItemHeader2">
        <span>작성자 : {item.folder.hompy.user.name}</span>
        <span>스크랩 : {item.scrap}</span>
      </div>
      <div className="postDetailListItemDetail">
        {item.fileList.length > 0 && (
          <div className="postDetailListItemDetailImgAndPhoto">
            {item.fileList.map((fileItem, index) => {
              if (postName.includes("photo") && fileItem.image === true) {
                return (
                  <img
                    className="postDetailListItemDetailImg"
                    key={`photo-${fileItem.fileName}-${fileItem.id}`}
                    src={`http://localhost:8070/post/${fileItem.fileName}`}
                    alt={fileItem.fileName}
                  />
                );
              } else if (
                postName.includes("video") &&
                fileItem.video === true
              ) {
                return (
                  <video
                    key={`video-${fileItem.fileName}-${fileItem.id}`}
                    width="300"
                    controls
                    loop
                  >
                    <source
                      src={`http://localhost:8070/video/${fileItem.fileName}`}
                    />
                  </video>
                );
              }
              return null;
            })}
          </div>
        )}
        <span>{item.content}</span>
      </div>

      <Comment
        commentShow={commentShow}
        item={item}
        setCommentShow={setCommentShow}
      />

      {parseInt(hompyId) === hompyInfo?.id && (
        <DetailModal show={show.folderMove} setShow={setShow} postId={postId} />
      )}

      <DetailScrapModal show={show.scrapFolder} setShow={setShow} item={item} />
    </div>
  );
};

export default PostListDetailItem;
