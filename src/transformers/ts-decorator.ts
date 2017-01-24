import * as H from "../analyzers/helper"
import { ClassDecoratorAnalyzer } from "../analyzers/class-decorator-analyzer"
import { MethodDecoratorAnalyzer } from "../analyzers/method-decorator-analyzer"
import * as Core from "../core"
import { TsChildDecorator } from "./ts-child-decorator"

export class TsDecorator extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ParentMetaData) {
        if (node.expression.type == Core.SyntaxKind.MemberExpression
            && H.getMethodNameFromCallee(node.expression.callee) == "__decorate") {
            this.transformMethod(node, parent)
        }
        else if (node.expression.type == Core.SyntaxKind.AssignmentExpression
            && H.getMethodNameFromCallee(node.expression.callee) == "__decorate") {
            this.transformClass(node, parent)
        }
    }

    private transformMethod(node, parent: Core.ParentMetaData) {
        let analyzers = new MethodDecoratorAnalyzer(node)
        if (analyzers.isDecorator()) {
            let methodName = analyzers.getMethodName();
            let className = analyzers.getClassName();
            let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
            let method = clazz.methods.filter(x => x.name == methodName)[0]
            this.traverse(node.expression.arguments, method, [
                new TsChildDecorator()
            ])
        }
    }

    private transformClass(node, parent: Core.ParentMetaData) {

    }

}