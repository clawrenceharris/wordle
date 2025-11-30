import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

export interface UseModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
  title: string;
  onSubmit?: () => void;
  isOpen?: boolean;
  description?: string;
}
export const useModal = ({
  onClose,

  title,
  onSubmit,
  description,
  children,
}: UseModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const ModalComponent = createPortal(
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>,
    document.body
  );

  return {
    closeModal,
    openModal,
    modal: isModalOpen ? ModalComponent : null,
    isModalOpen,
  };
};
