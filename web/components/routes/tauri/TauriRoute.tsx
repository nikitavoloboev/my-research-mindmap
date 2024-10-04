"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
// import { open } from "@tauri-apps/plugin-dialog"

export default function TauriRoute() {
	const { me } = useAccount({
		root: {}
	})
	// console.log({ pages: me?.root?.personalPages?.toJSON() })

	// TODO: ugly code, just to get folder connecting working
	return (
		<div className="mb-5 flex flex-col">
			{/* {me?.root?.connectedFolderPath && (
				<div className="flex flex-col gap-4">
					<div>Connected folder: {me.root.connectedFolderPath}</div>
					<button
						onClick={async () => {
							const folderPath = await open({
								multiple: false,
								directory: true
							})
							console.log(folderPath)
							if (folderPath && me?.root) {
								me.root.connectedFolderPath = folderPath
							}
						}}
					>
						Change folder
					</button>
					<button
						onClick={async () => {
							if (me?.root) {
								me.root.connectedFolderPath = ""
							}
						}}
					>
						Disconnect folder
					</button>
				</div>
			)} */}
			{/* {!me?.root?.connectedFolderPath && (
				<button
					onClick={async () => {
						const folderPath = await open({
							multiple: false,
							directory: true
						})
						console.log(folderPath)
						if (folderPath && me?.root) {
							me.root.connectedFolderPath = folderPath
						}
					}}
				>
					Connect folder
				</button>
			)} */}
			{/* TODO: loads a lot more data than expected */}
			{/* {JSON.stringify(me?.root?.personalPages)} */}
		</div>
	)
}
