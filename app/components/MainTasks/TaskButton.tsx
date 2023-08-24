"use client";

import { ObjectState } from "@/app/lib/state";
import { Task, User } from "@/app/lib/types";
import { deleteTask } from "@/app/utils/api";
import { setTaskToCompleted } from "@/app/utils/api";

import TaskInput from "@/app/components/MainTasks/TaskInput";
import { CheckmarkSVG } from "@/app/components/Svgs";
import { LoadingRelative } from "@/app/components/Loading";

import { useState } from "react";

interface TaskButtonProps {
  user: User;
  task: Task;
  tasks: ObjectState<Task[]>;
  completed: ObjectState<Task[]>;
}
export default function TaskButton(props: TaskButtonProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="group relative flex flex-col">
      <TaskInput
        setEditing={setEditing}
        task={props.task}
        user={props.user}
        tasks={props.tasks}
      />

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
      className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50 disabled:opacity-50"
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
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        let success: boolean = await deleteTask(props.user, props.task.id);
        setDisabled(false);

        if (!success) return;

        const newTasks: Task[] = props.tasks.value.filter(
          (task) => task.id !== props.task.id,
        );

        props.tasks.set(newTasks);
      }}
      className="flex flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50 disabled:opacity-50"
    >
      {disabled ? <LoadingRelative className="h-5 w-5" /> : "Confirm"}
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
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      disabled={disabled}
      className="flex w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50 disabled:opacity-50"
      onClick={async () => {
        setDisabled(true);
        let success: boolean = await setTaskToCompleted(
          props.user,
          props.task.id,
        );
        setDisabled(false);

        if (!success) return;

        // add the task to the completed tasks
        props.completed.set([...props.completed.value, props.task]);

        // remove the task from the main tasks
        const newTasks: Task[] = props.tasks.value.filter(
          (task) => task.id !== props.task.id,
        );
        props.tasks.set(newTasks);
      }}
    >
      {disabled ? <LoadingRelative className="h-5 w-5" /> : <CheckmarkSVG />}
    </button>
  );
};
