"use client";
import React from "react";
import { Button } from "./ui/Button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function ToFeedButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      size="xs"
      className=" pr-3 "
    >
      <ChevronLeft size={16} />
      Back
    </Button>
  );
}

export default ToFeedButton;
