import { SyntaxKind, MethodMetaData, MetaData, AnalysisType, SourceLocation } from "../../core"
import * as H from "./helper"
import * as Base from "../baseclasses"

export class ChildDecoratorAnalyzer implements Base.ChildDecoratorAnalyzer {
    constructor(private node) { }

    isMethodDecorator() {
        return !H.isReservedDecorator(this.node)
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
        return this.node.arguments.map(x => H.getDecoratorParameterName(x));
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
            .map(x => H.getDecoratorParameterName(x));
    }

}