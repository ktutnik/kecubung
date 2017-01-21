import { VisitorAggregator } from "../../src/visitors"
import { Visitor, MetaData, Call, SyntaxKind, AnalysisType } from "../../src/core"
import * as Chai from "chai"

class DummyVisitorOne implements Visitor {
    @Call.when(SyntaxKind.CallExpression, SyntaxKind.FunctionDeclaration)
    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        if (node.visitorName != "DummyVisitorOne") return null;
        return {
            type: "Function",
            name: "DummyVisitorOne",
            analysis: AnalysisType.Candidate,
            children: []
        }
    }

    @Call.when(SyntaxKind.ClassDeclaration)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        return {
            type: "Class",
            name: "DummyVisitorOne",
            analysis: AnalysisType.Candidate,
            children: []
        }
    }
}

class DummyVisitorTwo implements Visitor {
    @Call.when(SyntaxKind.CallExpression)
    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        return null
    }

    @Call.when(SyntaxKind.LogicalExpression)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        return {
            type: "Class",
            name: "DummyVisitorTwo",
            analysis: AnalysisType.Candidate,
            children: []
        }
    }
}

describe("Visitor Aggregator", () => {
    let visitor: VisitorAggregator;
    beforeEach(() => {
        visitor = new VisitorAggregator([new DummyVisitorOne(), new DummyVisitorTwo()])
    })

    it("Should register call aggregator properly", () => {
        let result = visitor.exit({ type: SyntaxKind.LogicalExpression }, null, null)
        Chai.expect(result.name).eq("DummyVisitorTwo");
    })

    it("Should return null if no SyntaxKind handler", () => {
        let result = visitor.exit({ type: SyntaxKind.File }, null, null)
        Chai.expect(result).null;
    })

    it("Should execute correct handler on multiple handler", () => {
        let result = visitor.start({ type: SyntaxKind.CallExpression, visitorName: "DummyVisitorOne" }, null, null)
        Chai.expect(result.name).eq("DummyVisitorOne");
    })

    it("Should execute correct handler on multiple handler", () => {
        let result = visitor.start({ type: SyntaxKind.CallExpression, visitorName: "DummyVisitorTwo" }, null, null)
        Chai.expect(result).null;
    })
})