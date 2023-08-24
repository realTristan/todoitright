import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";
import { Task } from "@/app/lib/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "PUT":
      return handlePut(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (id === undefined) {
    return res.status(400).json({ message: "Invalid query" });
  }

  const idNumber: number = parseInt(id as string);

  const task = await Prisma.getTask(idNumber);
  res.status(200).json(task);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { list_id } = req.body;
  if (list_id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const task = await Prisma.createTask(list_id);
  res.status(200).json(task);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { task_id, value, list_id } = req.body;
  if (list_id === undefined || task_id === undefined || !value) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const taskIdNumber: number = parseInt(task_id as string);
  const newTask: Task = { id: taskIdNumber, value };

  const task = await Prisma.updateTaskInList(taskIdNumber, newTask, list_id);
  res.status(200).json(task);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, list_id } = req.body;
  if (list_id === undefined || id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const idNumber: number = parseInt(id as string);

  const task = await Prisma.deleteTask(idNumber, list_id);
  res.status(200).json(task);
};
