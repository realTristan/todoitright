import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const list = await Prisma.getList(2);
  res.status(200).json(list);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { task_id } = req.body;
  if (task_id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const idNumber: number = parseInt(task_id as string);

  const task = await Prisma.moveTask(idNumber, 2);
  res.status(200).json(task);
};
