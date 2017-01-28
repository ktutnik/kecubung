import { SyntaxKind, MethodMetaData, MetaData, AnalysisType } from "../core"
import * as H from "../analyzers/helper"


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
        return {
            line: this.node.loc.start.line,
            column: this.node.loc.start.column
        }
    }

    getMethodParameters(){
        return this.node.arguments.map(x => this.getParameter(x));
    }

    getParameterDecoratorName(){
        return H.getMethodNameFromCallee(this.node.arguments[1].callee);
    }

    getParameterDecoratorLocation(){
        return {
                line: this.node.loc.start.line,
                column: this.node.loc.start.column
            };
    }

    getParameterDecoratorParameters(){
        return this.node.arguments[1].arguments
                .map(x => this.getParameter(x));
    }


    private getParameter(x) {
        return <MetaData>{
            type: "Parameter",
            name: H.getDecoratorParameterName(x),
            analysis: AnalysisType.Valid,
            location: {
                line: x.loc.start.line,
                column: x.loc.start.column
            },
        };
    }
}