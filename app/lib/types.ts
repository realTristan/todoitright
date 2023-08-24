import { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface Task {
  id: number;
  value: string;
}

export interface List {
  id: number;
  name: string;
  tasks: Task[];
}

export interface User {
  email: string | null;
  image: string | null;
  name: string | null;
  accessToken: string | null;
}
