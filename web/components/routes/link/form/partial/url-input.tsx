import * as React from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LinkFormValues } from "../schema"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { TooltipArrow } from "@radix-ui/react-tooltip"

interface UrlInputProps {
	urlFetched: string | null
	fetchMetadata: (url: string) => Promise<void>
}

export const UrlInput: React.FC<UrlInputProps> = ({ urlFetched, fetchMetadata }) => {
	const [isFocused, setIsFocused] = React.useState(false)
	const form = useFormContext<LinkFormValues>()

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && form.getValues("url")) {
			e.preventDefault()
			fetchMetadata(form.getValues("url"))
		}
	}

	const shouldShowTooltip = React.useMemo(() => {
		return isFocused && !form.formState.errors.url && !!form.getValues("url") && !urlFetched
	}, [isFocused, form.formState.errors.url])

	return (
		<FormField
			control={form.control}
			name="url"
			render={({ field }) => (
				<FormItem
					className={cn("grow space-y-0", {
						"hidden select-none": urlFetched
					})}
				>
					<FormLabel className="sr-only">Url</FormLabel>
					<FormControl>
						<TooltipProvider delayDuration={0}>
							<Tooltip open={shouldShowTooltip}>
								<TooltipTrigger asChild>
									<Input
										{...field}
										type={urlFetched ? "hidden" : "text"}
										autoComplete="off"
										maxLength={100}
										autoFocus
										placeholder="Paste a link or write a link"
										className="placeholder:text-muted-foreground/70 h-8 border-none p-1.5 text-[15px] font-semibold shadow-none focus-visible:ring-0"
										onKeyDown={handleKeyDown}
										onFocus={() => setIsFocused(true)}
										onBlur={() => setIsFocused(false)}
									/>
								</TooltipTrigger>
								<TooltipContent align="center" side="top">
									<TooltipArrow className="text-primary fill-current" />
									<span>
										Press <kbd className="px-1.5">Enter</kbd> to fetch metadata
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</FormControl>
					<FormMessage className="px-1.5" />
				</FormItem>
			)}
		/>
	)
}
