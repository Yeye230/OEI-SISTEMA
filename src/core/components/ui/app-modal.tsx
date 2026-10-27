import { Button, Modal } from "@heroui/react";
import { PropsWithChildren } from "react";

import { btnPrimaryClassName, btnSecondaryClassName } from "@/core/utils/const";
import { LucideIconRender } from '../lucide-icon-render';
import { CornerFiligree } from '../corner-filigree';

type AppModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  btnName?: string;
  hasModalFooter?: boolean;
  title: string;
  description?: string;
  iconName?: string;
  className?: string;
  isCloseTrigger?: boolean;
};

const AppModal = ({
  isOpen,
  setIsOpen,
  btnName,
  title,
  description,
  iconName,
  children,
  hasModalFooter = false,
  isCloseTrigger = true
}: PropsWithChildren<AppModalProps>): React.JSX.Element => (
  // Modal controlado: sin <Modal> raíz (DialogTrigger), que exige un hijo pressable (Modal.Trigger).
  <Modal.Backdrop isDismissable={false} isOpen={isOpen} onOpenChange={setIsOpen}>
    <Modal.Container placement="center" size="lg">
      <Modal.Dialog
        className="relative w-full max-w-md rounded-[14px] border border-border bg-surface p-8 shadow-card"
        style={{ backdropFilter: "blur(16px)" }}
      >
        {/* corner filigree */}
        <CornerFiligree />
        {isCloseTrigger && (
          <Modal.CloseTrigger className="bg-transparent text-xs text-muted hover:text-primary top-2 right-7">
            salir
          </Modal.CloseTrigger>
        )}

        <Modal.Header className="flex">
          <div className="flex flex-col items-center justify-center">
            {iconName && (
              <Modal.Icon className="w-11 h-11 rounded-2xl flex items-center justify-center bg-background">
                <LucideIconRender iconName={iconName} className="w-5 h-5" />
              </Modal.Icon>
            )}
            <Modal.Heading className="font-display text-2xl text-center text-foreground">
              {title}
            </Modal.Heading>
            {description && (
              <p className="mt-2 mb-6 text-[10px] uppercase tracking-[0.3em] text-muted">
                {description}
              </p>
            )}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>{children}</div>
        </Modal.Body>
        {hasModalFooter && (
          <Modal.Footer className="mt-8">
            <Button slot="close" className={btnPrimaryClassName}>
              {btnName}
            </Button>
            <Button slot="close" className={btnSecondaryClassName}>
              Cancelar
            </Button>
          </Modal.Footer>
        )}
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
);

export default AppModal;
