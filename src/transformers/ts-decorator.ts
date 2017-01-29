import * as Analyzer from "../analyzers"
import * as Core from "../core"
import { TsChildDecoratorTransformer } from "./ts-child-decorator"

export class TsDecorator extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ParentMetaData) {
        if (!parent.children) return;
        let analyzer = <Analyzer.DecoratorAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Decorator, node)
        if (analyzer.isMethodDecorator()) {
            this.transformMethod(node, parent, analyzer)
        }
        else if (analyzer.isClassDecorator()) {
            this.transformClass(node, parent, analyzer)
        }
    }

    private transformMethod(node, parent: Core.ParentMetaData, analyzers: Analyzer.DecoratorAnalyzer) {
        let methodName = analyzers.getMethodName();
        let className = analyzers.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz && clazz.methods) {
            let method = clazz.methods.filter(x => x.name == methodName)[0]
            this.traverse(node.expression.arguments[0].elements, method, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }

    private transformClass(node, parent: Core.ParentMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let className = analyzer.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz) {
            this.traverse(node.expression.right.arguments[0].elements, clazz, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }
}