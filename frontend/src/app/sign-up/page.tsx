"use client";
import { SignUp } from "@stackframe/stack";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white border elevation-2 p-4 sm:p-6 lg:p-8 rounded-lg">
        <div className="flex items-center justify-center w-full">
          <Image
            src="/logos/logo_with_tagline.png"
            alt="Pixel Habits"
            width={300}
            height={300}
            className="w-auto h-auto max-h-[30vh]"
            priority
          />
        </div>
        <div className="flex w-full items-center justify-center mt-4">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
