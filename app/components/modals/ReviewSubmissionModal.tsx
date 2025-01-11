import { useState } from "react";
import { ReviewModalProps } from "@/types/general";
import Modal from "../Modal";
import { motion } from "framer-motion";
import clsx from "clsx";

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ReviewModalProps) {
  const [comments, setComments] = useState("");

  const handleSubmit = async () => {
    await onSubmit(comments);
    setComments("");
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
        <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Add final comments (optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
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
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}
