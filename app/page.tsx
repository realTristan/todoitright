/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ObjectState } from "@/app/lib/state";

import LoadingCenter from "@/app/components/Loading";
import CompletedTasks from "@/app/components/CompletedTasks";
import MainTasks from "@/app/components/MainTasks/MainTasks";
import SideMenu from "@/app/components/SideMenu";
import { SessionProvider } from "@/app/components/Providers";

import { getCompletedTasks, getMainTasks } from "@/app/utils/api";
import { Task } from "@/app/lib/types";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Home(): JSX.Element {
  return (
    <SessionProvider>
      <Wrapped />
    </SessionProvider>
  );
}

const Wrapped = (): JSX.Element => {
  const { data: session, status } = useSession();
  const completed = new ObjectState<Task[]>([]);
  const main = new ObjectState<Task[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }

    if (status === "authenticated") {
      if (!main.updated) {
        getMainTasks(session.user).then((res: Response) => {
          if (res.ok) res.json().then((json) => main.set(json.result));
        });
      }
      if (!completed.updated) {
        getCompletedTasks(session.user).then((res: Response) => {
          if (res.ok) res.json().then((json) => completed.set(json.result));
        });
      }
    }
  }, [status]);

  if (status === "loading") return <LoadingCenter />;
  if (!session || !session.user) return <div>Unauthorized</div>;

  return (
    <main className="flex min-h-screen flex-col rounded-md">
      <SideMenu user={session.user} />
      <div className="flex flex-col p-16 md:ml-64">
        <MainTasks main={main} completed={completed} user={session.user} />
        <CompletedTasks completed={completed} user={session.user} />
      </div>
    </main>
  );
};
