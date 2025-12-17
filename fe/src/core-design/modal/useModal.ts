import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  finishClosingModal,
  openModal,
  selectModalStack,
  startClosingModal,
} from '@Jade/store/modal.store'
import type { RootState } from '@Jade/store/global.store'
import { MODAL_ANIMATION_DURATION_MS, ModalId, type ModalKey } from '@Jade/types/modal'

export type UseModalReturn = {
  isOpen: boolean
  isClosing: boolean
  layer: number
  modalId: ModalKey
  open: () => void
  close: () => void
}

export const useModal = (
  modalId: ModalKey,
  closeDelayMs = MODAL_ANIMATION_DURATION_MS,
): UseModalReturn => {
  const dispatch = useDispatch()
  const modalStack = useSelector((state: RootState) => selectModalStack(state))
  const currentIndex = modalStack.findIndex((modal) => modal.id === modalId)
  const currentModal = currentIndex >= 0 ? modalStack[currentIndex] : undefined

  const layer = currentIndex >= 0 ? currentIndex : modalStack.length
  const isOpen = Boolean(currentModal)
  const isClosing = currentModal?.isClosing ?? false

  const open = useCallback(() => {
    dispatch(openModal(modalId))
  }, [dispatch, modalId])

  const close = useCallback(() => {
    if (!isOpen || isClosing) return
    dispatch(startClosingModal(modalId))
    setTimeout(() => {
      dispatch(finishClosingModal(modalId))
    }, closeDelayMs)
  }, [dispatch, modalId, closeDelayMs, isOpen, isClosing])

  return { isOpen, isClosing, layer, modalId, open, close }
}

export { ModalId }
