import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import "../css/ItemList.css";
import ItemPagination from "./ItemPagination";
import * as Swal from "../../../apis/alert";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginContext } from "../../components/login/context/LoginContextProvider";
import acorn from "../../../upload/acorn.png"

const ItemList = (props) => {
    const [items, setItems] = useState([]);
    const [userItems, setUserItems] = useState([]);
    const [usetCartItems, setUserCartItems] = useState([]);
    const [pageData, setPageData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { userInfo } = useContext(LoginContext)
    const [isAddItem, setIsAddItem] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const type = props.itemkind;
                let firstpage = 0;
                if (localStorage.getItem("currentType") === type) {
                    firstpage = currentPage;
                } else {
                    firstpage = 1;
                    setCurrentPage(1);
                }
                const itemResponse = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/item/${type}`,
                    params: { page: firstpage },
                });
                if (userInfo) {

                    const userItemsResponse = await axios({
                        method: "GET",
                        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
                    });
                    const useritems = [];
                    (userItemsResponse.data).forEach(item => { useritems.push(item.item.id) });
                    setUserItems(useritems);


                    const userCartItemResponse = await axios({
                        method: 'GET',
                        url: `${SERVER_HOST}/cart/${userInfo.id}/cartitems`,
                    });
                    const CartItems = [];
                    (userCartItemResponse.data).forEach(item => CartItems.push(item.item.id));
                    setUserCartItems(CartItems);

                }

                const { status } = itemResponse;
                const items = itemResponse.data.items;
                localStorage.setItem("currentType", type);
                if (status === 200) {
                    const threeItems = [];
                    for (let i = 0; i < [...items].length; i += 3) {
                        threeItems.push([...items].slice(i, i + 3));
                    }
                    setItems(threeItems);
                    setPageData({ ...itemResponse.data });
                }
            } catch (error) {
                console.error("error data", error);
            }
            setIsAddItem(false);
        }

        fetchData();

    }, [props.itemkind, currentPage, isAddItem]);

    const addCart = (item) => {
        if (!userInfo) {
            Swal.itemconfirm("로그인 필요", "로그인하러 가시겠습니까?", "warning", () => { navigate("/"); window.scroll(0, 0); }, () => { return })
        } else {
            axios({
                method: "POST",
                url: `${SERVER_HOST}/cart/additem`,
                params: {
                    username: userInfo.username,
                    itemname: item.itemName,
                }
            }).then(response => {
                const { data, status, error } = response
                if (status === 201) {
                    Swal.itemconfirm("장바구니에 추가", "장바구니화면으로 이동하시겠습니까?", "success", () => { navigate(`/cart/${userInfo.id}`) }, () => { setIsAddItem(true); return; });
                } else {
                    window.alert("실패! : " + error)
                }

            })
        }
    }

    return (
        <>
            <table className="itemTable-user">
                <tbody className='itemListFram'>
                    {items.map((threeItem, rowIndex) => (
                        <tr className='itemRow' key={rowIndex}>
                            {threeItem.map((item, colIndex) => (
                                <td className='item' key={colIndex}>
                                    <div>
                                        {item.itemType === '글꼴' ? (
                                            <input
                                                className='fontStyle'
                                                type='text'
                                                style={{ fontFamily: `${item.sourceName}, cursive`, fontSize: 50 }}
                                                value='AhCyWorld'
                                                readOnly
                                            />
                                        ) : item.itemType === '배경음악' ? (
                                            <img className="itemImg" src={item.bgmImg} alt="" />
                                        ) : (
                                            <img
                                                className="itemImg"
                                                src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                                                alt=""
                                            />
                                        )}
                                        <br />
                                        {item.itemType === '배경음악' ? (
                                            <div className="itemName" style={{ fontSize: 30 }}>
                                                {item.sourceName}-{item.itemName} <br /> {item.price} <img className="acorn-img" src={acorn}></img>
                                                <br />
                                            </div>
                                        ) : (
                                            <div className="itemName" style={{ fontSize: 30 }}>
                                                {item.itemName} <br /> {item.price} <img className="acorn-img" src={acorn}></img>
                                                <br />
                                            </div>
                                        )}
                                    </div>
                                    {userItems.includes(item.id) ? <button className='pushItem'>보유중</button>
                                        : (usetCartItems.includes(item.id) ? <button className='pushItem'> 담긴 아이템</button> :
                                            <button className='pushItem' onClick={() => addCart(item)}>장바구니추가</button>)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="itemPagination">
                <ItemPagination pageData={pageData} setCurrentPage={setCurrentPage} />
            </div>
        </>
    );
};
export default ItemList;
