"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

interface ModalContent {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  childProps?: { [key: string]: unknown };
  onClose?: () => void;
  onSubmit?: () => void;
  showsSubmitButton?: boolean;
  submitText?: string;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalContextType {
  openModal: (opts: ModalContent) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modal, setModal] = useState<ModalContent | null>(null);
  const isOpen = modal !== null;

  const openModal = useCallback((opts: ModalContent) => {
    setModal(opts);
  }, []);

  const closeModal = useCallback(() => {
    modal?.onClose?.();
    setModal(null);
  }, [modal]);

  const modalPortal = isOpen
    ? createPortal(
        <Dialog open={isOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="mb-10">
              {modal?.title && <DialogTitle>{modal.title}</DialogTitle>}
              {modal?.description && (
                <DialogDescription>{modal.description}</DialogDescription>
              )}
            </DialogHeader>

            {modal.children &&
              (React.isValidElement(modal.children)
                ? React.cloneElement(modal.children, modal.childProps)
                : modal.children)}

            {modal.showsSubmitButton && (
              <DialogFooter className="mt-10">
                <Button onClick={modal.onSubmit}>
                  {modal.submitText || "Done"}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>,
        document.body
      )
    : null;

  const value: ModalContextType = {
    openModal,
    closeModal,
    isOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalPortal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error("useModalContext must be used within ModalProvider");
  return ctx;
};
