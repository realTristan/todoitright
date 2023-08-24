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

  if (!Prisma.isValidAccessToken(email, accessToken)) {
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

const handleGet = async (res: NextApiResponse, accessToken: string) => {
  const lists = await Prisma.getCompletedTasks(accessToken);
  res.status(200).json(lists);
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  accessToken: string,
) => {
  const { task_id } = req.body;
  if (task_id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const idNumber: number = parseInt(task_id as string);
  const task = await Prisma.setTaskToCompleted(idNumber, accessToken);
  res.status(200).json(task);
};
