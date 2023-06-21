"use client";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      // toast notification
      toast({
        title: "There was an problem.",
        description: "There was an eror logging in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(" flex space-x-3 justify-center", className)}>
      <Button
        isLoading={isLoading}
        onClick={loginWithGoogle}
        size="sm"
        className=" w-full"
      >
        {isLoading ? null : <Icons.google className=" w-4 h-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
