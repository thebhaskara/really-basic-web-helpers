import { classToStyle } from "../../class-to-style/class-to-style.mjs"
import { runHtmlWithJs, convertToWebComponent } from "../html-with-js.mjs"

runHtmlWithJs([document.body], { name: "John", numbers: [10, 20, 10, 30] })

classToStyle(document)

convertToWebComponent("./web-component-1.html")
