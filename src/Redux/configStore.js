import { configureStore } from "@reduxjs/toolkit";
import myStore from "./myStore";

export const Store = configureStore({
    reducer:{
        myStore: myStore,
    }
})