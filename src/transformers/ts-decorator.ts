import * as H from "../analyzers/helper"
import { ClassDecoratorAnalyzer } from "../analyzers/class-decorator-analyzer"
import { MethodDecoratorAnalyzer } from "../analyzers/method-decorator-analyzer"
import * as Core from "../core"
import { TsChildDecoratorTransformer } from "./ts-child-decorator"

export class TsDecorator extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ParentMetaData) {
        if (!parent.children) return;
        let ca = new ClassDecoratorAnalyzer(node)
        let ma = new MethodDecoratorAnalyzer(node)
        if (ma.isDecorator()) {
            this.transformMethod(node, parent, ma)
        }
        else if (ca.isDecorator()) {
            this.transformClass(node, parent, ca)
        }
    }

    private transformMethod(node, parent: Core.ParentMetaData, analyzers: MethodDecoratorAnalyzer) {
        let methodName = analyzers.getMethodName();
        let className = analyzers.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz && clazz.methods) {
            let method = clazz.methods.filter(x => x.name == methodName)[0]
            this.traverse(node.expression.arguments[0].elements, method, [
                new TsChildDecoratorTransformer()
            ])
        }
    }

    private transformClass(node, parent: Core.ParentMetaData, analyzer: ClassDecoratorAnalyzer) {
        let className = analyzer.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz) {
            this.traverse(node.expression.right.arguments[0].elements, clazz, [
                new TsChildDecoratorTransformer()
            ])
        }
    }
}