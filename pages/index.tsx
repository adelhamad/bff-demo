import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Profile } from './api/bff'
import axios from 'axios'
import dayjs from 'dayjs'

const Home: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [profile, setProfile] = useState<Profile>({} as Profile)
	const [loadingResponse, setLoadingResponse] = useState<boolean>(false)
	const [response, setResponse] = useState<any>(undefined)
	const apiPath = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/api` : '/api'

	useEffect(() => {
		setLoading(true)
		axios
			.get(`${apiPath}/bff`)
			.then((res) => {
				setLoading(false)
				const resProfile: Profile = res.data as Profile
				setProfile(resProfile)
			})
			.catch(console.error)
	}, [apiPath])

	const handleBffRes = () => {
		setResponse(profile)
	}

	const handleMsgRes = () => {
		setLoadingResponse(true)
		axios
			.get(`${apiPath}/messages`, { params: { action: 'read', read: false } })
			.then((res) => {
				setLoadingResponse(false)
				setResponse(res.data)
			})
			.catch(console.error)
	}

	const handleUsrRes = () => {
		setLoadingResponse(true)
		axios
			.get(`${apiPath}/user`)
			.then((res) => {
				setLoadingResponse(false)
				setResponse(res.data)
			})
			.catch(console.error)
	}

	const handleNotiRes = () => {
		setLoadingResponse(true)
		axios
			.get(`${apiPath}/notifications`, { params: { action: 'seen', seen: false } })
			.then((res) => {
				setLoadingResponse(false)
				setResponse(res.data)
			})
			.catch(console.error)
	}

	const handleFrndRes = () => {
		setLoadingResponse(true)
		axios
			.get(`${apiPath}/friend_requests`)
			.then((res) => {
				setLoadingResponse(false)
				setResponse(res.data)
			})
			.catch(console.error)
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>BFF Demo</title>
				<meta name="description" content="Simple demo for BFF Backend for Frontend" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>{loading ? 'Loading...' : profile.name}</h1>

				{loading ? (
					<p className={styles.description}>Loading...</p>
				) : (
					<>
						<p className={styles.description}>
							<strong>Birthdate:</strong> {profile.birthdate}
						</p>
						<p className={styles.description}>
							<strong>Address:</strong> {profile.address}
						</p>
						<p className={styles.description}>
							<strong>Joined:</strong> {dayjs(profile.joined).format('YYYY-MM-DD')}
						</p>
						<p className={styles.description}>
							<strong>Last Seen (Last Recieved Message):</strong> {dayjs(profile.last_seen).format('YYYY-MM-DD')}
						</p>
						<p className={styles.description}>
							<strong>New Notifications:</strong> {profile.new_notifications}
						</p>
						<p className={styles.description}>
							<strong>New Messages:</strong> {profile.new_messages}
						</p>
						<p className={styles.description}>
							<strong>New Friend Requests:</strong> {profile.new_friend_requests}
						</p>
					</>
				)}

				<div className={styles.buttons}>
					<button onClick={handleBffRes} className={styles.button} type="button">
						View BFF Response
					</button>
					<button onClick={handleUsrRes} className={styles.button} type="button">
						View User Response
					</button>
					<button onClick={handleMsgRes} className={styles.button} type="button">
						View Messages Service Response
					</button>
					<button onClick={handleNotiRes} className={styles.button} type="button">
						View Notifications Service Response
					</button>
					<button onClick={handleFrndRes} className={styles.button} type="button">
						View Friends Service Response
					</button>
				</div>
				{response && (
					<div className={styles.grid}>
						<div className={styles.card}>
							<h2>Response &darr;</h2>
							<pre className={styles.pre}>
								<code className={styles.code}>{loadingResponse ? 'loading...' : JSON.stringify(response, null, 4)}</code>
							</pre>
						</div>
					</div>
				)}
			</main>

			<footer className={styles.footer}>
				<a href="https://twitter.com/adelscript" target="_blank" rel="noopener noreferrer">
					@adelscript
				</a>
			</footer>
		</div>
	)
}

export default Home
