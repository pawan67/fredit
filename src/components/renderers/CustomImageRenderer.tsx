"use client";

import Image from "next/image";

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[20rem]">
      <Image
        width={900}
        height={600}
        alt="image"
        className=" rounded-md my-3 object-contain"
        src={src}
      />
    </div>
  );
}

export default CustomImageRenderer;
