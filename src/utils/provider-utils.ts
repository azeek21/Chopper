import { PROVIDER_OPTIONS } from "@/db/get-user";
import { PROVIDER_INTERFACE, USER_INTERFACE } from "@/db/models/user-model";
import { HydratedDocument } from "mongoose";

export function userHasProvider(
	user: HydratedDocument<USER_INTERFACE>,
	provider: PROVIDER_OPTIONS
): boolean {
	if (getUserProvider(user, provider)) {
		return true;
	}
	return false;
}

export function getUserProvider(
	user: HydratedDocument<USER_INTERFACE>,
	provider: PROVIDER_OPTIONS
): PROVIDER_INTERFACE | null {
	if (!user.providers || user.providers.length === 0) {
		return null;
	}

	const foundProvider = user.providers.find(
		(prov) => prov.name == provider.name && prov.id == provider.id
	);

	if (foundProvider) {
		return foundProvider;
	}
	return null;
}
