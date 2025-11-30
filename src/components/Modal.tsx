import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui";
import { DialogProps } from "@radix-ui/react-dialog";

export interface ModalProps extends DialogProps {
  onClose?: () => void;
  children?: React.ReactNode;
  title: string;
  onSubmit?: () => void;
  isOpen?: boolean;
  description?: string;
}
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  description,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};
