import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import { axiosPostList } from "./utils/postUtils";
import { findByHompyIdAxios } from "./utils/hompyUtils";
import { list } from "./utils/FolderUtils";
import * as Swal from "../../../apis/alert"
import { CommentAction } from "../../../redux/actions/CommentAction";
import { PostAction } from "../../../redux/actions/PostAction";
import { hompyInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const keyword =['board','photo','video'];

const Post = () => {
  const { hompyId, postName, folderId } = useParams();
  const {hompyInfo, roles} = useContext(LoginContext)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folder = useSelector((state) => state.folder.folder);
  const hompy = useSelector((state) => state.hompy.hompy);
  const page = useSelector((state) => state.post.page);
  const photoVisibleCheck = (hompyInfo.menuStatus.split(',')[0] === 'visible' || roles.isAdmin) && postName.includes('photo')
  const boardVisibleCheck = (hompyInfo.menuStatus.split(',')[1] === 'visible' || roles.isAdmin) && postName.includes('board') 
  const videoVisibleCheck = (hompyInfo.menuStatus.split(',')[2] === 'visible' || roles.isAdmin) && postName.includes('video') 

  useEffect(() => {
    if(keyword.some(item => postName.includes(item)) && hompyInfo.id !== undefined){
      list(postName, dispatch, hompyId,navigate);
      findByHompyIdAxios(dispatch, hompyId);
      dispatch(CommentAction.contentState(false,""));
      dispatch(CommentAction.contentErrorState("content",false))
    }

  }, [postName, hompyId, dispatch]);

  useEffect( () => {
    if ((folder || folder?.length > 0 ) && hompyInfo.id !== undefined) {
      try{
        axiosPostList(dispatch, folderId, hompyId, postName, page, navigate);
        dispatch(CommentAction.contentState(false,""));
        dispatch(CommentAction.contentErrorState("content",false))
        dispatch(PostAction.postErrorState("subject",false))
        dispatch(PostAction.postErrorState("content",false))
        navigate(`/hompy/${hompyId}/${postName}/${folder?.id}`);
      }catch(e){
        Swal.alert("게시글을 불러오는데 실패했습니다.",e,"error");
      }
    }
  }, [page, folder?.id,folderId]);  


  return (
    <>
    {(photoVisibleCheck || boardVisibleCheck || videoVisibleCheck) && 
      <Layout hompy={hompy} user={hompy.user}>
        <Outlet />
      </Layout> || Swal.alert('잘못된 접근입니다.','메인페이지로 돌아갑니다.',"error",navigate('/'))
    }
    </>
  );
};

export default Post;
