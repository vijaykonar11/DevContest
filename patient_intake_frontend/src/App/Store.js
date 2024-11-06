import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice";
import modalReducer from "../features/modal/ModalSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk"; // Use default import for thunk

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["userInfo"], // Correctly configured whitelist
};

const rootReducer = combineReducers({
  userInfo: userReducer,
  modal: modalReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(thunk),
});

export const persistor = persistStore(store);

// Log the state after rehydration
persistor.subscribe(() => {
  const state = store.getState();
  // console.log("Rehydrated state:", state);
});
