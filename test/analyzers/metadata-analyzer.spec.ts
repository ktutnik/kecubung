
import { AnalysisType, MetaData } from "../../src/core"
import { MetaDataAnalyzer } from "../../src/analyzers/metadata-analyzer"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("MetaData analyzer", () => {
    it("Should identify exported children properly", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children: [{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate
                | AnalysisType.HasConstructor
                | AnalysisType.HasMethod
                | AnalysisType.Exported,
                children: []
            }],
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasExportedChildren()).true;
    })

    it("Should identify exported module children properly", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children: [{
                type: "Module",
                name: "InnerInnerModule",
                analysis: AnalysisType.Candidate
                | AnalysisType.Exported,
                children: []
            },{
                type: "Method",
                name: "myMethod",
                analysis: AnalysisType.Candidate,
                children: []
            }],
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasExportedChildren()).true;
    })

    it("Should identify exported children, even only one children", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children: [{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate
                | AnalysisType.HasConstructor
                | AnalysisType.HasMethod
                | AnalysisType.Exported,
                children: []
            }, {
                type: "Class",
                name: "MyOtherClass",
                analysis: AnalysisType.Candidate,
                children: []
            }],
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasExportedChildren()).true;
    })

    it("Should return false if has no children", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            children: [],
            analysis: AnalysisType.Candidate
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasExportedChildren()).false;
    })

    it("Should return false if all children not exported", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            children: [{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Candidate,
                children: []
            }, {
                type: "Class",
                name: "MyOtherClass",
                analysis: AnalysisType.Candidate,
                children: []
            }],
            analysis: AnalysisType.Candidate
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasExportedChildren()).false;
    })

    it("Should identify valid children", () => {
        let meta: MetaData = {
            type: "Module",
            name: "InnerModule",
            analysis: AnalysisType.Candidate,
            children: [{
                type: "Class",
                name: "MyClass",
                analysis: AnalysisType.Valid,
                children: []
            }, {
                type: "Class",
                name: "MyOtherClass",
                analysis: AnalysisType.Valid,
                children: []
            }],
        }
        let test = new MetaDataAnalyzer(meta, null)
        Chai.expect(test.hasValidChildren()).true;
    })
})