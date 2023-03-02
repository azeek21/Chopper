import { Schema, model, models } from "mongoose";
import { URL_DATA_INTERFACE } from "./url-model";

export interface USER_INTERFACE {
    uid: string,
    registered: boolean,
    urls: string[],
    secret?: string,
    name?: string,
    email?: string,
}

const UserSchema = new Schema<USER_INTERFACE>({
    uid: {
        type: String,
        required: true
    },
    registered: {
        type: Boolean,
        required: true,
    },
    secret: String,
    name: String,
    email: String,
    urls: {
        type: Array<String>,
        required: true,
    },  
})

const UserModel = models.myuser || model<USER_INTERFACE>('myuser', UserSchema);

export default UserModel;