import { Schema, model, models } from "mongoose";
import { URL_DATA_INTERFACE } from "./url-model";

interface USER_INTERFACE {
    uid: string,
    name?: string,
    email?: string,
    urls?: string[],
}

const UserSchema = new Schema<USER_INTERFACE>({
    uid: {
        type: String,
        required: true
    },
    name: String,
    email: String,
    urls: Array<string>,
})

const UserModel = models.myuser || model<USER_INTERFACE>('myuser', UserSchema);

export default UserModel;