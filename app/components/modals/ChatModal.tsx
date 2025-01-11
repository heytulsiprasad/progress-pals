import { useEffect, useState, useRef } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { ChatMessage, ChatModalProps } from "@/types/general";
import { useCurrentUser } from "@/redux/slices/currentUserSlice";
import clsx from "clsx";
import UserAvatar from "../UserAvatar";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { format } from "date-fns";
import { FaRegCommentDots } from "react-icons/fa";

const ChatModal = ({ isOpen, onClose, challengeId }: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { uid } = useCurrentUser();
  const [error, setError] = useState<string | null>(null);

  console.log(messages);

  useEffect(() => {
    if (!isOpen) return;

    const messagesRef = collection(db, `challenges/${challengeId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as ChatMessage)
          )
          .reverse();
        setMessages(newMessages);
        setError(null);

        // Scroll to bottom on new messages
        setTimeout(() => {
          endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      (error) => {
        console.error("Chat error:", error);
        setError("You don't have permission to view this chat.");
        toast.error("Error: You don't have permission to view this chat");
      }
    );

    return () => unsubscribe();
  }, [challengeId, isOpen]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, `challenges/${challengeId}/messages`), {
        content: message.trim(),
        senderId: uid,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl h-[80vh] flex flex-col p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center sticky top-0 bg-base-100 z-10">
          <h3 className="font-bold text-lg">Challenge Chat</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
          >
            <IoClose className="size-5" />
          </button>
        </div>

        {error ? (
          <div className="flex-1 flex items-center justify-center text-error p-6">
            {error}
          </div>
        ) : (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FaRegCommentDots className="text-6xl mb-4" />
                    <p className="text-lg">No messages yet</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx(
                      "flex",
                      msg.senderId === uid ? "justify-end" : "justify-start",
                      "items-start gap-3"
                    )}
                  >
                    <div className="shrink-0">
                      <UserAvatar uid={msg.senderId} />
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={clsx(
                          "chat-bubble",
                          msg.senderId === uid
                            ? "chat-bubble-primary"
                            : "chat-bubble-secondary",
                          "max-w-xs break-words"
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-2">
                        {format(new Date(msg.timestamp), "p")}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Container */}
            <div className="p-4 border-t border-base-300 bg-base-100 sticky bottom-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="input input-bordered flex-1"
                  autoFocus
                />
                <button
                  onClick={sendMessage}
                  className="btn btn-primary px-6"
                  disabled={!message.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};

export default ChatModal;
