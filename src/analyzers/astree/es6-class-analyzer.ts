import { SyntaxKind, SourceLocation } from "../../core"
import { ClassAnalyzer } from "./class-analyzer"

export class Es6ClassAnalyzer extends ClassAnalyzer {

    /**
     * expect VariableDeclaration, ExpressionStatement
     */
    constructor(node) { super(node) }

    //constructors & methods
    getMember() {
        return this.node.body.body;
    }

    getName() {
        return this.node.id.name
    }

    isCandidate() {
        return this.node.type == SyntaxKind.ClassDeclaration
    }

    getBaseClass() {
        if(!this.node.superClass) return
        if (this.node.superClass.type == SyntaxKind.MemberExpression)
            return this.node.superClass.property.name;
        else
            return this.node.superClass.name
    }
}

