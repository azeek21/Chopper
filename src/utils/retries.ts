import { Retry_Interface, USER_INTERFACE } from "@/db/models/user-model";
import dayjs from "dayjs";
import { HydratedDocument } from "mongoose";

export function getRetryObject(user: USER_INTERFACE, urlid: string) {
  if (user.retries) {
    const retryObject = user.retries.filter((retry) => retry.urlid === urlid);
    if (retryObject.length > 0) {
      return retryObject[0];
    }
  }
  return null;
}

export function createRetryObject(urlid: string): Retry_Interface {
  return {
    urlid: urlid,
    count: 0,
    max_retry_count: 3,
  };
}

// return true if user didn't have retry object and added successfully;
// return false if user already had such object and nothing will be changed;
export function addRetryObject(
  user: HydratedDocument<USER_INTERFACE>,
  retryObject: Retry_Interface
) {
  if (!user.retries) {
    user.retries = [retryObject];
    return true;
  }
  const obj = getRetryObject(user, retryObject.urlid);
  if (obj) {
    return false;
  }
  user.retries = [...user.retries, retryObject];
  user.markModified('retries')
  return true;
}

// updates user's retry object to retryObject passed to it or adds it if doesn't exist;
// returns void;
// ! be careful, retry object will be replaced by passed object as a whole;
export function updateRetryObject(
  user: HydratedDocument<USER_INTERFACE>,
  retryObject: Retry_Interface
): void {
  if (!user.retries) {
    user.retries = [retryObject];
    return;
  }
  const all = user.retries.filter((retry) => retry.urlid != retryObject.urlid);
  user.retries = [...all, retryObject];
  user.markModified('retries')
}

// increments retry count of retry object with urlid of urlid and returns true
// returns false if retry object with urlid not found;
export function incrementRetryCount(user: HydratedDocument<USER_INTERFACE>, urlid: string) {
  let retryObject = getRetryObject(user, urlid);
  if (!retryObject) {
    return false;
  }

  retryObject.count += 1;
  updateRetryObject(user, retryObject);
  user.markModified("retries")
  return true;
}

// returns if user can try to access the url
// returns true if cooldown is over and retry count is less than limit
// returns false if not allowable or such return object doesn't exist, be careful;
export function isAllowable(user: USER_INTERFACE, urlid: string) {
  const retryObject = getRetryObject(user, urlid);
  if (!retryObject) {
    return true;
  }
  // if user didn't hit the limit
  if (retryObject.count < retryObject.max_retry_count) {

    // if this url has cooldown
    if (retryObject.cools_at) {
        const now = dayjs().unix();
        // if not cooled yet ;
        if (retryObject.cools_at > now) {
            return false;
        }
    };

    // if limit wasn't reached and url was cool;
    return true;
  };

  return false;
};


export function resetUserRetries(user: HydratedDocument<USER_INTERFACE>, urlid: string) {
    const retryObject = getRetryObject(user, urlid);

    if (!retryObject) {
        const newObj = createRetryObject(urlid);
        addRetryObject(user, newObj);
        return true;
    }

    if (!retryObject.cools_at) {
        retryObject.count = 0;
        retryObject.max_retry_count = 3;
        updateRetryObject(user, retryObject);
        return true;
    };
    
    const now = dayjs().unix();
    if (retryObject.cools_at > now) {
        return false;
    };
    
    retryObject.cools_at = undefined;
    retryObject.count = 0;
    retryObject.max_retry_count = 3;
    updateRetryObject(user, retryObject);
    user.markModified("retries")
    return true;
}


export function deleteRetryObject (user: HydratedDocument<USER_INTERFACE>, urlid: string) {
  if (user.retries) {
    user.retries = user.retries.filter(retry => retry.urlid != urlid);
  }
  user.markModified("retries")
}