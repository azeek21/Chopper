import { Store } from "@mui/icons-material";
import { configureStore } from "@reduxjs/toolkit";
import  urlsReducer  from "./features/urls/urls-slice"


export const store = configureStore({
    reducer: {
        urls: urlsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AddDispatch = typeof store.dispatch;
