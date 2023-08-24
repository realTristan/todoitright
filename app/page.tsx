/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ObjectState } from "@/app/lib/state";
import { List } from "@/app/lib/types";
import { EMPTY_LIST } from "./lib/constants";

import LoadingCenter from "@/app/components/Loading";
import TaskButton from "@/app/components/TaskButton";
import Completed from "@/app/components/Completed";
import SideMenu from "@/app/components/SideMenu";
import CreateTaskButton from "@/app/components/CreateTaskButton";
import { SessionProvider } from "@/app/components/Providers";

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
  const completed = new ObjectState<List>(EMPTY_LIST);
  const main = new ObjectState<List>(EMPTY_LIST);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }

    if (status === "authenticated") {
      fetch("/api/list/main")
        .then((res) => res.json())
        .then((res) => main.set(res));

      fetch("/api/list/completed")
        .then((res) => res.json())
        .then((res) => completed.set(res));
    }
  }, [status]);

  if (status === "loading") return <LoadingCenter />;
  if (!session || !session.user) return <div>Unauthorized</div>;

  return (
    <main className="flex min-h-screen flex-col rounded-md">
      <SideMenu user={session.user} />
      <div className="flex flex-col p-16 md:ml-64">
        <div
          key={Math.random()}
          className="mb-8 flex flex-col rounded-md border-2 border-dotted p-10"
        >
          <h2 className="mb-4 text-2xl font-bold">
            {main.value.name}{" "}
            <mark className="bg-transparent font-normal">
              ({main.value.tasks.length})
            </mark>
          </h2>
          <ul className="flex flex-wrap gap-6">
            <CreateTaskButton list={main} />
            {main.value.tasks.map((task: any) => (
              <TaskButton
                list={main}
                task={task}
                key={Math.random()}
                completed={completed}
              />
            ))}
          </ul>
        </div>

        <Completed completed={completed} />
      </div>
    </main>
  );
};
