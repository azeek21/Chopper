import { HydratedDocument } from "mongoose";
import { USER_INTERFACE } from "@/db/models/user-model";
import { PROVIDER_INTERFACE } from "@/db/models/user-model";
import { userHasProvider } from "./provider-utils";

export default async function handleCopy(
  user: HydratedDocument<USER_INTERFACE> | null,
  provider: PROVIDER_INTERFACE,
  profile: { name: string | null; email: string | null; image?: string }
) {
  if (user && !userHasProvider(user, provider)) {
    user.registered = true;
    user.email = profile.email || user.email || undefined;
    user.name = profile.name || user.name || undefined;
    if (profile.image && !user.image_url) {
      user.image_url = profile.image;
    }
    if (user.providers && user.providers.length >= 1) {
      user.providers.push(provider);
    } else {
      user.providers = [provider];
    }
    user.markModified("providers");
    await user.save();
  }
}
