import { Schema, model, models } from "mongoose";

export interface URL_DATA_INTERFACE {
    from_url: string,
    to_url: string,
    owner: string,
    created_at: number,
    clicks: number,
    password?: string,
    limit?: number,
    timeout?: number,
}

const URL_DATA_SCHEMA = new Schema<URL_DATA_INTERFACE>({
    from_url: {type: String,required: true},
    to_url: {type: String, required: true},
    owner: {type: String, required: true},
    created_at: {type: Number, default: Date.now()},
    clicks: {type: Number, default: 0},
    password: String,
    limit: Number,
    timeout: Number,
})

const UrlModel = models.UrlModel || model<URL_DATA_INTERFACE>("redirections", URL_DATA_SCHEMA)

export default UrlModel;

