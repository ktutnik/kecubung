import { AnalysisType, MetaData } from "../../src/core"
import { ModuleAnalyzer } from "../../src/analyzers/module-analyzer"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("Call Expression Analyzer", () => {

    describe("isCandidate", () => {
        it("Should identify module candidate properly", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children = Parent.Children || (Parent.Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isCandidate()).true;
        })

        it("Should identify non exported module as candidate", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children || (Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isCandidate()).eq(true);
        })

        it("Should not identify any auto execute function as candidate", () => {
            let ast = JsParser.getAst(`
            (function () {
            })();`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isCandidate()).false;
        })
    })

    describe("getName", () => {
        it("Should get module name properly", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children = Parent.Children || (Parent.Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.getName()).eq("Children");
        })

        it("getName() Should not error when supplied different syntax", () => {
            let ast = JsParser.getAst(`
            var MyClass;`)
            let dummy = new ModuleAnalyzer(ast);
            Chai.expect(dummy.getName()).null;
        })
    })

    describe("isExported", () => {
        it("Should identify exported module", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children = exports.Children || (exports.Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isExported("")).eq(true);
        })

        it("Should identify exported inner module", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children = Parent.Children || (Parent.Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isExported("Parent")).eq(true);
        })

        it("Should identify non exported module", () => {
            let ast = JsParser.getAst(`
            (function (Children) {
            })(Children || (Children = {}));`)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isExported("Parent")).eq(false);
        })

        it("Should not error when provided call expression with identifier", () => {
            let ast = JsParser.getAst(`
                require('tslib');
            `)
            let dummy = new ModuleAnalyzer(ast.expression);
            Chai.expect(dummy.isExported("")).eq(false);
        })
    })
})