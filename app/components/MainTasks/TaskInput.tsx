import { Task, User } from "@/app/lib/types";
import { useState } from "react";
import { ObjectState } from "@/app/lib/state";
import { updateTask } from "@/app/utils/api";

interface TaskInputProps {
  task: Task;
  user: User;
  tasks: ObjectState<Task[]>;
  setEditing: Function;
}
export default function TaskInput(props: TaskInputProps): JSX.Element {
  const [value, setValue] = useState(props.task.value);
  const [disabled, setDisabled] = useState(false);

  return (
    <textarea
      id={props.task.id.toString()}
      className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-14 py-3 text-center hover:bg-gray-50 disabled:opacity-50"
      disabled={disabled}
      defaultValue={props.task.value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => props.setEditing(true)}
      onBlur={async () => {
        props.setEditing(false);

        if (value === props.task.value) {
          return;
        }

        setDisabled(true);
        let success: boolean = await updateTask(
          props.user,
          props.task.id,
          value,
        );
        setDisabled(false);

        if (!success) return;

        const oldTask: Task = props.task; // store the old task
        const newTask: Task = { ...props.task, value }; // just update the value

        // replace the old task with the new task
        const newTasks: Task[] = props.tasks.value.map((task) => {
          if (task.id === oldTask.id) return newTask;

          return task;
        });
        props.tasks.set(newTasks);
      }}
    ></textarea>
  );
}
