import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@/app/lib/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const list = await Prisma.getList(1);
  res.status(200).json(list);
};
