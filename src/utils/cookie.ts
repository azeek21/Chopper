import Cookies from "js-cookie";

type cookietype = {
    noCookie: boolean,
    uid?: string,
    secret?: string,
};

export function getCookie (): cookietype | null {
  const noCookie = Cookies.get("no-cookie");
  const uid = Cookies.get("weak-uid");
  const secret = Cookies.get("weak-secret");
  
  let res: cookietype = {
    noCookie: false,
  };

  if ( noCookie ) {
    // means user disagreed do have cookies
    res.noCookie = true;
    return res;
  } else if (uid && secret) {
    // means user agreed to have cookies
    res.noCookie = false;
    res.uid = uid;
    res.secret = secret;
    return res;
  }
  // means user didn't asnwer
  return null;
};
