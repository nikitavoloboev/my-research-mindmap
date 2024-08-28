"use client"

import * as React from "react"
import { ListFilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { useMedia } from "react-use"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { atom } from "jotai"
import { LEARNING_STATES } from "@/lib/constants"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import { FancySwitch } from "@omit/react-fancy-switch"
import { cn } from "@/lib/utils"

const ALL_STATES = [{ label: "All", value: "all", icon: "List", className: "text-foreground" }, ...LEARNING_STATES]
const ALL_STATES_STRING = ALL_STATES.map(ls => ls.value)

export const learningStateAtom = atom<string>("all")

export const LinkHeader = React.memo(() => {
	const isTablet = useMedia("(max-width: 1024px)")

	return (
		<>
			<ContentHeader className="px-6 py-5 max-lg:px-4">
				<div className="flex min-w-0 shrink-0 items-center gap-1.5">
					<SidebarToggleButton />
					<div className="flex min-h-0 items-center">
						<span className="truncate text-left text-xl font-bold">Links</span>
					</div>
				</div>

				{!isTablet && <LearningTab />}

				<div className="flex flex-auto"></div>

				<FilterAndSort />
			</ContentHeader>

			{isTablet && (
				<div className="border-b-primary/5 flex min-h-10 flex-row items-start justify-between border-b px-6 py-2 max-lg:pl-4">
					<LearningTab />
				</div>
			)}
		</>
	)
})

LinkHeader.displayName = "LinkHeader"

const LearningTab = React.memo(() => {
	const [activeTab, setActiveTab] = useAtom(learningStateAtom)
	const [activeState, setActiveState] = useQueryState(
		"state",
		parseAsStringLiteral(Object.values(ALL_STATES_STRING)).withDefault(ALL_STATES_STRING[0])
	)

	const handleTabChange = React.useCallback(
		(value: string) => {
			setActiveTab(value)
			setActiveState(value)
		},
		[setActiveTab, setActiveState]
	)

	React.useEffect(() => {
		setActiveTab(activeState)
	}, [activeState, setActiveTab])

	return (
		<FancySwitch
			value={activeTab}
			onChange={value => {
				handleTabChange(value as string)
			}}
			options={ALL_STATES}
			className="bg-secondary flex rounded-lg"
			highlighterClassName="bg-secondary-foreground/10 rounded-lg"
			radioClassName={cn(
				"relative mx-2 flex h-8 cursor-pointer items-center justify-center rounded-full px-1 text-sm text-secondary-foreground/60 data-[checked]:text-secondary-foreground font-medium transition-colors focus:outline-none"
			)}
			highlighterIncludeMargin={true}
		/>
	)
})

LearningTab.displayName = "LearningTab"

const FilterAndSort = React.memo(() => {
	const [sort, setSort] = useAtom(linkSortAtom)
	const [sortOpen, setSortOpen] = React.useState(false)

	const getFilterText = React.useCallback(() => {
		return sort.charAt(0).toUpperCase() + sort.slice(1)
	}, [sort])

	const handleSortChange = React.useCallback(
		(value: string) => {
			setSort(value)
			setSortOpen(false)
		},
		[setSort]
	)

	return (
		<div className="flex w-auto items-center justify-end">
			<div className="flex items-center gap-2">
				<Popover open={sortOpen} onOpenChange={setSortOpen}>
					<PopoverTrigger asChild>
						<Button size="sm" type="button" variant="secondary" className="gap-x-2 text-sm">
							<ListFilterIcon size={16} className="text-primary/60" />
							<span className="hidden md:block">Filter: {getFilterText()}</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-72" align="end">
						<div className="flex flex-col">
							<div className="flex min-w-8 flex-row items-center">
								<Label>Sort by</Label>
								<div className="flex flex-auto flex-row items-center justify-end">
									<Select value={sort} onValueChange={handleSortChange}>
										<SelectTrigger className="h-6 w-auto">
											<SelectValue placeholder="Select"></SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="title">Title</SelectItem>
											<SelectItem value="manual">Manual</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
})

FilterAndSort.displayName = "FilterAndSort"
