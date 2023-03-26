import { HydratedDocument } from "mongoose";
import UrlModel from "./models/url-model";
import { USER_INTERFACE } from "./models/user-model";

export default async function deleteUrl(
  urlid: string,
  user: HydratedDocument<USER_INTERFACE>
) {
  if (!urlid || !user) {
    return false;
  }

  const res = await UrlModel.deleteOne({
    urlid: urlid,
    owner: user.uid,
  }).exec();

  if (res.deletedCount >= 1) {
    const cur_index = user.urls.indexOf(urlid);
    if (cur_index != -1) {
      user.urls.splice(cur_index, 1);
    }
    await user.save();
    return true;
  }
  return false;
}
