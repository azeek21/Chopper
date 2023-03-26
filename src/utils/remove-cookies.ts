import { serialize } from "cookie";
import { NextApiResponse } from "next";
import dayjs from "dayjs";

export default function removeCookies(res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    serialize("weak-uid", "", {
      maxAge: -1,
      path: "/",
    }),
    serialize("weak-secret", "", {
      maxAge: -1,
      path: "/",
    }),
    serialize("weak-registered", "true", {
      expires: dayjs().add(999, "year").toDate(),
      sameSite: "lax",
      path: "/",
    }),
  ]);
}
