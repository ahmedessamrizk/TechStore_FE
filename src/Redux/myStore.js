import { createSlice } from '@reduxjs/toolkit';

if(!localStorage.getItem("cart"))
    localStorage.setItem("cart" , "0");
export const StoreSlice = createSlice({
    name: 'store',
    initialState: {cart: localStorage.getItem("cart")},
    reducers: {
        //functions
        increment:function(state , e)
        {
            state.cart++;
            localStorage.setItem("cart" , state.cart);
        },
        decrement:function(state)
        {
            state.cart--;
            localStorage.setItem("cart" , state.cart);
        }
    }
})

export default StoreSlice.reducer;                
export const {increment , decrement} = StoreSlice.actions;