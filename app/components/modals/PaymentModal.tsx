import { PaymentModalProps } from "@/types/general";
import { useState } from "react";
import Modal from "../Modal";

const CHARITIES = [
  { name: "Red Cross", url: "https://www.redcross.org/donate/donation.html/" },
  { name: "UNICEF", url: "https://www.unicef.org/donate" },
  {
    name: "World Wildlife Fund (WWF)",
    url: "https://www.worldwildlife.org/donate",
  },
  {
    name: "Doctors Without Borders",
    url: "https://www.doctorswithoutborders.org/donate",
  },
  { name: "Oxfam International", url: "https://www.oxfam.org/en/donate" },
  {
    name: "Save the Children",
    url: "https://www.savethechildren.org/us/ways-to-help",
  },
  { name: "Amnesty International", url: "https://www.amnesty.org/en/donate/" },
  { name: "The Salvation Army", url: "https://www.salvationarmy.org/donate" },
  { name: "Habitat for Humanity", url: "https://www.habitat.org/donate" },
  { name: "CARE International", url: "https://www.care.org/donate" },
];

export const PaymentModal = ({
  isOpen,
  onClose,
  onConfirmPayment,
  isLoading,
  wagerAmount,
}: PaymentModalProps) => {
  const [selectedCharity, setSelectedCharity] = useState("");
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">
          Pay Wager Amount (${wagerAmount})
        </h3>
        <p className="mb-4">Please select a charity to donate to:</p>

        <div className="space-y-4">
          {CHARITIES.map((charity) => (
            <div key={charity.name} className="flex items-center gap-4">
              <input
                type="radio"
                name="charity"
                value={charity.name}
                checked={selectedCharity === charity.name}
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="radio radio-primary"
              />
              <a
                href={charity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {charity.name}
              </a>
            </div>
          ))}
        </div>

        <div className="form-control mt-4">
          <label className="label cursor-pointer flex items-center justify-start gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
            />
            <span className="label-text text-left">
              I agree to donate ${wagerAmount} to {selectedCharity}
            </span>
          </label>
        </div>

        <button
          className="btn btn-primary w-full mt-6"
          disabled={!selectedCharity || !hasAgreed || isLoading}
          onClick={onConfirmPayment}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Confirm Payment"
          )}
        </button>
      </div>
    </Modal>
  );
};
