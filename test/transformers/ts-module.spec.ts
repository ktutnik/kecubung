import * as Core from "../../src/core"
import { TsModuleTransformer } from "../../src/transformers/ts-module"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsModuleTransformer", () => {

    it("Should identify module properly", () => {
        let ast = JsParser.getAst(`
        (function (ChildModule) {
            
        })(ChildModule = MyModule.ChildModule || (MyModule.ChildModule = {}));
        `)
        let dummy = new TsModuleTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.children[0]).deep.eq(<Core.ParentMetaData>{
            type: "Module",
            name: "ChildModule",
            location: {
                column: 8, line: 2
            },
            analysis: Core.AnalysisType.Candidate
            | Core.AnalysisType.Exported,
            children: []
        });
    })

    it("Should not error when provided class", () => {
        let ast = JsParser.getAst(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.myMethod = function (par1) { };
            return MyClass;
        }());
        `)
        let dummy = new TsModuleTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.children.length).eq(0);
    })
})