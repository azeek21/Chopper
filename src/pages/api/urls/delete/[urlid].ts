import deleteUrl from "@/db/delete-url";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res
      .status(400)
      .json({ error: "Bad request. This type of request not allowed." });
    return;
  }

  const query = req.query.urlid;

  if (!query) {
    res.status(400).json({ error: "Bad request. Failed to parse urlid." });
    return;
  }

  const user = await getUser(req);
  if (!user) {
    res.status(400).json({ error: "User not found, or not allowed." });
    return;
  }

  const deleted = await deleteUrl(query as string, user);
  if (deleted) {
    res.status(200).json({ success: true });
    return;
  }

  res.status(400).json({
    error:
      "FATAL! Something went wrong please report to https://github.com/azeek21 !",
  });
}
