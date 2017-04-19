import { SyntaxKind, SourceLocation } from "../../core"
import { ClassAnalyzer } from "./class-analyzer"

export class Es6ClassAnalyzer extends ClassAnalyzer {

    /**
     * expect VariableDeclaration, ExpressionStatement
     */
    constructor(node) { super(node) }

    //constructors & methods
    getMember() {
        if (this.isClass())
            return this.node.body.body;
        else
            return this.node.declarations[0].init.body.body
    }

    getName() {
        if (this.isClass())
            return this.node.id.name
        else
            return this.node.declarations[0].init.id.name
    }

    private isClass() {
        return this.node.type == SyntaxKind.ClassDeclaration
    }

    private isVariableDeclaration() {
        return this.node.type == SyntaxKind.VariableDeclaration &&
            this.node.declarations[0].init &&
            this.node.declarations[0].init.type == SyntaxKind.ClassExpression
    }

    isCandidate() {
        return this.isClass() || this.isVariableDeclaration()
    }

    private getBaseClassSimple() {
        if (!this.node.superClass) return
        if (this.node.superClass.type == SyntaxKind.MemberExpression)
            return this.node.superClass.property.name;
        else
            return this.node.superClass.name
    }

    private getBaseClassWithDeclaration() {
        if (!this.node.declarations[0].init.superClass) return
        if (this.node.declarations[0].init.superClass.type == SyntaxKind.MemberExpression)
            return this.node.declarations[0].init.superClass.property.name;
        else
            return this.node.declarations[0].init.superClass.name
    }

    getBaseClass() {
        if (this.isClass()) return this.getBaseClassSimple()
        else return this.getBaseClassWithDeclaration()
    }
}

