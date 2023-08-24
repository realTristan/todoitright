"use client";

import { useState } from "react";

import { Task, List } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";
import { CrossSVG } from "@/app/components/Svgs";
import { deleteTaskFromDatabase, removeTaskFromList } from "@/app/lib/utils";

interface CompletedProps {
  completed: ObjectState<List>;
}
export default function Completed(props: CompletedProps): JSX.Element {
  return (
    <div className="flex flex-col rounded-md border-2 border-dotted p-10">
      <h2 className="mb-4 text-2xl font-bold">
        Completed{" "}
        <mark className="bg-transparent font-normal">
          ({props.completed.value.tasks.length})
        </mark>
      </h2>
      <ul className="flex flex-wrap gap-6">
        {props.completed.value.tasks.map((task: any) => (
          <CompletedTask
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
  task: Task;
  completed: ObjectState<List>;
}
const CompletedTask = (props: CompletedTaskProps): JSX.Element => {
  const [confirm, setConfirm] = useState(false);

  const ConfirmButton = (): JSX.Element => {
    return (
      <button
        onClick={async () => {
          let success: boolean = await deleteTaskFromDatabase(
            props.task.id,
            props.completed.value.id,
          );
          if (!success) return;

          const newList = removeTaskFromList(props.task, props.completed.value);
          props.completed.set(newList);
        }}
        className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
      >
        Confirm
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
