import { AnalysisType, MetaData, MetaDataFactory, flag } from "../../src/core"
import { MethodDecoratorVisitor } from "../../src/visitors/method-decorator-visitor"
import { JsParser, MH } from "../helper"
import * as Chai from "chai"

describe("Method Decorator Visitor", () => {
    let theModule: MetaData;
    let dummy: MethodDecoratorVisitor;

    beforeEach(() => {
        dummy = new MethodDecoratorVisitor(new MetaDataFactory())
        theModule = <MetaData>{
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children: [<MetaData>{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate
                | AnalysisType.HasConstructor
                | AnalysisType.HasMethod,
                children: [{
                    type: "Method",
                    name: "myMethod",
                    analysis: AnalysisType.Valid,
                    children: []
                }]
            }]
        }
    })

    it("Should identify method decorator properly", () => {
        let ast = JsParser.getAst(`
            tslib_1.__decorate([
                decoOne(),
                decoTwo("hello world!"),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyClass.prototype, "myMethod", null);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].children[0].decorators.length).eq(2);
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[0],
            { type: "Decorator", name: "decoOne" }, null)).true;
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[1],
            { type: "Decorator", name: "decoTwo" }, null)).true;
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[1].children[0],
            { type: "Parameter", name: "hello world!" }, null)).true;
    })

    it("Should identify method decorator without tslib", () => {
        let ast = JsParser.getAst(`
            __decorate([
                decoOne(),
                decoTwo("hello world!"),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], MyClass.prototype, "myMethod", null);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].children[0].decorators.length).eq(2);
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[0],
            { type: "Decorator", name: "decoOne" }, null)).true;
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[1],
            { type: "Decorator", name: "decoTwo" }, null)).true;
        Chai.expect(MH.validate(theModule.children[0].children[0].decorators[1].children[0],
            { type: "Parameter", name: "hello world!" }, null)).true;
    })

    it("Should identify parameter decorator", () => {
        let ast = JsParser.getAst(`
            __decorate([
                decoOne(),
                __param(0, decoTwo("hello world!")),
                __metadata("design:type", Function),
            ], MyClass.prototype, "myMethod", null);
        `)
        //add parameter info on myMethod
        theModule.children[0].children[0].children.push({
            type: "Parameter",
            name: "par1",
            analysis: AnalysisType.Valid,
            children: []
        })
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(MH.validate(theModule.children[0].children[0].children[0].decorators[0],
            { type: "Decorator", name: "decoTwo" }, null)).true
    })

    it("Should not error when provided class decorator", () => {
        let ast = JsParser.getAst(`
            MyClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyClass);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].children[0].decorators).undefined;
    })

    it("Should not error when the class is not found", () => {
        let ast = JsParser.getAst(`
            tslib_1.__decorate([
                decoOne(),
                decoTwo("hello world!"),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyClass.prototype, "myMethod", null);
        `)
        theModule.children[0] = <MetaData>{
            type: "Class",
            name: "MyOtherClass",
            analysis: AnalysisType.Candidate
            | AnalysisType.HasConstructor
            | AnalysisType.HasMethod,
            children: [{
                type: "Method",
                name: "myMethod",
                analysis: AnalysisType.Valid,
                children: []
            }]
        }
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].children[0].decorators).undefined;
    })

    it("Should not error when the method is not found", () => {
        let ast = JsParser.getAst(`
            tslib_1.__decorate([
                decoOne(),
                decoTwo("hello world!"),
            ], MyClass.prototype, "myMethod", null);
        `)
        theModule.children[0].children[0] = {
            type: "Method",
            name: "myOtherMethod",
            analysis: AnalysisType.Valid,
            children: []
        }
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].children[0].decorators).undefined;
    })

    it("Should return null on beforeChildren", () => {
        let ast = JsParser.getAst(`
            tslib_1.__decorate([
                decoOne(),
                decoTwo("hello world!"),
            ], MyClass.prototype, "myMethod", null);
        `)
        theModule.children[0] = <MetaData>{
            type: "Class",
            name: "MyOtherClass",
            analysis: AnalysisType.Candidate
            | AnalysisType.HasConstructor
            | AnalysisType.HasMethod,
            children: [{
                type: "Method",
                name: "myMethod",
                analysis: AnalysisType.Valid,
                children: []
            }]
        }
        let result = dummy.start(ast.expression, theModule, null);
        Chai.expect(result).null;
    })
})