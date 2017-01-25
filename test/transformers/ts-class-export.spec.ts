import * as Core from "../../src/core"
import { TsClassExporterTransformer } from "../../src/transformers/ts-class-export"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsClassExporterTransformer", () => {

    it("Should identify export class properly", () => {
        let ast = JsParser.getAst(`
        MyModule.MyClass = MyClass
        `)
        let dummy = new TsClassExporterTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Candidate | Core.AnalysisType.HasMethod,
                methods: []
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(Core.flag(clazz.analysis, Core.AnalysisType.Exported)).true
        Chai.expect(Core.flag(clazz.analysis, Core.AnalysisType.Valid)).true
    })

    it("Should not error if provided TS class", () => {
        let ast = JsParser.getAst(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.myMethod = function (par1) { };
            return MyClass;
        }());
        `)
        let dummy = new TsClassExporterTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Candidate,
                methods: []
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(Core.flag(clazz.analysis, Core.AnalysisType.Exported)).false;
    })
})