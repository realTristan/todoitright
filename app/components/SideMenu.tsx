"use client";
import Image from "next/image";

import { User } from "@/app/lib/types";
import { signOut } from "next-auth/react";

/**
 * Side menu
 * @returns JSX.Element
 */
export default function SideMenu(props: { user: User }): JSX.Element {
  return (
    <div className="z-[1] flex h-auto w-screen flex-col bg-slate-50 p-4 md:fixed md:h-screen md:w-64">
      <div className="flex flex-row items-center justify-start">
        <Image
          src={props.user.image || ""}
          alt="..."
          width={50}
          height={50}
          className="rounded-full"
        />
        <p className="ml-4 text-3xl font-bold text-slate-900">Todoer</p>
      </div>
      <p className="mb-1 mt-3 text-sm font-medium tracking-wide text-slate-800">
        Welcome, {props.user.name}
      </p>
      <p className="mb-2 text-xs font-medium tracking-wide text-slate-900/50">
        {props.user.email}
      </p>
      <button
        onClick={() => signOut()}
        className="relative bottom-4 mt-8 rounded-md bg-slate-900 px-10 py-2.5 text-start font-medium text-white hover:brightness-110 md:absolute"
      >
        Sign out
      </button>
    </div>
  );
}
