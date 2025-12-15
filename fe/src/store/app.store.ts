import type { StoreInfo } from '@Jade/types/store';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UserInfo {
    email: string;
}

export interface AppState {
    storeId?: string
    userId?: string
    storeName?: string
    userInfo?: UserInfo
    isAppInitialized: boolean
    isDark: boolean
}

const initialState: AppState = {
    storeId: undefined,
    userId: undefined,
    userInfo: undefined,
    storeName: undefined,
    isAppInitialized: false,
    isDark: false,
}

export const appSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },
        setStoreInfo: (state, action: PayloadAction<StoreInfo>) => {
            return {
                ...state,
                storeId: action.payload.id,
                storeName: action.payload.name,
            }
        },
        setIsAppInitialized: (state, action: PayloadAction<boolean>) => {
            state.isAppInitialized = action.payload
        },
        toggleTheme: (state) => {
            state.isDark = !state.isDark
        }
    },
})

export const { setUserId, setUserInfo, setStoreInfo, setIsAppInitialized, toggleTheme } = appSlice.actions

export default appSlice.reducer