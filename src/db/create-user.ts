import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";
import UserModel, { USER_INTERFACE } from "./models/user-model";

export default function CreateUser(): Promise<
  HydratedDocument<USER_INTERFACE>
> {
  return new UserModel<USER_INTERFACE>({
    uid: randomUUID(),
    registered: false,
    secret: randomUUID(),
    urls: [],
  });
}
