import { classToStyle } from "../../class-to-style/class-to-style.mjs"
import { runHtmlWithJs, convertToWebComponent } from "../html-with-js.mjs"
import { App, initApp } from "./app.mjs"

console.log("🚀 ~ App:", App)
runHtmlWithJs([document.body], App)

classToStyle(document)

convertToWebComponent("./web-components/app-layout.html")
convertToWebComponent("./web-components/app-button.html")
convertToWebComponent("./web-components/app-formfield.html")

initApp()