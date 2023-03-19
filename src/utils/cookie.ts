import Cookies from "js-cookie";

type cookietype = {
    noCookie: boolean,
    uid?: string,
    secret?: string,
    registered?: boolean,
};

export function getCookie (): cookietype | null {
  const noCookie = Cookies.get("no-cookie");
  const uid = Cookies.get("weak-uid");
  const secret = Cookies.get("weak-secret");
  const registered = Cookies.get('weak-registered');
  
  let res: cookietype = {
    noCookie: false,
  };

  if (registered === "true") {
    res.registered = true;
    return res;
  }

  if ( (!uid || !secret) || registered === undefined) {
    res.noCookie = true;
    return res;
  } else if (uid && secret) {
    // means user agreed to have cookies
    res.noCookie = false;
    res.uid = uid;
    res.secret = secret;
    res.registered = false;
    return res;
  }
  // means user didn't asnwer
  return null;
};
