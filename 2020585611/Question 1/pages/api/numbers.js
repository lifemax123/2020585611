export default async function numberManagementService(req, res) {
	const { query } = req
	let urls

	if (typeof query.url === 'object' && !Array.isArray(query.url)) {
		urls = [query.url]
	} else {
		urls = query.url
	}
	const fetchPromises = urls.map(async (url) => {
		try {
			new URL(url)
			console.log({ url })
			const response = await fetch(url)
			let data = await response.json()
			console.log(data.numbers)
			return data.numbers
		} catch {
			throw new Error('The API Service is down')
		}
	})

	try {
		const finalArray = await Promise.all(fetchPromises)
		const numbers = finalArray.flat().sort((a, b) => a - b)
		await res.status(200).json({ numbers: numbers.flat() })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'The API is down right now, try reloading the page multiple times, this happens when the load is too much.' })
	}
}
