import { SyntaxKind } from "../core"
import * as HP from "./helper"

export class ClassAnalyzer {

    /**
     * expect AssignmentExpression, VariableDeclaration
     */
    constructor(private node) { }

    /**
     * expect AssignmentExpression
     */
    isExported(name, parentName) {
        return this.isExportedStatement()
            && (this.node.left.object.name == parentName || this.node.left.object.name == "exports")
            && this.node.right.name == name
    }

    /**
     * expect AssignmentExpression
     */
    private isExportedStatement() {
        return this.node.type == SyntaxKind.AssignmentExpression
            && this.node.left.type == SyntaxKind.MemberExpression
            && this.node.right.type == SyntaxKind.Identifier
    }

    getName() {
        if (this.isExportedStatement())
            return this.node.right.name;
        else if (this.isCandidate())
            return this.node.declarations[0].id.name
        else return null;
    }

    /**
     * expect VariableDeclaration
     */
    isCandidate() {
        return this.node.type == SyntaxKind.VariableDeclaration
            && this.node.declarations[0].type == SyntaxKind.VariableDeclarator
            && this.node.declarations[0].init
            && this.node.declarations[0].init.type == SyntaxKind.CallExpression
            && this.node.declarations[0].init.callee.type == SyntaxKind.FunctionExpression
            && this.node.declarations[0].init.callee.body.type == SyntaxKind.BlockStatement
            && this.node.declarations[0].init.callee.id == null
    }

    getBaseClass(){
        if(this.isCandidate() && this.node.declarations[0].init.arguments.length > 0){
            return this.node.declarations[0].init.arguments[0].name
        }
    }
}

