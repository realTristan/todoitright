"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";
import { rateLimited } from "@/app/lib/rate-limit";
import { decodeAuthorization } from "@/app/lib/auth";

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

  switch (req.method) {
    case "GET":
      return handleGet(res, accessToken);
    case "POST":
      return handlePost(req, res, accessToken);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/**
 * Gets the completed tasks for a user
 * @param res, accessToken
 * @returns Promise<void>
 */
const handleGet = async (res: NextApiResponse, accessToken: string) => {
  const tasks = await Prisma.getCompletedTasks(accessToken);
  res.status(200).json({ message: "Success", result: tasks });
};

/**
 * Sets a task to completed
 * @param req, res, accessToken
 * @returns Promise<void>
 */
const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  accessToken: string,
) => {
  const { task_id } = req.body;
  if (task_id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  // If we've reached max completed tasks
  const maxReached: boolean =
    await Prisma.hasReachedMaxCompletedTasks(accessToken);
  if (maxReached) {
    return res.status(400).json({ message: "Maximum completed tasks reached" });
  }

  const taskId: number = parseInt(task_id as string);
  const task = await Prisma.setTaskToCompleted(taskId, accessToken);
  res.status(200).json({ message: "Success", result: task });
};
