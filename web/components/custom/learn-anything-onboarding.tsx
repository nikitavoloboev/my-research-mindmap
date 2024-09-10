"use client"

import React, { useEffect, useState } from "react"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { isExistingUser } from "@/app/actions"

const hasVisitedAtom = atomWithStorage("hasVisitedLearnAnything", false)
const isDialogOpenAtom = atom(true)

export function LearnAnythingOnboarding() {
	const [hasVisited, setHasVisited] = useAtom(hasVisitedAtom)
	const [isOpen, setIsOpen] = useAtom(isDialogOpenAtom)
	const [isFetching, setIsFetching] = useState(true)

	useEffect(() => {
		const loadUser = async () => {
			try {
				const shouldShow = await isExistingUser()
				setIsOpen(shouldShow)
			} catch (error) {
				console.error("Error loading user:", error)
			} finally {
				setIsFetching(false)
			}
		}

		if (!hasVisited) {
			loadUser()
		}
	}, [hasVisited])

	const handleClose = () => {
		setIsOpen(false)
		setHasVisited(true)
	}

	if (hasVisited || isFetching) return null

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent className="max-w-xl">
				<AlertDialogHeader>
					<AlertDialogTitle>
						<h1 className="text-2xl font-bold">Welcome to Learn Anything!</h1>
					</AlertDialogTitle>
				</AlertDialogHeader>

				<AlertDialogDescription className="text-foreground/70 space-y-4 text-base leading-5">
					<p className="font-medium">Existing Customer Notice</p>
					<p>
						We noticed you are an existing Learn Anything customer. We sincerely apologize for any broken experience you
						may have encountered on the old website. We've been working hard on this new version, which addresses
						previous issues and offers more features. As an early customer, you're locked in at the <strong>$3</strong>{" "}
						price for our upcoming pro version. Thank you for your support!
					</p>
					<p>
						Learn Anything is a learning platform that organizes knowledge in a social way. You can create pages, add
						links, track learning status of any topic, and more.
					</p>
					<p>Try these quick onboarding steps to get a feel for the product:</p>
					<ul className="list-inside list-disc">
						<li>Create your first page</li>
						<li>Add a link to a resource</li>
						<li>Update your learning status on a topic</li>
					</ul>
					<p>
						If you have any questions, don't hesitate to reach out. Click on your name in the bottom left corner, select
						"Feedback", and enter your message.
					</p>
				</AlertDialogDescription>

				<AlertDialogFooter className="mt-4">
					<AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
					<AlertDialogAction onClick={handleClose}>Get Started</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default LearnAnythingOnboarding
