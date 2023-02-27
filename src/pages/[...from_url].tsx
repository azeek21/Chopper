import UrlModel from "@/db/models/url-model";
import { GetServerSidePropsContext } from "next";

export default function RedirectTo(props: any) {

    console.log(props.data);
    
    return <h1>Redirecting ...</h1>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const dest_id = context.query.from_url;
    // get from_url's destination from database.
    const res = await UrlModel.findOne({
        from_url: dest_id
    }).exec();
    res.toJson();
    // return {
    //     redirect: {
    //         destination: "https://google.com/",
    //         permanent: true
    //     } 
    // }
    return {
        props: {
            data: res.toJson(),
        }
    }
}