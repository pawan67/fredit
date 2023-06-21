import { User } from "next-auth";
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

interface UserAvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
  return (
    <Avatar>
      {user.image ? (
        <div className=" relative aspect-square h-full w-full">
          <Image alt="profile" src={user.image} fill referrerPolicy="no-referrer" />
        </div>
      ) : (
        <AvatarFallback>{user.name ? user.name[0] : null}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
