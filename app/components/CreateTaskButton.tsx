"use client";

import { PlusSVG } from "@/app/components/Svgs";
import { List } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";

interface CreateTaskButtonProps {
  list: ObjectState<List>;
}
export default function CreateTaskButton(
  props: CreateTaskButtonProps,
): JSX.Element {
  return (
    <button
      onClick={async () => {
        let res: Response = await createTask(props.list.value.id);
        if (!res.ok) return;

        let json: any = await res.json();
        props.list.set({
          ...props.list.value,
          tasks: [
            ...props.list.value.tasks,
            {
              id: json.id,
              value: json.value,
            },
          ],
        });
      }}
      className="flex h-36 w-36 flex-col items-center justify-center rounded-md border-2 border-gray-100 bg-white px-10 py-3 hover:bg-gray-50"
    >
      <PlusSVG />
    </button>
  );
}

const createTask = async (listId: number): Promise<Response> => {
  return await fetch("/api/list/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ list_id: listId }),
  });
};
