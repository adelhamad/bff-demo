import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../data/friend_requests.json'

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	res.status(200).json(data)
}
