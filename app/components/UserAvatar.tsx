import { useEffect, useState } from "react";
import { getUserDetails } from "../services/userService";
import Image from "next/image";
import { User } from "@/types/general";

const UserAvatar = ({ uid }: { uid: string }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await getUserDetails(uid);
      setUser(userDetails);
    };

    fetchUserDetails();
  }, [uid]);

  if (!user) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="avatar">
        <div className="w-8 aspect-square rounded-full">
          <Image src={user.photoURL} alt={user.name} width={20} height={20} />
        </div>
      </div>
      <span>{user.name}</span>
    </div>
  );
};

export default UserAvatar;
