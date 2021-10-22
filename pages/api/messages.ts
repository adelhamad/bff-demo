import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../data/messages.json'

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const { read, action } = req.query

    if (action === 'read') {
        const boolean_read = read === 'true' // because it's query params, so it's string
        const read_messages = data.filter(item => item.read === boolean_read)
        res.status(200).json(read_messages)
    } else if (action === 'get_latest') {
		const latest = data.reduce(function (prev, current) {
			return parseInt(prev.created_at) > parseInt(current.created_at) ? prev : current
		})
		res.status(200).json(latest)
	} else {
		res.status(200).json([])
	}

}
