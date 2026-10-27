"use client";

import { create } from "zustand";

type ModalId = string;

export const MODAL_IDS = {
  verifyEmail: "verify-email",
  resetPassword: "reset-password"
} as const;

interface ModalState {
  activeModal: ModalId | null;
  isVisible: boolean;
  openModal: (modalId: ModalId) => void;
  closeModal: () => void;
  setVisible: (isVisible: boolean, modalId?: ModalId | null) => void;
}

export const useModalVisibleStore = create<ModalState>()((set) => ({
  activeModal: null,
  isVisible: false,
  openModal: (modalId): void =>
    set({
      activeModal: modalId,
      isVisible: true
    }),
  closeModal: (): void =>
    set({
      activeModal: null,
      isVisible: false
    }),
  setVisible: (isVisible, modalId = null): void =>
    set({
      activeModal: isVisible ? modalId : null,
      isVisible
    })
}));
