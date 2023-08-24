import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";
import { rateLimited } from "@/app/lib/rate-limit";
import { decodeAuthorization } from "@/app/lib/auth";

/**
 * Main Handler
 * @param req, res
 * @returns Promise<void>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (await rateLimited(req, res)) {
    return res.status(429).json({ message: "Too Many Requests" });
  }

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const { email, accessToken } = await decodeAuthorization(authorization);
  if (!email || !accessToken) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  if (!Prisma.isValidAccessToken(email, accessToken)) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      return handleGet({ req, res, accessToken });
    case "POST":
      return handlePost({ req, res, accessToken });
    case "PUT":
      return handlePut({ req, res, accessToken });
    case "DELETE":
      return handleDelete({ req, res, accessToken });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Handler parameters
 */
interface HandlerParams {
  req: NextApiRequest;
  res: NextApiResponse;
  accessToken: string;
}

/**
 * Gets the tasks for a user
 * @param req, res, accessToken
 * @returns Promise<void>
 */
const handleGet = async ({ res, accessToken }: HandlerParams) => {
  const tasks = await Prisma.getTasks(accessToken);

  res.status(200).json(tasks);
};

/**
 * Creates a task
 * @param req, res, accessToken
 * @returns Promise<void>
 */
const handlePost = async ({ res, accessToken }: HandlerParams) => {
  const task = await Prisma.createTask(accessToken);

  res.status(200).json(task);
};

/**
 * Updates a task
 * @param req, res, accessToken
 * @returns Promise<void>
 */
const handlePut = async ({ req, res, accessToken }: HandlerParams) => {
  const { task_id, value } = req.body;
  if (task_id === undefined || !value) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const taskId: number = parseInt(task_id as string);
  const task = await Prisma.updateTask(taskId, value, accessToken);

  res.status(200).json(task);
};

/**
 * Deletes a task
 * @param req, res, accessToken
 * @returns Promise<void>
 */
const handleDelete = async ({ req, res, accessToken }: HandlerParams) => {
  const { task_id } = req.body;
  if (task_id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const taskId: number = parseInt(task_id as string);
  const task = await Prisma.deleteTask(taskId, accessToken);

  res.status(200).json(task);
};
