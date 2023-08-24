"use client";

import { PlusSVG } from "@/app/components/Svgs";
import { LoadingRelative } from "@/app/components/Loading";

import { User, Task } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";
import { createTask } from "@/app/utils/api";
import { useState } from "react";

interface CreateTaskButtonProps {
  user: User;
  tasks: ObjectState<Task[]>;
}
export default function CreateTaskButton(
  props: CreateTaskButtonProps,
): JSX.Element {
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        let res: Response = await createTask(props.user);
        setDisabled(false);

        if (!res.ok) return;

        let json: any = await res.json();
        props.tasks.set([...props.tasks.value, json.result]);
      }}
      className="flex h-36 w-36 flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50 disabled:opacity-50"
    >
      {disabled ? <LoadingRelative className="h-10 w-10" /> : <PlusSVG />}
    </button>
  );
}
