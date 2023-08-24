"use client";

import { ObjectState } from "@/app/lib/state";
import { Task, User } from "@/app/lib/types";
import { deleteTask, updateTask } from "@/app/utils/api";
import { setTaskToCompleted } from "@/app/utils/api";

import { useState } from "react";
import { CheckmarkSVG } from "@/app/components/Svgs";

interface TaskButtonProps {
  user: User;
  task: Task;
  tasks: ObjectState<Task[]>;
  completed: ObjectState<Task[]>;
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
            props.user,
            props.task.id,
            value,
          );
          if (!success) return;

          const oldTask = props.task; // store the old task
          const newTask = { ...props.task, value }; // just update the value

          // replace the old task with the new task
          const newTasks = props.tasks.value.map((task) => {
            if (task.id === oldTask.id) {
              return newTask;
            }
            return task;
          });
          props.tasks.set(newTasks);
        }}
        onChange={(e) => setValue(e.target.value)}
        defaultValue={props.task.value}
        id={props.task.id.toString()}
        className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50"
      ></textarea>

      {!editing && !confirm && (
        <div className="mt-2 flex flex-row gap-2">
          <CompleteButton
            user={props.user}
            tasks={props.tasks}
            task={props.task}
            completed={props.completed}
          />
          <DeleteButton onClick={() => setConfirm(true)} />
        </div>
      )}
      {!editing && confirm && (
        <div className="mt-2 flex flex-row gap-2">
          <ConfirmButton
            user={props.user}
            tasks={props.tasks}
            task={props.task}
          />
          <CancelButton onClick={() => setConfirm(false)} />
        </div>
      )}
    </div>
  );
}

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
  user: User;
  tasks: ObjectState<Task[]>;
  task: Task;
}
const ConfirmButton = (props: ConfirmButtonProps): JSX.Element => {
  return (
    <button
      onClick={async () => {
        let success: boolean = await deleteTask(props.user, props.task.id);
        if (!success) return;

        const newTasks: Task[] = props.tasks.value.filter(
          (task) => task.id !== props.task.id,
        );

        props.tasks.set(newTasks);
      }}
      className="flex flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
    >
      Confirm
    </button>
  );
};

interface CompleteButtonProps {
  user: User;
  task: Task;
  tasks: ObjectState<Task[]>;
  completed: ObjectState<Task[]>;
}
const CompleteButton = (props: CompleteButtonProps): JSX.Element => {
  return (
    <button
      className="flex w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
      onClick={async () => {
        let success: boolean = await setTaskToCompleted(
          props.user,
          props.task.id,
        );
        if (!success) return;

        // add the task to the completed list
        props.completed.set([...props.completed.value, props.task]);

        // remove the task from the main list
        const newTasks = props.tasks.value.filter(
          (task) => task.id !== props.task.id,
        );
        props.tasks.set(newTasks);
      }}
    >
      <CheckmarkSVG />
    </button>
  );
};
