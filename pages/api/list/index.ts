import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
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

  const list = await Prisma.getList(idNumber);
  res.status(200).json(list);
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name } = req.body;
  if (id === undefined || !name) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const idNumber: number = parseInt(id as string);

  const list = await Prisma.createList(idNumber, name);
  res.status(200).json(list);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  if (id === undefined) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const idNumber: number = parseInt(id as string);

  const list = await Prisma.deleteList(idNumber);
  res.status(200).json(list);
};
