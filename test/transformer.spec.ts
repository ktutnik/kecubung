import * as Core from "../src/core"
import { Transformer } from "../src/transformer"
import { JsParser } from "./helper"
import * as Chai from "chai"
import * as Fs from "fs"
import * as Path from "path"
import * as Babylon from "babylon"
import * as Util from "util"

describe("Transformer", () => {

    describe("Real test", () => {
        it("Should transform TypeScript generated file properly", () => {
            let filename = "./dummy/dummy.js"
            let code = Fs.readFileSync(Path.join(__dirname, filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let result = dummy.transform(ast);
            //console.log(Util.inspect(result.children, false, null))
            Chai.expect(Path.resolve(result.name)).eq(Path.resolve(filename))
            Chai.expect(result.children[0]).deep.property("children[0].name", "MyBaseClass")
            Chai.expect(result.children[0]).deep.property("children[1].name", "MyClass")
        })

        it("Should transform TypeScript (4.5 MB) file in less than 1 second", function () {
            this.timeout(10000)
            let filename = "./node_modules/typescript/lib/typescript.js"
            let code = Fs.readFileSync(Path.join(process.cwd(), filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let start = new Date()
            let result = dummy.transform(ast);
            let end = new Date();
            let gap = end.getTime() - start.getTime();
            console.log("EXEC TIME: " + gap)
            Chai.expect(gap).lessThan(1000)
        })
    })
})