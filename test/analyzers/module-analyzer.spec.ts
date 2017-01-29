import { AnalysisType, MetaData, SyntaxKind } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {

    describe(`Module Analyzer using ${parser}`, () => {

        describe("isCandidate", () => {
            it("Should identify module candidate properly", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children = Parent.Children || (Parent.Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isCandidate()).true;
            })

            it("Should identify non exported module as candidate", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children || (Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isCandidate()).eq(true);
            })

            it("Should not identify any auto execute function as candidate", () => {
                let ast = JsParser.getAst(`
                    (function () {
                    })();`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isCandidate()).false;
            })
        })

        describe("getName", () => {
            it("Should get module name properly", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children = Parent.Children || (Parent.Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.getName()).eq("Children");
            })

            it("getName() Should not error when supplied different syntax", () => {
                let ast = JsParser.getAst(`
                    var MyClass;`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.getName()).null;
            })
        })

        describe("getBody()", () => {
            it("Should get module body properly", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                        (function(){})
                    })(Children = Parent.Children || (Parent.Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.getBody().length).eq(1);
            })
        })

        describe("isExported", () => {
            it("Should identify exported module", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children = exports.Children || (exports.Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isExported("")).eq(true);
            })

            it("Should identify exported inner module", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children = Parent.Children || (Parent.Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isExported("Parent")).eq(true);
            })

            it("Should identify non exported module", () => {
                let ast = JsParser.getAst(`
                    (function (Children) {
                    })(Children || (Children = {}));`)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isExported("Parent")).eq(false);
            })

            it("Should not error when provided call expression with identifier", () => {
                let ast = JsParser.getAst(`
                        require('tslib');
                    `)
                let dummy = <Analyzer.ModuleAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.TSModule, ast)
                Chai.expect(dummy.isExported("")).eq(false);
            })
        })
    })
}