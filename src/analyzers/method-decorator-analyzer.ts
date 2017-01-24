import { SyntaxKind, MetaData, AnalysisType } from "../core"
import * as HP from "./helper"

export class MethodDecoratorAnalyzer {
    constructor(private node) { }

    isDecorator() {
        return HP.getMethodNameFromCallee(this.node.expression.callee) == "__decorate"
            && this.node.expression.arguments.length == 4
    }

    getClassName() {
        if (this.isDecorator())
            return this.node.expression.arguments[1].object.name;
        else return null;
    }

    getMethodName() {
        if (this.isDecorator())
            return this.node.expression.arguments[2].value
        else return null;
    }
}

