import { SyntaxKind } from "../core"

export class ModuleAnalyzer {
    /**
     * require CallExpression 
     */
    constructor(private node) {

    }

    /**
     * require CallExpression 
     */
    isCandidate() {
        /*
        (function(Children){})(Children = (<any>.Children) || ())    
        */
        return this.node.type == SyntaxKind.CallExpression
            && this.node.arguments.length == 1
            && (this.node.arguments[0].type == SyntaxKind.AssignmentExpression
                || this.node.arguments[0].type == SyntaxKind.LogicalExpression)
            && this.node.arguments[0].left.name == this.node.callee.params[0].name
    }

    getName() {
        if (this.isCandidate())
            return this.node.arguments[0].left.name;
        else
            return null;
    }

    /**
     * require CallExpression 
     */
    isExported(parentName: string) {
        //(function(Children){})(Children = (Parent.Children) || ())
        //(function(Children){})(Children = (exports.Children) || ())
        return this.node.arguments.length == 1
            && this.node.arguments[0].type == SyntaxKind.AssignmentExpression
            && this.node.arguments[0].right.left.type == SyntaxKind.MemberExpression
            && (this.node.arguments[0].right.left.object.name == parentName
                || this.node.arguments[0].right.left.object.name == "exports");
    }
}
