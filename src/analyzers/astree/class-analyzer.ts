import { SyntaxKind, SourceLocation } from "../../core"
import * as HP from "./helper"

export class ClassAnalyzer {

    /**
     * expect VariableDeclaration, ExpressionStatement
     */
    constructor(protected node) { }

    /**
     * expect ExpressionStatement
     */
    isExported(name, parentName) {
        return this.isExportedStatement()
            && (this.node.expression.left.object.name == parentName || this.node.expression.left.object.name == "exports")
            && this.node.expression.right.name == name
    }

    getLocation() {
        return <SourceLocation>{
            start: this.node.start,
            end: this.node.end
        };
    }

    //constructors & methods
    getMember() {
        return this.node.declarations[0].init.callee.body.body;
    }

    /**
     * expect ExpressionStatement
     */
    protected isExportedStatement() {
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.AssignmentExpression
            && this.node.expression.left.type == SyntaxKind.MemberExpression
            && this.node.expression.right.type == SyntaxKind.Identifier
    }

    getName() {
        if (this.isExportedStatement())
            return this.node.expression.right.name;
        else if (this.isCandidate())
            return this.node.declarations[0].id.name
        else return null;
    }

    getParentName() {
        if (this.isExportedStatement())
            return this.node.expression.left.object.name;
        else
            return null;
    }

    isCandidate() {
        return this.node.type == SyntaxKind.VariableDeclaration
            && this.node.declarations[0].type == SyntaxKind.VariableDeclarator
            && this.node.declarations[0].init
            && this.node.declarations[0].init.type == SyntaxKind.CallExpression
            && this.node.declarations[0].init.callee.type == SyntaxKind.FunctionExpression
            && this.node.declarations[0].init.callee.body.type == SyntaxKind.BlockStatement
            && this.node.declarations[0].init.callee.id == null
    }

    getBaseClass() {
        if (this.isCandidate() && this.node.declarations[0].init.arguments.length > 0) {
            if (this.node.declarations[0].init.arguments[0].type == SyntaxKind.MemberExpression)
                return this.node.declarations[0].init.arguments[0].property.name;
            else
                return this.node.declarations[0].init.arguments[0].name
        }
        return null;
    }
}

