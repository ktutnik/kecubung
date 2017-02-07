import { SyntaxKind, MetaData } from "../../core"
import * as HP from "./helper"


export class DecoratorAnalyzer {
    constructor(private node) { }

    isMethodDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && HP.getMethodNameFromCallee(this.node.expression.callee) == "__decorate"
            && this.node.expression.arguments.length == 4
            && this.node.expression.arguments[3].type == SyntaxKind.NullLiteral
    }

    isPropertyDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && HP.getMethodNameFromCallee(this.node.expression.callee) == "__decorate"
            && this.node.expression.arguments.length == 4
            && this.node.expression.arguments[3].type == SyntaxKind.UnaryExpression
    }

    getClassName() {
        if (this.isMethodDecorator() || this.isPropertyDecorator())
            return this.node.expression.arguments[1].object.name;
        if (this.isClassDecorator()) {
            return this.node.expression.left.name;
        }
        else return null;
    }

    getMethodName() {
        if (this.isMethodDecorator() || this.isPropertyDecorator())
            return this.node.expression.arguments[2].value
        else return null;
    }


    getChildren() {
        if (this.isClassDecorator())
            return this.node.expression.right.arguments[0].elements
        else
            return this.node.expression.arguments[0].elements
    }

    isClassDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.AssignmentExpression
            && this.node.expression.left.type == SyntaxKind.Identifier
            && this.node.expression.right.type == SyntaxKind.CallExpression
            && HP.getMethodNameFromCallee(this.node.expression.right.callee) == "__decorate"
    }
}