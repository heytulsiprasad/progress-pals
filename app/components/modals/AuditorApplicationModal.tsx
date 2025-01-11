import { useState } from "react";
import { AuditorModalProps } from "@/types/general";
import Modal from "../Modal";
import { motion } from "framer-motion";
import clsx from "clsx";

export function AuditorApplicationModal({
  isOpen,
  onClose,
  onApply,
  isLoading,
}: AuditorModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    await onApply(message);
    setMessage("");
  };

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
        <h2 className="text-xl font-bold mb-4">Apply as Auditor</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={clsx("btn btn-primary", { "btn-loading": isLoading })}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Applying..." : "Apply"}
        </button>
      </motion.div>
    </Modal>
  );
}
