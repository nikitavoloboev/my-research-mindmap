import { FancyButton, ModalWithMessageAndButton } from "@la/shared/ui"
import { listen } from "@tauri-apps/api/event"
import { open } from "@tauri-apps/api/shell"
import { invoke } from "@tauri-apps/api/tauri"
import { Show, onMount } from "solid-js"
import { isLoggedIn } from "../lib/lib"
import { useGlobalState } from "./GlobalContext/global"
import { useUser } from "./GlobalContext/user"
import { useWiki } from "./GlobalContext/wiki"
import SearchModal from "./components/SearchModal"
import Sidebar from "./components/Sidebar"
import { Monaco } from "./components/Monaco/Monaco"
import Modal from "./components/Modal"
import clsx from "clsx"
import Checkbox from "./components/checkbox"

export default function App() {
  const global = useGlobalState()
  const user = useUser()
  const wiki = useWiki()

  // TODO: CMD+L = search files/topics in wiki
  // there was some issue with CMD+L not triggering, fix
  // TODO: should these bindings be placed in this file? also they should be customisable
  // similar to https://x.com/fabiospampinato/status/1722729570573430979
  // createShortcut(["Control", "L"], () => {
  //   if (user.user.mode === "Search Topics") {
  //     user.setMode("Default")
  //   } else {
  //     user.setMode("Search Topics")
  //   }
  // })

  // starts a listner for signed-in-token event (used for authentication)
  onMount(async () => {
    await listen<[path: string, params: any]>("signed-in-token", (event) => {
      const [path, params] = event.payload
      if (path === "/login") {
        // TODO: store in sqlite instead!
        // due to: Localstorage is not a guarantee that you have absolute persistence And the OS can always decide to prune ANY localstorage, and even cookies
        const hankoToken = params.hankoToken
        localStorage.setItem("hanko", hankoToken)
        global.set("showModal", "")
      }
    })
  })

  return (
    <>
      <div class="flex flex-col " style={{ width: "100vw", height: "100vh" }}>
        <Show when={user.user.mode === "Settings"}>
          <Modal>
            <div class="w-5/6 h-4/5 bg-white p-[24px] px-[30px] dark:bg-neutral-900 rounded-lg border-2 dark:border-neutral-700 border-slate-400">
              <div class="text-[32px] font-bold">Settings</div>
              <Checkbox
                state={global.state.showBox}
                setter={global.setShowBox}
              />
            </div>
          </Modal>
        </Show>
        <div class="flex h-full items-center dark:bg-[#1e1e1e] bg-white grow">
          <Show when={global.state.localFolderPath}>
            <Sidebar />
          </Show>
          <Show
            when={
              global.state.localFolderPath && global.state.currentlyOpenFile
            }
          >
            <div class="h-full overflow-auto w-full">
              <div class="absolute bottom-1 right-1 py-2 px-4 text-lg z-50">
                <FancyButton
                  onClick={async () => {
                    const loggedIn = isLoggedIn(global)
                    console.log(loggedIn, "logged in")
                    // TODO: publish current note to user's wiki
                  }}
                >
                  Publish
                </FancyButton>
              </div>
              {/* TODO: commented out codemirror as it was giving issues */}
              {/* such as, line wrapping: https://discuss.codemirror.net/t/linewrapping-true-fails-with-ts-error-and-does-not-work/7408/5 */}
              {/* and styling cursor to white in dark theme failed: https://discuss.codemirror.net/t/codemirror-cursor-class-does-not-work-in-safari/7409/3 */}
              {/* if it can be resolved, codemirror can be considered for use again */}
              {/* <CodemirrorEditor /> */}

              {/* monaco editor is chosen instead until then, it might be a better option in long term too as its used by vscode */}
              {/* and can be styled/tuned to achieve all the tasks we need */}
              {/* in LA we should be able to edit code inline in some code blocks with LSP support perhaps in some instances, monaco can allow this */}
              <Monaco />
            </div>
          </Show>

          <Show
            when={
              !global.state.localFolderPath &&
              localStorage.getItem("localFolderPath") === null
            }
          >
            <div class="w-full h-full flex justify-center items-center flex-col gap-5">
              <div>
                <FancyButton
                  onClick={async () => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    const connectedFolder = (await invoke("connect_folder", {
                      command: {},
                    })) as [string, File[]] | null
                    if (connectedFolder !== null) {
                      global.set("localFolderPath", connectedFolder[0])
                      // @ts-ignore
                      global.set("files", connectedFolder[1])
                    }
                  }}
                >
                  Connect folder
                </FancyButton>
              </div>
            </div>
          </Show>

          <Show when={user.user.mode === "Search Topics"}>
            <SearchModal
              items={wiki.wiki.topics}
              action={() => {}}
              searchPlaceholder="Search Topics"
            />
          </Show>
          <Show when={global.state.showModal === "needToLoginInstructions"}>
            <ModalWithMessageAndButton
              // TODO: maybe have submessage? or have `message` accept solid JSX so you can have paragraphs?
              message={
                "Press the button below to login with browser. If you're already logged in to learn-anything.xyz, it will automatically redirect you to desktop. You might need to accept a pop up window to go back to desktop. If not logged in, you will need to login in browser first then it will prompt you to go back."
              }
              buttonText="Login"
              buttonAction={async () => {
                if (import.meta.env.VITE_LOCAL) {
                  localStorage.setItem(
                    "hanko",
                    import.meta.env.VITE_HANKO_TOKEN,
                  )
                  return
                }
                await open(import.meta.env.VITE_LA_DESKTOP_SIGNIN_URL)
              }}
              onClose={() => {
                global.set("showModal", "")
              }}
            />
          </Show>
        </div>
      </div>
    </>
  )
}
