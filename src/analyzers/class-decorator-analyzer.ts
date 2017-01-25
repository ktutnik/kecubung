import { SyntaxKind, MetaData } from "../core"
import * as HP from "./helper"


export class ClassDecoratorAnalyzer {

    /**
     * expect ExpressionStatement
     */
    constructor(private node) { }

    getClassName() {
        if (this.isDecorator()) {
            return this.node.expression.left.name;
        }
        else return null;
    }

    isDecorator() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.AssignmentExpression
            && this.node.expression.left.type == SyntaxKind.Identifier
            && this.node.expression.right.type == SyntaxKind.CallExpression
            && HP.getMethodNameFromCallee(this.node.expression.right.callee) == "__decorate"
    }
}