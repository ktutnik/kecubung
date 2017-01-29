import { SyntaxKind, SourceLocation } from "../../core"

export class ModuleAnalyzer {
    /**
     * require ExpressionStatement 
     */
    constructor(private node) {

    }

    isCandidate() {
        /*
        (function(ModuleName){})(ModuleName = (<any>.ModuleName) || ())    
        */
        return this.node.type == SyntaxKind.ExpressionStatement
            && this.node.expression.type == SyntaxKind.CallExpression
            && this.node.expression.callee.type == SyntaxKind.FunctionExpression
            && this.node.expression.callee.body.type == SyntaxKind.BlockStatement
            && this.node.expression.arguments.length == 1
            && (this.node.expression.arguments[0].type == SyntaxKind.AssignmentExpression
                || this.node.expression.arguments[0].type == SyntaxKind.LogicalExpression)
            && this.node.expression.arguments[0].left.name == this.node.expression.callee.params[0].name
    }

    getBody() {
        return this.node.expression.callee.body.body;
    }

    getName() {
        if (this.isCandidate())
            return this.node.expression.arguments[0].left.name;
        else
            return null;
    }

    getLocation() {
        return <SourceLocation>{
            start: this.node.start,
            end: this.node.end
        };
    }

    isExported(parentName: string) {
        //(function(Children){})(Children = (Parent.Children) || ())
        //(function(Children){})(Children = (exports.Children) || ())
        return this.node.expression.arguments.length == 1
            && this.node.expression.arguments[0].type == SyntaxKind.AssignmentExpression
            && this.node.expression.arguments[0].right.left.type == SyntaxKind.MemberExpression
            && (this.node.expression.arguments[0].right.left.object.name == parentName
                || this.node.expression.arguments[0].right.left.object.name == "exports");
    }
}
