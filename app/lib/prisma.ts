import { PrismaClient } from "@prisma/client";
import { List, Task } from "./types";
import { COMPLETED_LIST_ID, MAIN_LIST_ID } from "./constants";

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
   * Gets all tasks in a list
   * @param id The id of the list to get tasks from
   * @returns All tasks in the list with the given id
   */
  public static readonly getlistTasks = async (id: number): Promise<Task[]> =>
    await Prisma.findMany("Task", { listId: id });

  /**
   * Gets a list by id
   * @param id The id of the list to get
   * @returns The list with the given id, or null if it doesn't exist
   */
  public static readonly getList = async (id: number): Promise<List | null> => {
    const list: List | null = await Prisma.findOne("List", { id });
    if (!list) return null;

    list.tasks = await Prisma.getlistTasks(id);
    return list;
  };

  /**
   * Gets the main list
   * @returns The main list
   */
  public static readonly getMainList = async (): Promise<List | null> =>
    await Prisma.getList(MAIN_LIST_ID);

  /**
   * Gets the completed list
   * @returns The completed list
   */
  public static readonly getCompletedList = async (): Promise<List | null> =>
    await Prisma.getList(COMPLETED_LIST_ID);

  /**
   * Creates a list
   * @param id The id of the list to create
   * @param name The name of the list to create
   * @returns The created list
   */
  public static readonly createList = async (
    id: number,
    name: string,
  ): Promise<List> =>
    (await Prisma.create("List", {
      id,
      name,
      tasks: { create: [{ value: "Task 1" }, { value: "Task 2" }] },
    })) as List;

  /**
   * Deletes a list
   * @param id The id of the list to delete
   * @returns The deleted list
   */
  public static readonly deleteList = async (id: number): Promise<List> =>
    (await Prisma.delete("List", { id })) as List;

  /**
   * Updates a task in the provided list
   * @param oldTask The old task to update
   * @param newTask The new task to update
   * @param list The list to update the task in
   * @returns The updated list
   */
  public static readonly updateTaskInList = async (
    taskId: number,
    newTask: Task,
    listId: number,
  ): Promise<any> => {
    return await Prisma.update(
      "List",
      { id: listId },
      {
        tasks: {
          update: {
            where: { id: taskId },
            data: newTask,
          },
        },
      },
    );
  };

  /**
   * Removes a task from the provided list
   * @param task The task to remove
   * @param list The list to remove the task from
   * @returns The updated list
   */
  public static readonly createTask = async (listId: number): Promise<Task> =>
    (await Prisma.create("Task", { listId, value: "None" })) as Task;

  /**
   * Deletes a task
   * @param id The id of the task to delete
   * @param listId The id of the list to delete the task from
   * @returns The deleted task
   */
  public static readonly deleteTask = async (
    id: number,
    listId: number,
  ): Promise<Task> => (await Prisma.delete("Task", { id, listId })) as Task;

  /**
   * Gets a task by id
   * @param id The id of the task to get
   * @returns The task with the given id, or null if it doesn't exist
   */
  public static readonly getTask = async (id: number): Promise<Task | null> =>
    await Prisma.findOne("Task", { id });

  /**
   * Moves a task to a different list
   * @param id The id of the task to move
   * @param listId The id of the list to move the task to
   * @returns The moved task
   */
  public static readonly moveTask = async (
    id: number,
    listId: number,
  ): Promise<Task> => (await Prisma.update("Task", { id }, { listId })) as Task;
}

// create a global prisma instance
const global = globalThis as any;
if (!global.prisma) {
  global.prisma = new Prisma();
}

// if no list, create one
/*
Prisma.getMainList().then((list) => {
  if (!list) {
    Prisma.create("List", {
      name: "Tasks",
      tasks: {
        create: [{ value: "Task 1" }, { value: "Task 2" }, { value: "Task 3" }],
      },
    });
  }
});

Prisma.getCompletedList().then((list) => {
  if (!list) {
    Prisma.create("List", {
      name: "Completed",
      tasks: {
        create: [{ value: "Task 4" }],
      },
    });
  }
});
*/
