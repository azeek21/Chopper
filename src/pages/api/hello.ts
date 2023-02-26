// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import REALM, { createUrlData } from '@/db';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({data: "SUCCESSFULE RESPONSE FROM BACK-END"})
}
