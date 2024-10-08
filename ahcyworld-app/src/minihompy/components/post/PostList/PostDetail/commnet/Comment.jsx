import React, { useContext } from "react";
import {
  commentDeleteAxios,
  commentWriteAxios,
  contentState,
  showState,
} from "../../../utils/commentUtils";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../../../webpage/components/login/context/LoginContextProvider";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./Comment.style.css"

const Comment = () => {
  const { userInfo, roles, hompyInfo } = useContext(LoginContext);
  const { postId, postName, hompyId } = useParams();
  const dispatch = useDispatch();
  const commentList = useSelector((state) => state.comment.commentList);
  const show = useSelector((state) => state.comment.show);
  const content = useSelector((state) => state.comment.content);
  const post = useSelector((state) => state.post.post);
  const error = useSelector(state => state.comment.error)

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      commentWriteAxios(dispatch, userInfo, post, content, postName)
    }
  };


  return (
    <>
      <div className="postDetailCommentTool">
        <div  className="commentToggle">
          <Button className="commentToggle-btn" onClick={() => showState(dispatch, show)}>
            {show === false ? "댓글보기" : "댓글닫기"}
          </Button>
        </div>
        <div className="commentInputSection">
          <input
            value={content.content ? content.content :""}
            onChange={(e) => contentState(e.target.value, dispatch, post.id )}
            onKeyPress={(e) => activeEnter(e)}
            placeholder="댓글입력"
          />
          <Button
            className="commentwrite-btn"
            onClick={() =>
              commentWriteAxios(dispatch, userInfo, post, content, postName)
            }
          >
            등록
          </Button>
        </div>
      </div>
      
      {( error.postId=== post.id) && error.content && <div className="post-error-message">{error.content}</div>}
      {show && (
        <div className="postDetailCommentList">
          {commentList.count === 0
            ? <div className="commentNotFound">작성된 댓글이 없습니다.</div>
            : commentList.data?.map((item) => (
              <>
                <div className="postDetailComment">
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  {(item.user.id === userInfo.id || roles.isAdmin || hompyInfo.id === parseInt(hompyId)) && (
                    <Button
                    onClick={() =>
                      commentDeleteAxios(dispatch, item.id, postId, postName)
                    }
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </Button>
                  )}
                </div>
                  <p>{item.content}</p>
              </>
              ))}
        </div>
      )}
    </>
  );
};

export default Comment;
