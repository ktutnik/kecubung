import * as Core from "../../src/core"
import { MethodTransformer } from "../../src/transformers/method"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("MethodTransformer", () => {

    it("Should identify method properly", () => {
        let ast = JsParser.getAst(`
        MyClass.prototype.myMethod = function (par1) { };
        `)
        let dummy = new MethodTransformer("ASTree");
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.methods[0]).deep.eq(<Core.MethodMetaData>{
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 9, end: 58
            },
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1",
                location: {
                    start: 48, end: 52
                },
                analysis: Core.AnalysisType.Valid,
            }]
        })
    })
})