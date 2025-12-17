import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ModalKey } from '@Jade/types/modal';

export type ModalEntry = {
  id: ModalKey;
  isClosing: boolean;
};

export type ModalState = {
  stack: ModalEntry[];
};

const initialState: ModalState = {
  stack: [],
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalKey>) => {
      const existingIndex = state.stack.findIndex((modal) => modal.id === action.payload);
      if (existingIndex !== -1) {
        state.stack.splice(existingIndex, 1);
      }
      state.stack.push({ id: action.payload, isClosing: false });
    },
    startClosingModal: (state, action: PayloadAction<ModalKey>) => {
      const target = state.stack.find((modal) => modal.id === action.payload);
      if (target) {
        target.isClosing = true;
      }
    },
    finishClosingModal: (state, action: PayloadAction<ModalKey>) => {
      state.stack = state.stack.filter((modal) => modal.id !== action.payload);
    },
    clearModals: (state) => {
      state.stack = [];
    },
  },
});

export const { openModal, startClosingModal, finishClosingModal, clearModals } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;

export const selectModalStack = (state: { modal: ModalState }) => state.modal.stack;

export const selectModalEntryById = (modalId: ModalKey) => (state: { modal: ModalState }) =>
  state.modal.stack.find((modal) => modal.id === modalId);

export const selectTopModalId = (state: { modal: ModalState }) =>
  state.modal.stack.length ? state.modal.stack[state.modal.stack.length - 1].id : undefined;
