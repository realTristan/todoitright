"use client";

import { useState } from "react";

import { Task, User } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";
import { CrossSVG } from "@/app/components/Svgs";
import { deleteTask } from "@/app/utils/api";
import { MAX_COMPLETED_TASKS } from "../lib/constants";
import { LoadingRelative } from "./Loading";

interface CompletedProps {
  user: User;
  completed: ObjectState<Task[]>;
}
export default function CompletedTasks(props: CompletedProps): JSX.Element {
  return (
    <div className="flex flex-col rounded-md border-2 border-dotted p-10">
      <h2 className="mb-4 text-2xl font-bold">
        Completed{" "}
        <mark className="bg-transparent font-normal">
          ({props.completed.value.length}/{MAX_COMPLETED_TASKS})
        </mark>
      </h2>
      <ul className="flex flex-wrap gap-6">
        {props.completed.value.map((task: any) => (
          <CompletedTask
            user={props.user}
            task={task}
            key={Math.random()}
            completed={props.completed}
          />
        ))}
      </ul>
    </div>
  );
}

interface CompletedTaskProps {
  user: User;
  task: Task;
  completed: ObjectState<Task[]>;
}
const CompletedTask = (props: CompletedTaskProps): JSX.Element => {
  const [confirm, setConfirm] = useState(false);

  const ConfirmButton = (): JSX.Element => {
    const [disabled, setDisabled] = useState(false);

    return (
      <button
        onClick={async () => {
          setDisabled(true);
          let success: boolean = await deleteTask(props.user, props.task.id);
          setDisabled(false);

          if (!success) return;

          // remove the task from the list
          const newTasks = props.completed.value.filter(
            (task) => task.id !== props.task.id,
          );
          props.completed.set(newTasks);
        }}
        className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50 disabled:opacity-50"
      >
        {disabled ? <LoadingRelative className="h-5 w-5" /> : "Delete"}
      </button>
    );
  };

  const CancelButton = (): JSX.Element => {
    return (
      <button
        onClick={() => setConfirm(false)}
        className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
      >
        Cancel
      </button>
    );
  };

  const CloseButton = (): JSX.Element => {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="flex flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
      >
        <CrossSVG />
      </button>
    );
  };

  return (
    <div className={`flex gap-2 ${confirm ? "flex-col" : "flex-row"}`}>
      <button className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50">
        {props.task.value}
      </button>
      {confirm ? (
        <div className="flex flex-row gap-2">
          <ConfirmButton />
          <CancelButton />
        </div>
      ) : (
        <CloseButton />
      )}
    </div>
  );
};
