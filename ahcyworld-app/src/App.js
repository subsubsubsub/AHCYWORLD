import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import Header from "./webpage/components/Header/Header";
import Home from "./webpage/pages/Home";
import Hompy from "./minihompy/pages/Hompy";
import Login from "./webpage/pages/Login";
import Join from "./webpage/pages/Join";
import Member from "./webpage/pages/Member";
import Admin from "./webpage/pages/Admin";
import Menu from "./minihompy/components/menu/Menu";
import GuestBookHome from "./minihompy/components/guestBook/GuestBookHome";
import DiaryHome from "./minihompy/components/diary/DiaryHome";
import { useContext, useEffect, useState } from "react";
import Profile from "./minihompy/pages/Profile";
import { LoginContext } from "./webpage/login/context/LoginContextProvider";
import { useDispatch, useSelector } from "react-redux";
import Post from "./minihompy/components/post/Post";
import PostListDetail from "./minihompy/components/post/PostListDetail/PostListDetail";
import PostWrite from "./minihompy/components/post/PostWrite/PostWrite";
import PostUpdate from "./minihompy/components/post/PostUpdate/PostUpdate";
import PostList from "./minihompy/components/post/PostList/PostList";
import PostDetail from "./minihompy/components/post/PostList/PostDetail/PostDetail";
import Layout from "./minihompy/components/Layout/Layout";

function App() {
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const { userInfo, hompyInfo } = useContext(LoginContext);
  const folder = useSelector((state) => state.folder.folder);

  return (
    <div>
      {/* 1. 웹페이지 해당 라우트 각 상위페이지 에서 <OUTLET/> 적용-> 자손들을 보여주는기능. */}
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="join" element={<Join />} />
          <Route path="member" element={<Member />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        {/* 2. 미니홈피 페이지 */}
        {hompyInfo && (
          <Route path="/hompy/:hompyId" >
            <Route index element={<Hompy />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="guestbook"
              element={<GuestBookHome setUserId={setUserId} />}
            />
            <Route path=":postName" element={<Post page={page} />}>
              <Route
                path=":folderId"
                element={
                  folder && folder.boardType?.name.includes("게시판") ? (
                    <PostList />
                  ) : (
                    <PostListDetail setPage={setPage} />
                  )
                }
              />
              <Route path=":folderId/detail/:postId" element={<PostDetail />} />
              <Route path=":folderId/write" element={<PostWrite />} />
              <Route path=":folderId/update/:postId" element={<PostUpdate />} />
            </Route>
            <Route path="diary" element={<DiaryHome setUserId={setUserId} />} />
          </Route>
        )}
        {/* 3. 어드민 페이지 */}
        <Route></Route>
      </Routes>
    </div>
  );
}

export default App;
