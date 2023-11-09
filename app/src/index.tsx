/* @refresh reload */
import { render } from "solid-js/web"

import "./root.css"
import App from "./routes"

render(() => <App />, document.getElementById("root") as HTMLElement)
