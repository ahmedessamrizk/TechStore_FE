import React from 'react'
import './Cart.css'
import { useEffect, useState } from 'react';

export default function Cart({ cartItems, setCartItems }) {
    const [total, setTotal] = useState(0);
    useEffect(() => {
        resetData();
    }, []);
    
    function resetData()
    {
        if(localStorage.getItem('cart') != 0)
        {
            setCartItems( JSON.parse(localStorage.getItem('cart')) );
        }
        calcTotal();
    }
    
    function incrementCart(item)
    {
        let idx;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i]._id == item._id) {

                idx = i;
                break;
            }
        }
        let tempCart = [...cartItems];
        let obj = { ...cartItems[idx] }
        obj.cartNumber++
        tempCart.splice(idx, 1, obj)
        setCartItems(tempCart);
        localStorage.setItem('cart', JSON.stringify(tempCart));
        calcTotal();
    }

    function decrementCart(item)
    {
        let idx;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i]._id == item._id) {
                idx = i
                break;
            }
        }
        let tempCart = [...cartItems];
        let obj = { ...cartItems[idx] };
        if (obj.cartNumber == 1) {
            obj.cartNumber = 0;
            tempCart.splice(idx, 1);
        } else {
            obj.cartNumber--;
            tempCart.splice(idx, 1, obj);
        }
        setCartItems(tempCart);
        localStorage.setItem('cart', JSON.stringify(tempCart));
        calcTotal();
    }

    function calcTotal() {
        let result = 0;
        let tempCart = JSON.parse(localStorage.getItem('cart'))
        for (let i = 0; i < cartItems.length; i++) {
            result += tempCart[i] ? tempCart[i].cartNumber * tempCart[i].price : 0
        }
        setTotal(result);

    }

    useEffect(() => {
        resetData();
    }, [localStorage.getItem('cart')]);

return <>
    <section className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header text-center">
            <h5 id="offcanvasRightLabel">My Cart</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body bg-light d-flex flex-column justify-content-between">
            <div className="cart-items">
            {
                
                total == 0?
                <p className='fs-4'>Cart is Empty</p>
                :
                cartItems.map(item => 
                    <div className="cart-product rounded-5 bg-white py-2 mb-3" key={item.id}>
                        <div className="container">
                            <div className="row">
                            <div className="col-md-3">
                                    <div className="cart-product-img">
                                        <img src={item.imageUrl} className='img-fluid' alt="" srcSet="" />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <h5>{item.productName}</h5>
                                    <p>Price:  {item.price}$ </p>
                                </div>
                                <div className="col-md-1">
                                    <i className="fa-solid fa-circle-plus" onClick={() => { incrementCart(item) } }></i>
                                    <p className='ms-1'>{item.cartNumber}</p>
                                    <i className="fa-solid fa-circle-minus" onClick={ () => { decrementCart(item) } }></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            </div>            
            <div className="total px-3 pb-2">
                <div className="total-money d-flex justify-content-between mb-3">
                    <h5 className='fw-bold'>Total</h5>
                    <p>{total}$</p>
                </div>
                <div className="checkout d-flex justify-content-end">
                    <button className='btn btn-success'>CheckOut</button>
                </div>
            </div>
        </div>
    </section>
</>
}
