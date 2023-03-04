import mongoClient from "@/db/connect";
import UrlModel, { URL_DATA_INTERFACE } from "@/db/models/url-model";
import { HydratedDocument } from "mongoose";
import { GetServerSidePropsContext } from "next";
import dayjs from "dayjs";

export default function RedirectTo(props: any) {
  console.log(props.data);

  return <h1>Red directing ...</h1>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const dest_id = context.query.from_url;
  console.log(dest_id);
  
  if (dest_id) {
    await mongoClient();
    const doc = await UrlModel.findOne<HydratedDocument<URL_DATA_INTERFACE>>({
      urlid: dest_id[0],
    }).exec();

    const now = dayjs().unix();

    if (!doc || (doc.timeout && now > doc.timeout) || (doc.limit && doc.clicks >= doc.limit)) {
        return {
            notFound: true,
        }
    }

    doc.clicks = doc.clicks + 1;
    await doc.save();
    console.log(doc)
    return {
      redirect: {
        destination: doc.to_url,
        permanent: true,
      },
    };
  }

  return {
    notFound: true,
  }
}
