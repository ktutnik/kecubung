import { AnalysisType, MetaData, MetaDataFactory, flag } from "../../src/core"
import { ClassDecoratorVisitor } from "../../src/visitors/class-decorator-visitor"
import { JsParser, MH } from "../helper"
import * as Chai from "chai"

describe("Class Decorator Visitor", () => {
    let theModule: MetaData;
    let dummy:ClassDecoratorVisitor;

    beforeEach(() => {
        dummy = new ClassDecoratorVisitor(new MetaDataFactory())
        theModule = {
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children: [<MetaData> {
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate
                    | AnalysisType.HasConstructor
                    | AnalysisType.HasMethod,
                children: []            
            }]
        }
    })

    it("Should identify decorator class properly", () => {
        let ast = JsParser.getAst(`
            MyClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyClass);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].decorators.length).eq(1);
        Chai.expect(MH.validate(theModule.children[0].decorators[0], 
            {type: "Decorator", name: "decoOne"}, null)).true;
    })

    it("Should identify decorator class without tslib properly", () => {
        let ast = JsParser.getAst(`
            MyClass = __decorate([
                decoOne(),
                __metadata("design:paramtypes", [])
            ], MyClass);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].decorators.length).eq(1);
    })

    it("Should not add decorator to other class", () => {
        let ast = JsParser.getAst(`
            MyOtherClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyOtherClass);
        `)
        let result = dummy.exit(ast.expression, theModule, null);
        Chai.expect(theModule.children[0].decorators).undefined;
    })

    it("Should return null on beforeChildren", () => {
        let ast = JsParser.getAst(`
            MyOtherClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyOtherClass);
        `)
        let result = dummy.start(ast.expression, theModule, null);
        Chai.expect(result).null;
    })

})