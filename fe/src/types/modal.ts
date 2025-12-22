export enum ModalId {
  MAIN = 'main-category-dialog',
  CREATE_CATEGORY_FROM_TREE = 'create-category-dialog-tree',
  COLOR = 'color-picker-dialog',
  ICON = 'icon-picker-dialog',
}

export type ModalKey = ModalId | string;

export const MODAL_ANIMATION_DURATION_MS = 250;
