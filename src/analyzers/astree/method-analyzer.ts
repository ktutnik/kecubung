import { SyntaxKind, SourceLocation } from "../../core"
import * as MH from "./helper"


export class MethodAnalyzer {
    /**
     * expect ExpressionStatement
     */
    constructor(private node) { }


    isMethod(className: String) {
        return this.isMethodStatement()
            && this.node.expression.left.object.object.name == className
    }

    private isMethodStatement() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.AssignmentExpression
            && this.node.expression.left.type == SyntaxKind.MemberExpression
            && this.node.expression.left.object.type == SyntaxKind.MemberExpression
            && this.node.expression.left.object.property.name == "prototype"
            && this.node.expression.right.type == SyntaxKind.FunctionExpression
    }

    getName() {
        if (this.isMethodStatement())
            return this.node.expression.left.property.name
        else return null;
    }

    getClassName() {
        if (this.isMethodStatement())
            return this.node.expression.left.object.object.name
        else return null;
    }

    getLocation() {
        return <SourceLocation> {
            start: this.node.start,
            end: this.node.end
        };
    }

    getParameters(){
        return this.node.expression.right.params;
    }

    getParams() {
        if (this.isMethodStatement())
            return this.node.expression.right.params.map(x => x.name);
        else
            return null;
    }
}
