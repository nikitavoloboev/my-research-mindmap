"use client"

import React, { useEffect, ReactNode } from "react"

interface DeepLinkProviderProps {
	children: ReactNode
}

export function DeepLinkProvider({ children }: DeepLinkProviderProps) {
	useEffect(() => {
		const eventHandlers: { [key: string]: (event: Event) => void } = {
			click: (event: Event) => {
				const e = event as MouseEvent
				// console.log("Click event:", { x: e.clientX, y: e.clientY })
			},
			keydown: (event: Event) => {
				const e = event as KeyboardEvent
				// console.log("Keydown event:", { key: e.key, code: e.code })
			}
		}

		// Add event listeners
		Object.entries(eventHandlers).forEach(([eventType, handler]) => {
			window.addEventListener(eventType, handler)
		})

		// Set up file watching
		let stopWatching: (() => void) | undefined
		let stopRawWatcher: (() => void) | undefined

		// const setupFileWatchers = async () => {
		// 	try {
		// 		stopWatching = await watch(
		// 			// TODO: should not hard code this, should get it from jazz
		// 			"~/src/org/learn-anything/learn-anything.xyz/private/vaults/nikiv",
		// 			event => {
		// 				const { kind, path } = event
		// 				console.log("File watch event:", { kind, path })
		// 			},
		// 			{ recursive: true }
		// 		)

		// 		stopRawWatcher = await watchImmediate(
		// 			["/path/a", "/path/b"],
		// 			event => {
		// 				const { type, paths, attrs } = event
		// 				console.log("Raw file watch event:", { type, paths, attrs })
		// 			},
		// 			{}
		// 		)
		// 	} catch (error) {
		// 		console.error("Error setting up file watchers:", error)
		// 	}
		// }
		// setupFileWatchers()

		// Cleanup function
		return () => {
			// Remove event listeners
			Object.entries(eventHandlers).forEach(([eventType, handler]) => {
				window.removeEventListener(eventType, handler)
			})

			// Stop file watchers
			if (stopWatching) stopWatching()
			if (stopRawWatcher) stopRawWatcher()
		}
	}, [])

	return <>{children}</>
}
