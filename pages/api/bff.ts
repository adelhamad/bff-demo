import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

interface User {
	first_name: string
	last_name: string
	birthdate: string
	address: string
	created_at: string
}

interface Message {
	uid: string
	text: string
	created_at: string
	read: boolean
}

export interface Profile {
	name: string
	birthdate: Date
	address: string
	joined: Date
	last_seen: Date
	new_notifications: number
	new_messages: number
	new_friend_requests: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { host } = req.headers
	const api_url = `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${host}`

	let user_data = {} as User

	let messages_data = []
	let notifications_data = []
	let friend_requests_data = []
	let latest_message = {} as Message

	try {
		const response = await axios.get(`${api_url}/api/user`)
		const api_data: any = response.data
		user_data = api_data
	} catch (e) {
		console.error('error: ', e)
	}

	try {
		const response = await axios.get(`${api_url}/api/messages`, { params: { action: 'read', read: false } })
		const api_data: any = response.data
		messages_data = api_data
	} catch (e) {
		console.error('error: ', e)
	}

	try {
		const response = await axios.get(`${api_url}/api/messages`, { params: { action: 'get_latest' } })
		const api_data: any = response.data
		latest_message = api_data
	} catch (e) {
		console.error('error: ', e)
	}

	try {
		const response = await axios.get(`${api_url}/api/notifications`, { params: { action: 'seen', seen: false } })
		const api_data: any = response.data
		notifications_data = api_data
	} catch (e) {
		console.error('error: ', e)
	}

	try {
		const response = await axios.get(`${api_url}/api/friend_requests`)
		const api_data: any = response.data
		friend_requests_data = api_data
	} catch (e) {
		console.error('error: ', e)
	}

	const profile: Profile = {
		name: `${user_data.first_name} ${user_data.last_name}`,
		birthdate: new Date(user_data.birthdate),
		address: user_data.address,
		joined: new Date(user_data.created_at),
		last_seen: new Date(parseInt(latest_message.created_at) * 1000),
		new_notifications: notifications_data.length,
		new_messages: messages_data.length,
		new_friend_requests: friend_requests_data.length,
	}

	res.status(200).json(profile)
}
