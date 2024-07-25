"use client"
import { useState } from "react"
import { useAccount } from "@/lib/providers/jazz-provider"
import { IoSearch, IoCloseOutline, IoChevronForward } from "react-icons/io5"
import { SearchHeader } from "./header"

interface ProfileTopicsProps {
  topic: string
}

const ProfileTopics: React.FC<ProfileTopicsProps> = ({ topic }) => {
  return (
    <div className="flex cursor-pointer flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-white">
      <p>{topic}</p>
      <IoChevronForward className="text-white/50" size={20} />
    </div>
  )
}

interface ProfileLinksProps {
  linklabel: string
  link: string
  topic: string
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({
  linklabel,
  link,
  topic
}) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-white">
      <div className="flex flex-row items-center space-x-3">
        <p className="text-base text-white/90">{linklabel}</p>
        <div className="flex cursor-pointer flex-row items-center gap-1">
          {/* <icons.Link /> */}
          <p className="text-sm text-white/10 transition-colors duration-300 hover:text-white/30">
            {link}
          </p>
        </div>
      </div>
      <div className="cursor-default rounded-lg bg-[#1a1a1a] p-2 text-white/50">
        {topic}
      </div>
    </div>
  )
}

export const SearchWrapper = () => {
  const account = useAccount()
  const [searchText, setSearchText] = useState("")

  const clearSearch = () => {
    setSearchText("")
  }

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <SearchHeader />

      <div className="flex h-full w-full justify-center overflow-hidden">
        <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300 hover:text-white/60">
            <IoSearch className="absolute left-3 text-white/30" size={20} />
            <input
              type="text"
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-[10px] bg-[#16181d] p-10 py-3 pl-10 pr-3 font-light tracking-wider opacity-70 outline-none placeholder:font-light placeholder:text-white/30"
              placeholder="Search..."
            />
            {searchText && (
              <IoCloseOutline
                className="absolute right-3 cursor-pointer opacity-30"
                size={20}
                onClick={clearSearch}
              />
            )}
          </div>
          <div className="my-5 space-y-1">
            <p className="pb-3 pl-2 text-base font-light opacity-50">
              Topics <span className="opacity-70">1</span>
            </p>
            <ProfileTopics topic="Figma" />
          </div>

          <div className="my-5 space-y-1">
            <p className="pb-3 pl-2 text-base font-light opacity-50">
              Links <span className="text-white/70">3</span>
            </p>
            <ProfileLinks
              linklabel="Figma"
              link="https://figma.com"
              topic="Figma"
            />
            <ProfileLinks
              linklabel="Figma"
              link="https://figma.com"
              topic="Figma"
            />
            <ProfileLinks
              linklabel="Figma"
              link="https://figma.com"
              topic="Figma"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
