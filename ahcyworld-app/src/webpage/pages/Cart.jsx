import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { resolvePath, useNavigate, useParams } from 'react-router-dom';
import { SERVER_HOST } from "../../apis/api";
import * as Swal from "../../apis/alert";
import AcornPayModal from '../items/components/AcornPayModal';
import { LoginContext } from '../../webpage/components/login/context/LoginContextProvider';
import acorn from "../../upload/acorn.png"

const Cart = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const {hompyInfo, userInfo} = useContext(LoginContext);
    const [myCart, setMyCart] = useState([]);
    const [isDelete, setIsDelete] = useState(false);
    const [selectItem, setSelectItem] = useState([]);
    const [allCheckBox, setAllCheckBox] = useState(false);
    const [totalAcorn, setTotalAcorn] = useState(0);
    const [isAcornPayModalOpen, setIsAcornPayModalOpen] = useState(false);

    const acornPayOpenModal = () => {
        setIsAcornPayModalOpen(true);
    };

    const acornPayCloseModal = () => {
        setIsAcornPayModalOpen(false);
    };

    useEffect(() => {
        setIsAcornPayModalOpen(false);
        axios({
            method: "GET",
            url: `${SERVER_HOST}/cart/list`,
            params: { id: userId }
        }).then(response => {
            const { data, status } = response;
            const updateCart = data.map(x => ({ ...x, checked: false }));
            setMyCart(updateCart);
            setIsDelete(false);
        })
    }, [isDelete])

    



    const deleteItem = (id) => {
        axios({
            method: "DELETE",
            url: `${SERVER_HOST}/cart/delete/${id}`
        }).then(response => {
            const { data, status } = response;
            if (status === 200) {
                setIsDelete(true);
            }
        });
    }


    const handelDeleteItem = (id) => {
        Swal.itemconfirm("아이템 삭제", "정말 삭제하시겠습니까?", "warning", () => deleteItem(id), () => navigate(`/cart/${userId}`))
    }

    const handleCheckboxChange = (e) => {
        const allChecked = myCart.every(cart => cart.checked);
        if (allChecked) {
            setAllCheckBox(false)
        }

        const { value,checked } = e.target;
        const oneChangbox = myCart.map(cart => {
            if (cart.id === parseInt(value)) {
                if(checked){
                    console.log(cart.item.price);
                    setTotalAcorn(totalAcorn + cart.item.price);
                }else{
                    setTotalAcorn(totalAcorn - cart.item.price);
                }
                
                return { ...cart, checked: checked };
            } else {
                return { ...cart }
            }
        }

        )
        setMyCart(oneChangbox);
        e.target.checked ? setSelectItem([...selectItem, parseInt(value)]) : setSelectItem(selectItem.filter(x => x !== parseInt(value)));
    }

    const handleSelectAll = (e) => {

        const { value, checked } = e.target;
        if (checked === true) {
            setAllCheckBox(true);
        } else {
            setAllCheckBox(false);
        }
        const allCheckItem = myCart.map(x => ({ ...x, checked: checked }))
        let allCheckItemNum = [];
        let allItemAcorn = 0;
        e.target.checked ? myCart.forEach(x => allCheckItemNum.push(parseInt(x.id))) : setSelectItem([]);
        e.target.checked ? myCart.forEach(x => {allItemAcorn = allItemAcorn + x.item.price}) : setTotalAcorn(0);
        console.log("모든 가격: "+allItemAcorn);
        setSelectItem(allCheckItemNum);
        setMyCart(allCheckItem);
        setTotalAcorn(allItemAcorn);

    }

    const AllDelete = () => {
        axios({
            method: "DELETE",
            url: `${SERVER_HOST}/cart/delete/all`,
            data: JSON.stringify(selectItem),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const { data, status } = response;

            if (status === 200) {
                console.log("체크된 아이템 삭제 성공!!!");
                setSelectItem([]);
                setIsDelete(true);
                setAllCheckBox(false);
            }

        })
    }

    const handleAllDelete = () => {
        Swal.itemconfirm("체크된 아이템 삭제", "정말 삭제하시겠습니까?", "warning", () => AllDelete(), () => navigate(`/cart/${userId}`))
    }


    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>장바구니</h2>

            <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px' }}>
                <button onClick={()=>handleAllDelete()} style={{ textAlign: 'right' }}>선택삭제</button>
                <div>
                    <input
                        type="checkbox"
                        checked={allCheckBox}
                        onChange={handleSelectAll}
                    />전체선택
                </div>
                <div>
                    <hr />
                    {myCart.map((cart) => (

                        <div key={cart.id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <input
                                type="checkbox"
                                checked={cart.checked}
                                onChange={(e) => handleCheckboxChange(e)}
                                value={cart.id}
                                style={{ marginRight: 25 }}
                            />
                            {cart.item.itemType === "글꼴" ? (
                                <input
                                    className='fontStyle'
                                    type='text'
                                    style={{ fontFamily: `${cart.item.sourceName}, cursive`, fontSize: 50, width: 100, height: 100 }}
                                    defaultValue='AhCyWorld'
                                    readOnly
                                />
                            ) : cart.item.itemType === "배경음악" ? (
                                <img className="itemImg" src={cart.item.bgmImg} style={{ width: 100, height: 100 }} alt='' />
                            ) : (
                                <img
                                    className="itemImg"
                                    src={`${process.env.PUBLIC_URL}/image/${cart.item.fileName}`}
                                    style={{ width: 100, height: 100 }} alt=''
                                />
                            )}
                            <div style={{ flex: 1, marginLeft: '10px' }}>
                                <div>{cart.item.itemName}</div>
                                <div style={{ color: '#888' }}>{cart.item.itemType}</div>
                            </div>
                            <div style={{ width: '100px', textAlign: 'right' }}>{cart.item.price} <img style={{width: 15, height: 15}} src={acorn} alt=''></img></div>
                            <button onClick={() => handelDeleteItem(cart.id)} style={{ marginLeft: '10px' }}>❌</button>

                        </div>

                    ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: '10px' }}><hr />
                    <div>총 주문금액: {totalAcorn} <img style={{width: 15, height: 15}} src={acorn} alt=''></img></div>
                </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={()=>navigate(-1)}>쇼핑계속하기</button>
                <button onClick={()=>acornPayOpenModal()}>상품 구매</button>
                <AcornPayModal isOpen={isAcornPayModalOpen} onClose={acornPayCloseModal} selectItem={selectItem} totalAcorn={totalAcorn} hompyInfo={hompyInfo} userInfo={userInfo}/>
            </div>
        </div>
    );
};

export default Cart;