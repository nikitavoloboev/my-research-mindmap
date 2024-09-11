// TODO: not sure if `links` should be separate service
// it is responsible for adding and getting links into LA from API

import { api, APIError } from "encore.dev/api"
import { startWorker } from "jazz-nodejs"
import { secret } from "encore.dev/config"
import log from "encore.dev/log"

const jazzWorkerSecret = secret("jazzWorkerSecret")

export const saveLink = api(
	{ expose: true, method: "POST", path: "/save-link" },
	// TODO: perhaps apiKey only is enough?
	async ({ url, email, apiKey }: { url: string; email: string; apiKey: string }): Promise<void> => {
		// const { worker } = await startWorker({
		// 	accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		// 	accountSecret: JAZZ_WORKER_SECRET
		// })

		// log.info(jazzWorkerSecret)

		if (!url.includes("http")) {
			throw APIError.invalidArgument("url must include http")
		}
		log.info("addPersonalLink", { url })
	}
)

export const getLinkDetails = api(
	{ expose: true, method: "GET", path: "/global-link-details/:url" },
	async ({
		url
	}: {
		url: string
	}): Promise<{
		title: string
		summary?: string
	}> => {
		// const { worker } = await startWorker({
		// 	accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		// 	accountSecret: JAZZ_WORKER_SECRET
		// })

		return {
			title: "Jazz",
			summary: "Jazz is local first framework for building web apps"
		}
	}
)
