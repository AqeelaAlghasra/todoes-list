"use client";
import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Loader, StepForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ncstLogo from "@/public/logo/ncstLogo.png";

import { useFormStatus } from "react-dom";

export default function LoginForm() {
  return (
    <main className="bg-blue-500 h-full min-h-screen">
      <div className="container relative m-0 mx-auto py-10 md:px-10">
        <div className="max-width flex items-center justify-center lg:justify-between">
          <Link className="flex items-center gap-1" href="/loggedin">
            <Image
              src={ncstLogo}
              width="50"
              height="50"
              alt="logo"
              className="h-16 w-20 md:h-16 md:w-20"
            />
            <h1 className="text-xl hidden lg:flex font-bold text-white md:text-3xl">
              NCST Student Organizer
            </h1>
          </Link>
          <div className="hidden lg:flex w-fit items-center">
            <form action={signInAction}>
              <GoogleSignInButton />
            </form>
          </div>
        </div>
        <div className="w-full px-4 pt-12 md:px-4 lg:px-8 xl:px-10 2xl:px-0">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h1 className="inline-block text-center text-5xl font-bold tracking-tight text-white lg:text-7xl">
              An Open Source AI-Powered{" "}
              <br className="hidden lg:inline-block" />
              Todoist Clone
            </h1>
            <h2 className="mt-8 text-center text-2xl font-light tracking-tight text-white lg:text-3xl">
              Student Organizer seamlessly{" "}
              <span className="font-bold">organizes your tasks</span> and
              <br className="hidden lg:inline-block" />
              <span className="font-bold">predicts what&apos;s next</span>
              using AI.
            </h2>
            <div className="mt-12 flex flex-col gap-4">
              <form action={signInAction}>
                <GetStartedButton />
              </form>
              <div className="w-fit items-center">
                {/* Additional content can go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-center">
          <Image
            alt="mobile"
            loading="lazy"
            width="500"
            height="600"
            className="z-10 max-w-[400px]"
            src={"/mobile.png"}
          />
          <Image
            src="/desktop.png"
            alt="laptop"
            loading="lazy"
            width="1000"
            height="500"
            data-nimg="1"
            className="h-full -ml-28 mt-10 hidden lg:flex"
          />
        </div>
      </div>
     
    </main>
  );
}
function GetStartedButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden text-xl font-medium text-blue-600 rounded-xl bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300"
    >
      <span className="flex items-center gap-1">
        {pending ? (
          <span className="px-16">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          <>
            Get Started
            <StepForward />
          </>
        )}
      </span>
    </button>
  );
}

function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-black rounded-lg bg-blue-600 group hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
    >
      <span
        className={clsx(
          "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0",
          pending && "px-16"
        )}
      >
        {pending ? (
          <span className="">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          "Sign in with Google"
        )}
      </span>
    </button>
  );
}
