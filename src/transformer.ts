import { MetaData, SyntaxKind, AnalysisType } from "./core"
import { VisitorAggregator } from "./visitors"
import { MetaDataAnalyzer } from "./analyzers/metadata-analyzer"

export class Transformer {
    constructor(private visitor: VisitorAggregator) { }

    private traverseArray(array, meta: MetaData, metaParent: MetaData) {
        array.forEach((value) => {
            this.traverseNode(value, meta, metaParent);
        })
    }

    private traverseNode(node, meta: MetaData, metaParent: MetaData) {
        if (node == null) return;
        //console.log(JSON.stringify(node.loc.start))
        let visitResult = this.visitor.start(node, meta, metaParent);
        if (visitResult) {
            meta.children.push(visitResult);
            metaParent = meta;
        } else {
            visitResult = meta;
        }

        switch (node.type) {
            case SyntaxKind.File:
                this.traverseNode(node.program, visitResult, metaParent);
                break;

            case SyntaxKind.Program:
            case SyntaxKind.BlockStatement:
            case SyntaxKind.ClassBody:
                this.traverseArray(node.body, visitResult, metaParent);
                break;

            case SyntaxKind.VariableDeclaration:
                this.traverseArray(node.declarations, visitResult, metaParent);
                break;

            case SyntaxKind.VariableDeclarator:
                this.traverseNode(node.init, visitResult, metaParent);
                break;

            case SyntaxKind.CallExpression:
                this.traverseNode(node.callee, visitResult, metaParent);
                this.traverseArray(node.arguments, visitResult, metaParent);
                break;

            case SyntaxKind.FunctionExpression:
            case SyntaxKind.FunctionDeclaration:
            case SyntaxKind.ClassDeclaration:
            case SyntaxKind.ClassExpression:
                this.traverseNode(node.body, visitResult, metaParent);
                break;

            case SyntaxKind.ExpressionStatement:
                this.traverseNode(node.expression, visitResult, metaParent);
                break;
        }
        this.visitor.exit(node, visitResult, metaParent);
    }

    private traverse(node, meta: MetaData, metaParent: MetaData) {
        this.traverseNode(node, meta, metaParent)
    }

    transform(ast, filename: string) {
        let result: MetaData = {
            type: "File",
            name: filename,
            analysis: AnalysisType.Candidate,
            children: []
        }
        this.traverse(ast, result, null);
        let analyser = new MetaDataAnalyzer(result, null);
        if(analyser.hasValidChildren())
            result.analysis |= AnalysisType.Valid;
        return result;
    }
}