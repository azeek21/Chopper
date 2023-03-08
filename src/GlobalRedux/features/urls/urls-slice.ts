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
        (url) => url.urlid == action.payload.from_url
      );
    },
    updateUrl: (state, action) => {
      fetch("/api/urls/update/" + action.payload.urlid, {
        method: "POST",
        body: JSON.stringify(action.payload),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (state.urls.length == 0 || state.urls.length == 1) {
            state.urls = [data];
            return;
          }

          const newArray = state.urls.filter(
            (url) => url.urlid != data.urlid
          );

          state.urls = [...newArray, data];
        });
    },
  },
});

export const { addUrl, removeUrl, updateUrl } = urlsSlice.actions;
export default urlsSlice.reducer;
