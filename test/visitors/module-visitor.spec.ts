import { AnalysisType, MetaData, MetaDataFactory, flag } from "../../src/core"
import { ModuleVisitor } from "../../src/visitors/module-visitor"
import { JsParser } from "../helper"
import * as Chai from "chai"



describe("Module Visitor", () => {
    let dummy:ModuleVisitor;
    beforeEach(() => {
        dummy = new ModuleVisitor(new MetaDataFactory())
    })

    it("Should identify module properly", () => {
        let ast = JsParser.getAst(`
            (function (MyModule) {

            })(MyModule = exports.MyModule || (exports.MyModule = {}));
        `)
        let result = dummy.start(ast.expression, null, null);
        Chai.expect((result.analysis & AnalysisType.Candidate)).eq(AnalysisType.Candidate);
    })

    it("Should identify inner module properly", () => {
        let ast = JsParser.getAst(`
            (function (InnerModule) {

            })(InnerModule = MyModule.InnerModule || (MyModule.InnerModule = {}));
        `)
        let result = dummy.start(ast.expression, null, null);
        Chai.expect((result.analysis & AnalysisType.Candidate)).eq(AnalysisType.Candidate);
    })

    it("Should identify non exported module", () => {
        let ast = JsParser.getAst(`
            (function (InnerModule) {

            })(InnerModule || (InnerModule = {}));
        `)
        let result = dummy.start(ast.expression, null, null);
        Chai.expect((result.analysis & AnalysisType.Candidate)).eq(AnalysisType.Candidate);
    })

    it("Should return null if identification fail", () => {
        let ast = JsParser.getAst(`
            (function () {

            })();
        `)
        let result = dummy.start(ast.expression, null, null);
        Chai.expect(result).null
    })

    it("Should analyze and verify module", () => {
        let ast = JsParser.getAst(`
            (function (InnerModule) {

            })(InnerModule = MyModule.InnerModule || (MyModule.InnerModule = {}));
        `)
        let module:MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children:[<MetaData>{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Exported,
                children: []
            }]
        }
        let parent:MetaData = {
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children:[]
        }
        dummy.exit(ast.expression, module, parent);
        Chai.expect(flag(module.analysis, AnalysisType.Valid))
    })

    it("Should not valid if doesn't have exported children", () => {
        let ast = JsParser.getAst(`
            (function (InnerModule) {

            })(InnerModule = MyModule.InnerModule || (MyModule.InnerModule = {}));
        `)
        let module:MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children:[<MetaData>{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate, //<------ only have candidate 
                children: []
            }]
        }
        let parent:MetaData = {
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children:[]
        }
        dummy.exit(ast.expression, module, parent);
        Chai.expect(flag(module.analysis, AnalysisType.Valid)).false
    })

    it("Should not valid if not exported", () => {
        let ast = JsParser.getAst(`
            (function (InnerModule) {

            })(InnerModule || (InnerModule = {}));
        `)
        let module:MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children:[<MetaData>{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Exported,  
                children: []
            }]
        }
        let parent:MetaData = {
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children:[]
        }
        dummy.exit(ast.expression, module, parent);
        Chai.expect(flag(module.analysis, AnalysisType.Valid)).false
    })
})