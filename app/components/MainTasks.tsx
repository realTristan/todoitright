import { User, Task } from "@/app/lib/types";
import { ObjectState } from "@/app/lib/state";

import CreateTaskButton from "@/app/components/CreateTaskButton";
import TaskButton from "@/app/components/TaskButton";
import { MAX_TASKS } from "../lib/constants";

interface MainTasksProps {
  user: User;
  main: ObjectState<Task[]>;
  completed: ObjectState<Task[]>;
}
export default function MainTasks(props: MainTasksProps) {
  return (
    <div className="mb-8 flex flex-col rounded-md border-2 border-dotted p-10">
      <h2 className="mb-4 text-2xl font-bold">
        Tasks
        <mark className="bg-transparent font-normal">
          ({props.main.value.length}/{MAX_TASKS})
        </mark>
      </h2>
      <ul className="flex flex-wrap gap-6">
        <CreateTaskButton tasks={props.main} user={props.user} />
        {props.main.value.map((task: any) => (
          <TaskButton
            user={props.user}
            tasks={props.main}
            task={task}
            key={Math.random()}
            completed={props.completed}
          />
        ))}
      </ul>
    </div>
  );
}
