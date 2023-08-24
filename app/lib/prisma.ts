import { PrismaClient } from "@prisma/client";
import { Task } from "./types";
import { MAX_COMPLETED_TASKS, MAX_TASKS } from "./constants";

export class Prisma extends PrismaClient {
  constructor() {
    super();
    this.$connect();
    console.log("Prisma connected");
  }

  /**
   * Finds many rows in a table
   * @param table The table to find in
   * @param where The where clause to find
   * @returns The rows found
   */
  public static readonly findMany = async <T>(
    table: string,
    where: any,
  ): Promise<T[]> => {
    const global = globalThis as any;
    return await global.prisma[table].findMany({ where });
  };

  /**
   * Finds a row in a table
   * @param table The table to find in
   * @param where The where clause to find
   * @returns The row found, or null if it doesn't exist
   */
  public static readonly findOne = async <T>(
    table: string,
    where: any,
  ): Promise<T | null> => {
    const global = globalThis as any;
    return await global.prisma[table].findFirst({ where });
  };

  /**
   * Creates a row in a table
   * @param table The table to create in
   * @param data The data to create
   * @returns The created row
   */
  public static readonly create = async <T>(
    table: string,
    data: any,
  ): Promise<T> => {
    const global = globalThis as any;
    return await global.prisma[table].create({ data });
  };

  /**
   * Updates a row in a table
   * @param table The table to update
   * @param where The where clause to update
   * @param data The data to update
   * @returns The updated row
   */
  public static readonly update = async <T>(
    table: string,
    where: any,
    data: any,
  ): Promise<T> => {
    const global = globalThis as any;
    return await global.prisma[table].update({ where, data });
  };

  /**
   * Deletes a row from a table
   * @param table The table to delete from
   * @param where The where clause to delete
   * @returns The deleted row
   */
  public static readonly delete = async <T>(
    table: string,
    where: any,
  ): Promise<T> => {
    const global = globalThis as any;
    return await global.prisma[table].delete({ where });
  };

  /**
   * Updates a task in the provided list
   * @param id The id of the old task to update
   * @param value The new value of the task
   * @param userAccessToken The access token of the user to update the task for
   * @returns The updated list
   */
  public static readonly updateTask = async (
    id: number,
    value: string,
    userAccessToken: string,
  ): Promise<any> => {
    const newTask: Task = { id, value };

    return (await Prisma.update(
      "Task",
      { id, userAccessToken },
      newTask,
    )) as Task;
  };

  /**
   * Removes a task from the provided list
   * @param userAccessToken The access token of the user to remove the task from
   * @returns The updated list
   */
  public static readonly createTask = async (
    userAccessToken: string,
  ): Promise<Task> => {
    return (await Prisma.create("Task", {
      value: "What to do? eh?",
      userAccessToken,
      completed: false,
    })) as Task;
  };

  /**
   * Deletes a task
   * @param id The id of the task to delete
   * @param userAccessToken The access token of the user to delete the task from
   * @returns The deleted task
   */
  public static readonly deleteTask = async (
    id: number,
    userAccessToken: string,
  ): Promise<Task> => {
    return (await Prisma.delete("Task", {
      id,
      userAccessToken,
    })) as Task;
  };

  /**
   * Creates a list
   * @param id The id of the list to create
   * @param userAccessToken The access token of the user to create the list for
   * @returns The created list
   */
  public static readonly setTaskToCompleted = async (
    id: number,
    userAccessToken: string,
  ): Promise<Task> => {
    return (await Prisma.update(
      "Task",
      { id, userAccessToken },
      { completed: true },
    )) as Task;
  };

  /**
   * Gets the completed tasks for a user
   * @param accessToken The access token of the user to get the completed tasks for
   * @returns The completed tasks for the user
   */
  public static readonly getCompletedTasks = async (
    accessToken: string,
  ): Promise<Task[]> => {
    return await Prisma.findMany("Task", {
      userAccessToken: accessToken,
      completed: true,
    });
  };

  /**
   * Gets the tasks for a user
   * @param accessToken The access token of the user to get the tasks for
   * @returns The tasks for the user
   */
  public static readonly getTasks = async (
    accessToken: string,
  ): Promise<Task[]> => {
    return await Prisma.findMany("Task", {
      userAccessToken: accessToken,
      completed: false,
    });
  };

  /**
   * Get whether or not we've reached the max amount of tasks
   * @param accessToken The access token of the user
   * @returns Whether we've reached the maximum amount of tasks
   */
  public static readonly hasReachedMaxTasks = async (
    accessToken: string,
  ): Promise<boolean> => {
    const tasks: Task[] = await Prisma.getTasks(accessToken);
    return tasks.length > MAX_TASKS;
  };

  /**
   * Get whether or not we've reached the max amount of completed tasks
   * @param accessToken The access token of the user
   * @returns Whether we've reached the maximum amount of completed tasks
   */
  public static readonly hasReachedMaxCompletedTasks = async (
    accessToken: string,
  ): Promise<boolean> => {
    const tasks: Task[] = await Prisma.getCompletedTasks(accessToken);
    return tasks.length > MAX_COMPLETED_TASKS;
  };
}

// create a global prisma instance
const global = globalThis as any;
if (!global.prisma) {
  global.prisma = new Prisma();
}
