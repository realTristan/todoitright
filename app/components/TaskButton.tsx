"use client";

import {
  removeTaskFromList,
  updateTaskInList,
  deleteTaskFromDatabase,
} from "@/app/lib/utils";

import { ObjectState } from "@/app/lib/state";
import { Task, List } from "@/app/lib/types";

import { useState } from "react";
import { CheckmarkSVG } from "@/app/components/Svgs";

interface TaskButtonProps {
  task: Task;
  list: ObjectState<List>;
  completed: ObjectState<List>;
}
export default function TaskButton(props: TaskButtonProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [value, setValue] = useState(props.task.value);

  return (
    <div className="group relative flex flex-col">
      <textarea
        onFocus={() => setEditing(true)}
        onBlur={async () => {
          setEditing(false);

          if (value === props.task.value) {
            return;
          }

          let success: boolean = await updateTask(
            props.task.id,
            value,
            props.list.value.id,
          );
          if (!success) return;

          const oldTask = props.task; // store the old task
          const newTask = { ...props.task, value }; // just update the value
          const newList = updateTaskInList(oldTask, newTask, props.list.value);

          props.list.set(newList);
        }}
        onChange={(e) => setValue(e.target.value)}
        defaultValue={props.task.value}
        id={props.task.id.toString()}
        className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
      ></textarea>

      {!editing && !confirm && (
        <div className="mt-2 flex flex-row gap-2">
          <CompleteButton
            list={props.list}
            task={props.task}
            completed={props.completed}
          />
          <DeleteButton onClick={() => setConfirm(true)} />
        </div>
      )}
      {!editing && confirm && (
        <div className="mt-2 flex flex-row gap-2">
          <ConfirmButton list={props.list} task={props.task} />
          <CancelButton onClick={() => setConfirm(false)} />
        </div>
      )}
    </div>
  );
}

const updateTask = async (
  task_id: number,
  value: string,
  list_id: number,
): Promise<boolean> => {
  return await fetch("/api/list/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_id, value, list_id }),
  }).then((res) => res.ok);
};

interface CancelButtonProps {
  onClick: Function;
}
const CancelButton = (props: CancelButtonProps): JSX.Element => {
  return (
    <button
      onClick={() => props.onClick()}
      className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
    >
      Cancel
    </button>
  );
};

interface DeleteButtonProps {
  onClick: Function;
}
const DeleteButton = (props: DeleteButtonProps): JSX.Element => {
  return (
    <button
      onClick={() => props.onClick()}
      className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
    >
      Delete
    </button>
  );
};

interface ConfirmButtonProps {
  list: ObjectState<List>;
  task: Task;
}
const ConfirmButton = (props: ConfirmButtonProps): JSX.Element => {
  return (
    <button
      onClick={async () => {
        let success: boolean = await deleteTaskFromDatabase(
          props.task.id,
          props.list.value.id,
        );
        if (!success) return;

        const newList: List = removeTaskFromList(props.task, props.list.value);
        props.list.set(newList);
      }}
      className="flex flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
    >
      Confirm
    </button>
  );
};

interface CompleteButtonProps {
  task: Task;
  list: ObjectState<List>;
  completed: ObjectState<List>;
}
const CompleteButton = (props: CompleteButtonProps): JSX.Element => {
  return (
    <button
      className="flex w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
      onClick={async () => {
        let success: boolean = await moveToCompleted(props.task.id);
        if (!success) return;

        addTaskToCompleted(props.task, props.completed);

        const newList = removeTaskFromList(props.task, props.list.value);
        props.list.set(newList);
      }}
    >
      <CheckmarkSVG />
    </button>
  );
};

// by database
const moveToCompleted = async (task_id: number): Promise<boolean> => {
  return await fetch("/api/list/completed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_id }),
  }).then((res) => res.ok);
};

const addTaskToCompleted = (task: Task, completed: ObjectState<List>): void => {
  completed.set({
    ...completed.value,
    tasks: [...completed.value.tasks, task],
  });
};
