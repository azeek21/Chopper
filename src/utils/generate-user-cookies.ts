import { USER_INTERFACE } from "@/db/models/user-model";
import { serialize } from "cookie";
import dayjs from "dayjs";

export default function generateUserCookies(user: USER_INTERFACE) {
    const expiration_date = dayjs().add(1, "year").toDate();

    const uid = serialize("weak-uid", user.uid, {
        path: "/",
        expires: expiration_date,
        sameSite: true,
    })

    const secret = serialize("weak-secret", user.secret!, {
        path: "/",
        expires: expiration_date,
        sameSite: true,
    });

    return {
        uid: uid,
        secret: secret,
    }
};
