import React, { useEffect } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import PageNation from "./PageNation";
import PostItem from "./PostItem";
import PostListDetailItem from "./PostListDetailItem";

const PostListDetail = ({ pageAndPostList, folder , setPage, folderList, moveFolderId, setMoveFolderId}) => {
  console.log("pageAndPostList first", pageAndPostList);
  console.log(
    "pageAndPostList second:",
    pageAndPostList?.posts
      ? pageAndPostList?.posts?.[0].folder.boardType.name
      : "게시물이 존재하지 않습니다."
  );

  const { postName, hompyId } = useParams();

  console.log("pageAndPostList third", folder);
  return (
    <>
      <Container>
        <div className="postListHeader">
          {folder[0] && <div>{folder[0].name}</div>}
          {folder[0] && (
            <div>
              <Button variant="none">
                {" "}
                <Link to={`/post/${hompyId}/${postName}/${folder[0].id}/write`}>
                {postName} 올리기
                </Link>
              </Button>
            </div>
          )}
        </div>
        <div>
            {pageAndPostList?.posts !=null ? (
              pageAndPostList?.posts?.map((item) => {
                return <PostListDetailItem item={item} folderList={folderList} moveFolderId={moveFolderId} setMoveFolderId={setMoveFolderId}/>;
              })
            ) : (
               <h4>게시물이 존재하지 않습니다.</h4>
            )}
        </div>
        <div>
          <PageNation pageAndPostList={pageAndPostList} setPage={setPage} />
        </div>
      </Container>
    </>
  );
};

export default PostListDetail;
