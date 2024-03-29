import { Schema, model, models } from "mongoose";

export interface Retry_Interface {
  urlid: string;

  // number of retries, will be set to 0 if password is correct before max_retrty_count;
  count: number;

  // max number of retries user has before cooldown will be set or be doubled and set.
  max_retry_count: number;

  // unix date that user will be able to retry the password or access the url after;
  // every time count is bigger that max_retry_count cooldown (this) will double;
  cools_at?: number;

  last_cooldown_duration?: number;
}

export interface PROVIDER_INTERFACE {
  name: string;
  id: string;
}

export interface USER_INTERFACE {
  uid: string;
  registered: boolean;
  urls: Array<string>;
  secret?: string;
  name?: string;
  email?: string;
  has_access_to?: string[];
  retries?: Array<Retry_Interface>;
  providers?: Array<PROVIDER_INTERFACE>;
  image_url?: string;
}

const UserSchema = new Schema<USER_INTERFACE>({
  uid: {
    type: String,

    required: true,
  },
  registered: {
    type: Boolean,
    required: true,
  },
  urls: Array<String>,
  secret: String,
  name: String,
  email: String,
  has_access_to: Array<String>,
  retries: Array<Retry_Interface>,
  providers: Array<PROVIDER_INTERFACE>,
  image_url: String,
});

const UserModel = models.myuser || model<USER_INTERFACE>("myuser", UserSchema);

export default UserModel;
