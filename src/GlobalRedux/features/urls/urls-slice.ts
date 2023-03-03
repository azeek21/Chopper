import { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { createSlice } from "@reduxjs/toolkit";

export interface UrlsState {
  urls: URL_DATA_INTERFACE[];
}

const initialState: UrlsState = {
  urls: [],
};

export const urlsSlice = createSlice({
  name: "urls",
  initialState,
  reducers: {
    addUrl: (state, action) => {
      state.urls.push(action.payload);
    },
    removeUrl: (state, action) => {
      state.urls = state.urls.filter(
        (url) => url.from_url == action.payload.from_url
      );
    },
  },
});

export const { addUrl, removeUrl } = urlsSlice.actions;
export default urlsSlice.reducer;
