import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bankReducer from "./redux/bank.slice.ts";
import cryptoSlice from "./redux/crypto.slice";
import transactionSlice from "./redux/transaction.slice";
import userSlice from "./redux/user.slice.ts";
import kycSlice from "./redux/kyc.slice.ts";

import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { userSearchTransactionInitialState } from "./redux/states/initial-transaction.state.ts";

// Use sessionStorage so persisted data clears when the tab is closed
import storageSession from "redux-persist/lib/storage/session";
import {BASIC} from "./config/index.config.ts"; // sessionStorage
// (To persist to localStorage instead: import storage from 'redux-persist/lib/storage')

const rootReducer = combineReducers({
  bank: bankReducer,
  crypto: cryptoSlice,
  transaction: transactionSlice,
  user: userSlice,
  kyc: kycSlice,
});

// The Transaction History page's active filters/search/pagination live in
// transaction.dashboard.searchUserTransactions. Persisting it caused a reload
// to keep querying with the last-used filter while the visible filter chips
// (separate local component state) reset to their defaults — the UI looked
// unfiltered while the data underneath stayed filtered. Reloading a filter
// view should start clean, so this field is excluded from persistence while
// the rest of the transaction slice (in-progress trade, dispute drafts, etc.)
// still persists normally.
type TransactionSliceState = ReturnType<typeof transactionSlice>;

const stripPersistedTransactionFilters = (
  state: TransactionSliceState,
): TransactionSliceState => ({
  ...state,
  dashboard: {
    ...state.dashboard,
    searchUserTransactions: userSearchTransactionInitialState,
  },
});

const transactionTransform = createTransform<
  TransactionSliceState,
  TransactionSliceState
>(
  // in: Redux state -> storage. Strip the filter payload before it's ever written.
  stripPersistedTransactionFilters,
  // out: storage -> Redux on rehydrate. Identity — nothing bad should reach here,
  // but strip again as a safety net against whatever was written before this fix.
  stripPersistedTransactionFilters,
  { whitelist: ["transaction"] },
);

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: Parameters<typeof persistReducer<RootReducerState>>[0] = {
  key: "root",
  storage: storageSession,
  whitelist: ["bank", "crypto", "transaction", "user", "kyc"],
  transforms: [transactionTransform],
};

const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer);

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
