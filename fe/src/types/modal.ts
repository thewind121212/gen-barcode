export enum ModalId {
  MAIN_CATEGORY = 'main-category-dialog',
  CREATE_CATEGORY_FROM_TREE = 'create-category-dialog-tree',
  COLOR = 'color-picker-dialog',
  ICON = 'icon-picker-dialog',
  CONFIRM = 'confirm-dialog',
  // Product module
  CREATE_PRODUCT = 'create-product-dialog',
}

export type ModalKey = ModalId | string;

export const MODAL_ANIMATION_DURATION_MS = 250;
