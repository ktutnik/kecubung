import * as Core from "../../src/core"
import { Es6ClassMember } from "../../src/transformers/es6-class-member"
import { JsParser } from "../helper"
import * as Chai from "chai"
import * as Utils from "util"


describe("Es6ClassMember", () => {

    it("Should transform constructor properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1) { }
                myMethod() { }
            }
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast.body.body[0], parent)
        Chai.expect(parent.constructor).deep.eq({
            type: 'Constructor',
            name: 'constructor',
            analysis: 1,
            location: { start: 45, end: 66 },
            parameters:
            [{
                type: 'Parameter',
                name: 'par1',
                analysis: 1,
                location: { start: 57, end: 61 }
            }],
            decorators: undefined
        })
    })

    it("Should transform constructor without parameter properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor() { }
                myMethod() { }
            }
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast.body.body[0], parent)
        Chai.expect(parent.constructor).deep.eq({
            type: 'Constructor',
            name: 'constructor',
            analysis: 1,
            location: { start: 45, end: 62 },
            parameters: [],
            decorators: undefined
        })
    })

    it("Should transform method properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1) { }
                myMethod(par1) { }
            }
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast.body.body[1], parent)
        Chai.expect(parent.methods[0]).deep.eq({
            type: 'Method',
            name: 'myMethod',
            analysis: 1,
            location: { start: 83, end: 101 },
            parameters:
            [{
                type: 'Parameter',
                name: 'par1',
                analysis: 1,
                location: { start: 92, end: 96 }
            }],
            decorators: undefined
        })
    })

    it("Should transform method without parameter properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor() { }
                myMethod() { }
            }
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast.body.body[1], parent)
        Chai.expect(parent.methods[0]).deep.eq({
            type: 'Method',
            name: 'myMethod',
            analysis: 1,
            location: { start: 79, end: 93 },
            parameters: [],
            decorators: undefined
        })
    })

    it("Should not error if provided other type of node", () => {
        let ast = JsParser.getAst(`
            var data = {}
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            methods: []
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast, parent)
        Chai.expect(parent.methods.length).eq(0)
    })

    it("Should not error if parent methods is undefined", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor() { }
                myMethod() { }
            }
        `)
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
        }
        let test = new Es6ClassMember("ASTree")
        test.transform(ast.body.body[1], parent)
        Chai.expect(parent.methods.length).eq(1)
    })
})