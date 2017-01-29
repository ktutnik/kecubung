import { SyntaxKind, MetaData } from "../../core"
import * as HP from "./helper"


export class DecoratorAnalyzer {
    constructor(private node) { }

    isMethodDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && HP.getMethodNameFromCallee(this.node.expression.callee) == "__decorate"
            && this.node.expression.arguments.length == 4
    }

    getClassName() {
        if (this.isMethodDecorator())
            return this.node.expression.arguments[1].object.name;
        if (this.isClassDecorator()) {
            return this.node.expression.left.name;
        }
        else return null;
    }

    getMethodName() {
        if (this.isMethodDecorator())
            return this.node.expression.arguments[2].value
        else return null;
    }

    isClassDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.AssignmentExpression
            && this.node.expression.left.type == SyntaxKind.Identifier
            && this.node.expression.right.type == SyntaxKind.CallExpression
            && HP.getMethodNameFromCallee(this.node.expression.right.callee) == "__decorate"
    }
}