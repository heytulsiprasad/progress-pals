import { useState } from "react";
import { ApprovalRejectModalProps } from "@/types/general";
import Modal from "../Modal";
import { motion } from "framer-motion";
import clsx from "clsx";

export function ApprovalRejectModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  type,
}: ApprovalRejectModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    await onConfirm(reason);
    setReason("");
  };

  const title = type === "approve" ? "Approve Challenge" : "Reject Challenge";
  const buttonText = type === "approve" ? "Approve" : "Reject";
  const loadingText = type === "approve" ? "Approving..." : "Rejecting...";

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder={`Add ${type} reason (optional)`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline btn-error" onClick={onClose}>
            Cancel
          </button>
          <button
            className={clsx("btn btn-primary", { "btn-loading": isLoading })}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? loadingText : buttonText}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}
