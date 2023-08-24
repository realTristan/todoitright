"use client";

import { PlusSVG } from "@/app/components/Svgs";
import { User, Task } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";
import { createTask } from "@/app/utils/api";

interface CreateTaskButtonProps {
  user: User;
  tasks: ObjectState<Task[]>;
}
export default function CreateTaskButton(
  props: CreateTaskButtonProps,
): JSX.Element {
  return (
    <button
      onClick={async () => {
        let res: Response = await createTask(props.user);
        if (!res.ok) return;

        let json = await res.json();
        props.tasks.set([...props.tasks.value, json.result]);
      }}
      className="flex h-36 w-36 flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
    >
      <PlusSVG />
    </button>
  );
}
