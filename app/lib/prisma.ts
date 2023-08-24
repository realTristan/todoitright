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
   * Get a table
   * @param table The table to get
   * @returns The table
   */
  public static readonly getTable = async (name: string) => {
    const global = globalThis as any;
    return global.prisma[name];
  };

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
    const tableRef: any = await Prisma.getTable(table);
    return await tableRef.findMany({ where });
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
    const tableRef: any = await Prisma.getTable(table);
    return await tableRef.findFirst({ where });
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
    const tableRef: any = await Prisma.getTable(table);
    return await tableRef.create({ data });
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
    const tableRef: any = await Prisma.getTable(table);
    return await tableRef.update({ where, data });
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
    const tableRef: any = await Prisma.getTable(table);
    return await tableRef.delete({ where });
  };

  /**
   * Updates a task
   * @param id The id of the old task to update
   * @param value The new value of the task
   * @param userAccessToken The access token of the user to update the task for
   * @returns The updated task
   */
  public static readonly updateTask = async (
    id: number,
    value: string,
    userAccessToken: string,
  ): Promise<any> => {
    // Table, where to update the data, the data to update
    const task: Task = await Prisma.update(
      "Task",
      { id, userAccessToken }, // Find the task with the id and access token
      { value }, // Update the value of the task
    );

    return task;
  };

  /**
   * Creates a new task
   * @param userAccessToken The access token of the user to remove the task from
   * @returns The created task
   */
  public static readonly createTask = async (
    userAccessToken: string,
  ): Promise<Task> => {
    const task: Task = await Prisma.create("Task", {
      value: "What to do? eh?",
      userAccessToken,
      completed: false,
    });

    return task;
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
    const task: Task = await Prisma.delete("Task", {
      id,
      userAccessToken,
    });

    return task;
  };

  /**
   * Sets a task to completed
   * @param id The id of the task to set to completed
   * @param userAccessToken The access token of the user to set the task to completed for
   * @returns The completed task
   */
  public static readonly setTaskToCompleted = async (
    id: number,
    userAccessToken: string,
  ): Promise<Task> => {
    const task: Task = await Prisma.update(
      "Task",
      { id, userAccessToken },
      { completed: true },
    );

    return task;
  };

  /**
   * Gets the completed tasks for a user
   * @param accessToken The access token of the user to get the completed tasks for
   * @returns The completed tasks for the user
   */
  public static readonly getCompletedTasks = async (
    accessToken: string,
  ): Promise<Task[]> => {
    const tasks: Task[] = await Prisma.findMany("Task", {
      userAccessToken: accessToken,
      completed: true,
    });

    return tasks;
  };

  /**
   * Gets the tasks for a user
   * @param accessToken The access token of the user to get the tasks for
   * @returns The tasks for the user
   */
  public static readonly getTasks = async (
    accessToken: string,
  ): Promise<Task[]> => {
    const tasks: Task[] = await Prisma.findMany("Task", {
      userAccessToken: accessToken,
      completed: false,
    });

    return tasks;
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
    return tasks.length >= MAX_TASKS;
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
    return tasks.length >= MAX_COMPLETED_TASKS;
  };
}

// create a global prisma instance
const global = globalThis as any;
if (!global.prisma) {
  global.prisma = new Prisma();
}
