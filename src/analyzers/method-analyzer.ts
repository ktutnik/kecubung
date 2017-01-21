import { SyntaxKind } from "../core"
import * as MH from "./helper"


export class MethodAnalyzer {
    /**
     * expect AssignmentExpression, CallExpression
     */
    constructor(private node) { }

    /**
     * expect AssignmentExpression
     */
    isMethod(className: String) {
        return this.isMethodStatement()
            && this.node.left.object.object.name == className
    }

    private isMethodStatement() {
        return this.node.type == SyntaxKind.AssignmentExpression
            && this.node.left.type == SyntaxKind.MemberExpression
            && this.node.left.object.type == SyntaxKind.MemberExpression
            && this.node.left.object.property.name == "prototype"
            && this.node.right.type == SyntaxKind.FunctionExpression
    }

    /**
     * expect AssignmentExpression
     */
    getName() {
        if (this.isMethodStatement())
            return this.node.left.property.name
        else return null;
    }

    /**
     * require CallExpression 
     */
    getClassName() {
        if (this.isMethodStatement())
            return this.node.left.object.object.name
        else return null;
    }


    /**
     * expect AssignmentExpression
     */
    getParams() {
        if (this.isMethodStatement())
            return this.node.right.params.map(x => x.name);
        else
            return null;
    }
}
