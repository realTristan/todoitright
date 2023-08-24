import { generateAuthorization } from "@/app/lib/auth";
import { User } from "@/app/lib/types";

const TASKS_ENDPOINT: string = "/api/user/tasks";
const COMPLETED_TASKS_ENDPOINT: string = "/api/user/tasks/completed";

export const getMainTasks = async (user: User): Promise<Response> => {
  return await fetchWithAuthorization(user, TASKS_ENDPOINT, {
    method: "GET",
  });
};

export const getCompletedTasks = async (user: User): Promise<Response> => {
  return await fetchWithAuthorization(user, COMPLETED_TASKS_ENDPOINT, {
    method: "GET",
  });
};

/**
 * Delete a task (sending api request to the database)
 * @param user The user who's deleting the task
 * @param task_id The id of the task to delete
 * @returns Whether the deletion was successful
 */
export const deleteTask = async (
  user: User,
  task_id: number,
): Promise<boolean> => {
  return await fetchWithAuthorization(user, "/api/user/task", {
    method: "DELETE",
    body: JSON.stringify({ task_id }),
  }).then((res: Response) => res.ok);
};

/**
 * Create a new task (sending api request to the database)
 * @param user The user who's creating the task
 * @returns The created task (http response, need to parse json)
 */
export const createTask = async (user: User): Promise<Response> => {
  return await fetchWithAuthorization(user, TASKS_ENDPOINT, {
    method: "POST",
  });
};

/**
 * Update a task (sending api request to the database)
 * @param user The user who's updating the task
 * @param task_id The id of the task to update
 * @param value The new task value
 * @returns Whether the update was successful
 */
export const updateTask = async (
  user: User,
  task_id: number,
  value: string,
): Promise<boolean> => {
  return await fetchWithAuthorization(user, TASKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ task_id, value }),
  }).then((res: Response) => res.ok);
};

export const setTaskToCompleted = async (
  user: User,
  task_id: number,
): Promise<boolean> => {
  return await fetchWithAuthorization(user, COMPLETED_TASKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ task_id }),
  }).then((res: Response) => res.ok);
};

/**
 * Send an http request with authorization header
 * @param user The user who's sending the request
 * @param url The url to send the request to
 * @param options The fetch options (except for header)
 * @returns The http response
 */
const fetchWithAuthorization = async (
  user: User,
  url: string,
  options: any,
): Promise<Response> => {
  const authorization = await generateAuthorization(
    user.accessToken,
    user.email,
  );

  return await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      authorization,
    },
  });
};
