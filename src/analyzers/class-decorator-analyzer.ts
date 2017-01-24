import { SyntaxKind, MetaData } from "../core"
import * as HP from "./helper"


export class ClassDecoratorAnalyzer{

    /**
     * expect AssignmentExpression
     */
    constructor(private node){}

    getClassName(){
        if (this.isDecorator()){
            return this.node.left.name;
        }
        else return null;
    }

    isDecorator() {
        return this.node.type == SyntaxKind.AssignmentExpression
            &&  this.node.left.type == SyntaxKind.Identifier
            && this.node.right.type == SyntaxKind.CallExpression
            && HP.getMethodNameFromCallee(this.node.right.callee) == "__decorate"
    }
}