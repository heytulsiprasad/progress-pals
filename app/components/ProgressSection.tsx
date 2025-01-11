import Image from "next/image";
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { Challenge, ChallengeStatus, Progress } from "@/types/general";
import { db } from "@/firebaseConfig";
import { useCurrentUser } from "@/redux/slices/currentUserSlice";

interface ProgressSectionProps {
  challenge: Challenge;
}

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset is not defined");
  }
  formData.append("upload_preset", uploadPreset);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not defined");
  }

  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!apiKey) {
    throw new Error("Cloudinary API key is not defined");
  }
  formData.append("api_key", apiKey); // Add the API key to the form data

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
};

export default function ProgressSection({ challenge }: ProgressSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const progress = challenge?.progress || [];

  const [localProgress, setLocalProgress] = useState<Progress[]>(progress);
  const { uid } = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      const newProgress: Progress = {
        proofType: "photo",
        url: imageUrl,
        description,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(doc(db, "challenges", challenge.id), {
        progress: [...progress, newProgress],
      });

      setLocalProgress((prevProgress) => [...prevProgress, newProgress]);
      setIsModalOpen(false);
      setDescription("");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const isCreator = uid === challenge.creator;
  const isStatusCompleted = challenge.status === ChallengeStatus.COMPLETED;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Progress Images</h2>
        {/* When user is creator, then show add progress button */}
        {isCreator && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-sm"
            disabled={isStatusCompleted}
          >
            Add Progress
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {localProgress?.map((item, index) => (
          <div key={index} className="card bg-base-200">
            <figure className="relative h-32 w-32 mx-auto mt-4">
              <Image
                src={item.url}
                alt={`Progress ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </figure>
            <div className="card-body p-4">
              <p className="text-sm opacity-70">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
              {item.description && (
                <p className="text-sm">{item.description}</p>
              )}
            </div>
          </div>
        ))}

        {/* When there's no progress images yet, tell that */}
        {localProgress.length === 0 && (
          <div className="text-gray-500 text-left col-span-full">
            No progress images yet
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Progress Image</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Description (optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${uploading ? "loading" : ""}`}
                disabled={uploading || !file}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
