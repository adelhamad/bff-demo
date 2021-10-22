import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../data/notifications.json'

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const { seen, action } = req.query
	if (action === 'seen') {
		const boolean_seen = seen === 'true' // because it's query params, so it's string
		const seen_messages = data.filter((item) => Boolean(item.seen) === boolean_seen)
		res.status(200).json(seen_messages)
	} else if (action === 'get_latest') {
		const latest = data.reduce(function (prev, current) {
			return parseInt(prev.created_at) > parseInt(current.created_at) ? prev : current
		})
		res.status(200).json(latest)
	} else {
		res.status(200).json([])
	}
}
