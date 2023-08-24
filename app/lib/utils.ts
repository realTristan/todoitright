import { Task, List } from "./types";

export const removeTaskFromList = (task: Task, list: List): List => {
  return {
    ...list,
    tasks: list.tasks.filter((t) => t.id !== task.id),
  };
};

export const updateTaskInList = (
  oldTask: Task,
  newTask: Task,
  list: List,
): List => {
  return {
    ...list,
    tasks: list.tasks.map((t) => {
      if (t.id === oldTask.id) return newTask;
      return t;
    }),
  };
};

export const deleteTaskFromDatabase = async (
  task_id: number,
  list_id: number,
): Promise<boolean> => {
  return await fetch("/api/list/tasks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: task_id, list_id }),
  }).then((res) => res.status === 200);
};
