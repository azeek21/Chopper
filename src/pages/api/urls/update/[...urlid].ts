import mongoClient from "@/db/connect";
import getUrl from "@/db/get-url";
import getUser from "@/db/get-user";
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat);

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    // if request is not POST
    if (!(req.method == "POST")) {
        res.status(400).json({ error: "Bad request. This type of request is not allowed."});
        return ;
    }

    console.log("UPDATE >>>");
    console.log("BODY>");
    console.log(typeof(req.body));
    console.log(req.body);
    
    
    

    let urlid = req.query.urlid;
    if (!urlid || (urlid && typeof(urlid) == "object") && urlid.length > 1) {
        res.status(400).json({ error: "Bad request! updates should be to and only to /api/urls/update/urlid as a post request."})
        return ;
    }
    urlid = typeof(urlid) == "string" ? urlid : urlid[0];
    await mongoClient();
    const user = await getUser(req);

    // if user doesn't exist
    if (!user) {
        res.status(400).json({error: "Bad request! User not found. If you think this is a bug/mistake, please let me know at https://github.com/azeek21"});
        return ;
    };

    // if user doesn't own this url
    if ( !user.urls || !(user.urls.includes(urlid)) ) {
        res.status(400).json({ error: "Bad request! This url doesn't belong to this user." })
        return ;
    };

    const url = await getUrl(req, urlid, user);
    // if url fails to load or smhw
    if (!url) {
        res.status(400).json({ error: "Something went wrong. Plase report it to https://github.com/azeek21. error code: 1. Description: User urls includes url but url can't be found in db"});
        return ;
    }

    const data = JSON.parse(req.body);
    // validate the request body
    const datetimeRegex = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/
    // checking timeout (expiration date)
    if (data.timeout) {
        // if timeout was not a string
        if (typeof(data.timeout) !== "string") {
            res.status(400).json({ error: "Bad request. Expiration date must be a string in \"YYYY-MM-DD\" format."})
            return ;
        }

        // if expiration date doesn't match the format
        if (!(datetimeRegex.test(data.timeout))) {
            res.status(400).json({ error: "Bad request. Expiration date doesn't match the needed format: \"YYYY-MM-DD\" "});
            return ;
        }
    };


    const onlynumsRegex = /^[0-9]*$/;
    // check limit (only number);
    if (data.limit) {
        // if limit is not string and not  number;
        if (typeof(data.limit) != "string" && typeof(data.limit) != "number") {
            res.status(400).json({ error: "Bad request. Limit must be a string of only numbers or an actual number. "});
            return ;
        };

        // if limimt is a string but contains chars other thank numbers
        if (typeof(data.limit) == "string" && !(onlynumsRegex.test(data.limit))) {
            res.status(400).json({ error: "Bad request. Limit must be a string of only numbers or an actual number. "});
            return ;
        };
    };

    if (typeof(data.password) != "string") {
        res.status(400).json({ error: "Bad request. Password must be a valid string"});
        return ;
    };

    // update the url
    url.password = data.password;
    url.limit = data.limit;
    if (!data.timeout) {
        url.timeout = undefined;
    } else {
        url.timeout = dayjs(data.timeout, "YYYY-MM-DD").unix();
    }
    await url.save();
    res.status(201).json({...(url.toJSON()), timeout: url.timeout ? dayjs.unix(url.timeout).format("YYYY-MM-DD") : ""});
    return ;
};
