import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import Admin from "./webpage/pages/Admin/Admin";
import Header from "./webpage/components/Header/Header";
import Hompy from "./minihompy/pages/Hompy";
import Join from "./webpage/pages/Join";
import Member from "./webpage/pages/Member";
import Menu from "./minihompy/components/menu/Menu";
import GuestBookHome from "./minihompy/components/guestBook/GuestBookHome";
import DiaryHome from "./minihompy/components/diary/DiaryHome";
import { useContext, useEffect, useState } from "react";
import Profile from "./minihompy/pages/Profile";
import Post from "./minihompy/components/post/Post";
import PostListDetail from "./minihompy/components/post/PostListDetail/PostListDetail";
import PostWrite from "./minihompy/components/post/PostWrite/PostWrite";
import PostUpdate from "./minihompy/components/post/PostUpdate/PostUpdate";
import PostList from "./minihompy/components/post/PostList/PostList";
import PostDetail from "./minihompy/components/post/PostList/PostDetail/PostDetail";

import HompySetting from "./minihompy/pages/HompySetting";
import Cart from "./webpage/pages/Cart";
import { useSelector } from "react-redux";
import DiaryModal from "./minihompy/components/diary/DiaryModal";
import DiaryUpdatePage from "./minihompy/components/diary/DiaryUpdatePage";
import DiaryWritePage from "./minihompy/components/diary/DiaryWritePage";
import Home from "./webpage/pages/Home";
import { LoginContext } from "./webpage/components/login/context/LoginContextProvider";
import Item from "./webpage/pages/Item";
import PaymentHistory from "./webpage/components/paymentHistory/PaymentHistory";
// import OAuth2AddInfo from "./webpage/components/login/Login/OAuth2AddInfo";



function App() {
  const [itemkind, setItemKind] = useState('all');
  const [userId, setUserId] = useState(null);
  const { userInfo, hompyInfo } = useContext(LoginContext);
  const folder = useSelector((state) => state.folder.folder);

    return (
        <div>
            {/* 1. 웹페이지 해당 라우트 각 상위페이지 에서 <OUTLET/> 적용-> 자손들을 보여주는기능. */}
            <Routes>
                <Route path='/' element={<Header setItemKind={setItemKind} />}>
                    <Route index element={<Home itemkind={itemkind} />} />
                    {/* <Route path='addinfo' element={<OAuth2AddInfo />} /> */}
                    <Route path='join' element={<Join />} />
                    <Route path='member' element={<Member />} />
                    <Route path='cart/:userId' element={<Cart />} />
                    <Route path='item' element={<Item itemkind={itemkind} />} />
                </Route>

                {/* 2. 미니홈피 페이지 */}
                {hompyInfo && (
                    <Route path="/hompy/:hompyId" >
                        <Route index element={<Hompy />} />
                        <Route path="profile" element={<Profile />} />
                        <Route
                            path="guestbook"
                            element={<GuestBookHome />}
                        />
                        <Route path=":postName" element={<Post />}>
                            <Route
                                path=":folderId"
                                element={
                                    folder && folder.boardType?.name.includes("게시판") ? (
                                        <PostList />
                                    ) : (
                                        <PostListDetail />
                                    )
                                }
                            />
                            <Route path=":folderId/detail/:postId" element={<PostDetail />} />
                            <Route path=":folderId/write" element={<PostWrite />} />
                            <Route path=":folderId/update/:postId" element={<PostUpdate />} />
                        </Route>
                        <Route path="diary" element={<DiaryHome setUserId={setUserId} />}/>
                        <Route path="diary/write" element={<DiaryWritePage setUserId={setUserId} />}/>
                        <Route path="diary/update/:id" element={<DiaryUpdatePage setUserId={setUserId} />}/>
                        <Route path="setting" element={<HompySetting setUserId={setUserId}/>}/>
                    </Route>
                )}
                {/* 3. 어드민 페이지 */}
                <Route>
                    {/* <Route path='admin/login' element={<AdminLoginForm />} /> */}
                    <Route path='/admin' element={<Admin />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
