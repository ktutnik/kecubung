import { SyntaxKind, MethodMetaData, MetaData, AnalysisType, SourceLocation } from "../../core"
import * as H from "./helper"


export class ChildDecoratorAnalyzer {
    constructor(private node) { }

    isMethodDecorator() {
        return !H.isReservedDecorator(this.node);
    }

    isParameterDecorator() {
        return H.getMethodNameFromCallee(this.node.callee) == "__param";
    }

    getMethodName() {
        return H.getMethodNameFromCallee(this.node.callee);
    }

    getMethodLocation() {
        return <SourceLocation>{
            start: this.node.start,
            end: this.node.end
        }
    }

    getMethodParameters() {
        return this.node.arguments.map(x => this.getParameter(x));
    }

    getParameterDecoratorName() {
        return H.getMethodNameFromCallee(this.node.arguments[1].callee);
    }

    getParameterDecoratorLocation() {
        return <SourceLocation>{
            start: this.node.start,
            end: this.node.end
        }
    }

    getParameterDecoratorParameters() {
        return this.node.arguments[1].arguments
            .map(x => this.getParameter(x));
    }


    private getParameter(x) {
        return <MetaData>{
            type: "Parameter",
            name: H.getDecoratorParameterName(x),
            analysis: AnalysisType.Valid,
            location: <SourceLocation>{
                start: this.node.start,
                end: this.node.end
            },
        };
    }
}