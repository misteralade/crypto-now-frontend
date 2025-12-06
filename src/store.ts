import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bankReducer from "./redux/bank.slice.ts";
import cryptoSlice from "./redux/crypto.slice";
import transactionSlice from "./redux/transaction.slice";
import userSlice from "./redux/user.slice.ts";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Use sessionStorage so persisted data clears when the tab is closed
import storageSession from "redux-persist/lib/storage/session";
import {BASIC} from "./config/index.config.ts"; // sessionStorage
// (To persist to localStorage instead: import storage from 'redux-persist/lib/storage')

const rootReducer = combineReducers({
  bank: bankReducer,
  crypto: cryptoSlice,
  transaction: transactionSlice,
  user: userSlice,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["bank", "crypto", "transaction", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions — ignore them here
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: BASIC.NODE_ENV !== "production",
});

// persistor for PersistGate
export const persistor = persistStore(store);

// Types for use throughout the app
export type RootState = ReturnType<typeof rootReducer>; // note: use rootReducer type (not persistedReducer)
export type AppDispatch = typeof store.dispatch;
