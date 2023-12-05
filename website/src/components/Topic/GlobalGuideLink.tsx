import { ui } from "@la/shared"
import clsx from "clsx"
import { Show, createEffect, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useUser } from "../../GlobalContext/user"
import { useMobius } from "../../root"

interface Props {
  title: string
  id: string
  url: string
  protocol: string
  year?: string
  description?: string
}

export default function GlobalGuideLink(props: Props) {
  const mobius = useMobius()
  const topic = useGlobalTopic()
  const user = useUser()
  const global = useGlobalState()
  const navigate = useNavigate()
  const [expandedLink, setExpandedLink] = createSignal(false)
  createEffect(() => {
    let timeoutId: any

    const targetElement = document.getElementById(props.id)

    function handleMouseEnter() {
      clearTimeout(timeoutId) // Clear the timeout if the mouse re-enters before 1 second
    }
    console.log("wtf")
    function handleMouseLeave() {
      timeoutId = setTimeout(() => {
        setExpandedLink(false)
        // Your code to execute after 1 second of leaving the element
      }, 1000)
    }
    if (targetElement && expandedLink()) {
      targetElement.addEventListener("mouseenter", handleMouseEnter)
      targetElement.addEventListener("mouseleave", handleMouseLeave)
    }
  })
  return (
    <>
      <style>
        {`
        @media (min-width: 640px) {
          .GlobalGuideLink:hover #LinkIcons > * {
            display: flex;
          }
        }
      `}
      </style>
      <div
        class={clsx(
          "GlobalGuideLink flex-between overflow-hidden  border-b-[0.5px] dark:border-[#282828] border-[#69696951] p-4 px-4  min-h-[60px]"
        )}
        onClick={() => {
          if (window.innerWidth < 644) {
            setExpandedLink(!expandedLink())
          }
        }}
        id={props.id}
      >
        <div class="w-full h-full flex-col sm:flex-row flex sm:flex-between sm:gap-10">
          <div class={clsx("w-fit flex-gap-[10px]", props.description && "")}>
            <div
              id="LinkTitle"
              class="flex gap-1 flex-col items-start sm:gap-3 sm:flex-row sm:items-center"
            >
              <a
                class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer break-all"
                href={`${props.protocol}://${props.url}`}
              >
                {props.title}
              </a>
              <Show when={props.year}>
                <div class="font-light text-[12px] text-[#696969]">
                  {props.year}
                </div>
              </Show>
              <a
                class="font-light text-[12px] text-[#696969] text-ellipsis w-[250px] overflow-hidden whitespace-nowrap"
                href={`${props.protocol}://${props.url}`}
              >
                {props.url}
              </a>
            </div>
            <div class="flex gap-3">
              <Show when={props.description}>
                <div class="font-light text-[14px] text-white text-opacity-50">
                  {props.description}
                </div>
              </Show>
            </div>
          </div>
          <div class="flex items-center gap-[34px] relative self-end sm:self-center">
            {/* <div
              onMouseOver={() => setShowOtherIcons(true)}
              onMouseOut={() => setShowOtherIcons(false)}
              class="flex gap-3 bg-white w-[24px] h-[24px] transition-all rounded-[4px]"
            >
              <div
                class={clsx(
                  "absolute top-0 left-0 transition-all h-full",
                  showOtherIcons() && "left-[-24%] w-[50px] "
                )}
              >
                <div class="bg-red-500 w-fit h-full flex items-center justify-center">
                  <ui.Icon name="Delete"></ui.Icon>
                </div>
              </div>

              <div class="bg-green-500 w-full h-full">
                <ui.Icon name="Bug"></ui.Icon>
              </div>
            </div> */}
            <div
              id="LinkIcons"
              class={clsx(
                "hidden sm:!flex sm:gap-4",
                expandedLink() && "gap-4 transition-all !flex animate-iconSlide"
              )}
              // class={clsx("hidden", showAllIcons() && "flex gap-4")}
            >
              {/* TODO: change how icon looks when link is already added. activated state  */}
              {/* UI of being pressed in */}
              {/* <ui.IconButton
                  onClick={async () => {
                    console.log("test")
                  }}
                  class={clsx(
                    "cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-red-500 flex  items-center hover:[&>*]:scale-[0.9] transition-all justify-center border h-[26px] w-[26px] border-[#69696929] dark:border-[#2e2e2ec8]",
                    topic.globalTopic.likedLinkIds.includes(props.id) &&
                      "bg-red-500 border-none transition-all"
                  )}
                  icon="Bookmark"
                  activeIcon={topic.globalTopic.likedLinkIds.includes(props.id)}
                /> */}
              <ui.ToolTip label="Bookmark">
                <div
                  onClick={async () => {
                    if (!user.user.signedIn) {
                      localStorage.setItem(
                        "pageBeforeSignIn",
                        location.pathname
                      )
                      navigate("/auth")
                      return
                    }
                    if (!user.user.member) {
                      global.setShowMemberOnlyModal(true)
                      return
                    }
                    if (topic.globalTopic.likedLinkIds.includes(props.id)) {
                      topic.set(
                        "likedLinkIds",
                        topic.globalTopic.likedLinkIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "unlike",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      topic.set("likedLinkIds", [
                        ...topic.globalTopic.likedLinkIds,
                        props.id
                      ])
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "like",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-red-500 items-center hover:[&>*]:scale-[0.9] transition-all justify-center border h-[26px] w-[26px] border-[#69696929] dark:border-[#2e2e2ec8]",
                    topic.globalTopic.likedLinkIds.includes(props.id) &&
                      "bg-red-500 border-none transition-all !flex"
                  )}
                >
                  <ui.Icon
                    name="Bookmark"
                    fill="white"
                    border={
                      topic.globalTopic.likedLinkIds.includes(props.id)
                        ? "red"
                        : "black"
                    }
                  />
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="Todo">
                <div
                  onClick={async () => {
                    if (!user.user.signedIn) {
                      localStorage.setItem(
                        "pageBeforeSignIn",
                        location.pathname
                      )
                      navigate("/auth")
                      return
                    }
                    if (!user.user.member) {
                      global.setShowMemberOnlyModal(true)
                      return
                    }
                    if (topic.globalTopic.likedLinkIds.includes(props.id)) {
                      topic.set(
                        "likedLinkIds",
                        topic.globalTopic.likedLinkIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "unlike",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      topic.set("likedLinkIds", [
                        ...topic.globalTopic.likedLinkIds,
                        props.id
                      ])
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "like",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[2px] dark:hover:bg-neutral-950 items-center hover:opacity-50 transition-all justify-center border h-[26px] w-[26px] border-[#69696951] dark:border-[#282828]",
                    topic.globalTopic.likedLinkIds.includes(props.id) &&
                      "bg-red-500 border-none transition-all !flex"
                  )}
                >
                  <ui.Icon
                    name="Hourglass"
                    fill="white"
                    border={
                      topic.globalTopic.likedLinkIds.includes(props.id)
                        ? "red"
                        : "black"
                    }
                  />
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="Complete">
                <div
                  onClick={async () => {
                    if (!user.user.signedIn) {
                      localStorage.setItem(
                        "pageBeforeSignIn",
                        location.pathname
                      )
                      navigate("/auth")
                      return
                    }
                    if (!user.user.member) {
                      global.setShowMemberOnlyModal(true)
                      return
                    }
                    if (topic.globalTopic.completedLinkIds.includes(props.id)) {
                      topic.set(
                        "completedLinkIds",
                        topic.globalTopic.completedLinkIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "uncomplete",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      topic.set("completedLinkIds", [
                        ...topic.globalTopic.completedLinkIds,
                        props.id
                      ])
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "complete",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 items-center hover:[&>*]:scale-[0.9] transition-all justify-center border h-[26px] w-[26px] border-[#69696929] dark:border-[#2e2e2ec8]",
                    topic.globalTopic.completedLinkIds.includes(props.id) &&
                      "bg-blue-500 bg-opacity border-none !flex"
                  )}
                >
                  <ui.Icon
                    name="Checkmark"
                    border={
                      topic.globalTopic.completedLinkIds.includes(props.id)
                        ? global.state.theme === "light"
                          ? "black"
                          : "white"
                        : global.state.theme === "dark"
                          ? "white"
                          : "black"
                    }
                    width="24"
                    height="24"
                  />
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="Like">
                <div
                  onClick={async () => {
                    if (!user.user.signedIn) {
                      localStorage.setItem(
                        "pageBeforeSignIn",
                        location.pathname
                      )
                      navigate("/auth")
                      return
                    }
                    if (!user.user.member) {
                      global.setShowMemberOnlyModal(true)
                      return
                    }
                    if (topic.globalTopic.likedLinkIds.includes(props.id)) {
                      topic.set(
                        "likedLinkIds",
                        topic.globalTopic.likedLinkIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "unlike",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      topic.set("likedLinkIds", [
                        ...topic.globalTopic.likedLinkIds,
                        props.id
                      ])
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "like",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[2px] dark:hover:bg-neutral-950 items-center hover:opacity-50 transition-all justify-center border h-[26px] w-[26px] border-[#69696951] dark:border-[#282828]",
                    topic.globalTopic.likedLinkIds.includes(props.id) &&
                      "bg-red-500 border-none transition-all !flex"
                  )}
                >
                  <ui.Icon
                    name="Heart"
                    fill="white"
                    border={
                      topic.globalTopic.likedLinkIds.includes(props.id)
                        ? "red"
                        : "black"
                    }
                  />
                </div>
              </ui.ToolTip>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
