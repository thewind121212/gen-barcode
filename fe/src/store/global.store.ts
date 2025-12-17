import { configureStore } from '@reduxjs/toolkit'
import appReducer from '@Jade/store/app.store'
import { modalReducer } from '@Jade/store/modal.store'
export const store = configureStore({
  reducer: {
    app: appReducer,
    modal: modalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch