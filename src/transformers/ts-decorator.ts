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
        if(analyzer.isPropertyDecorator()){
            this.transformProperty(node, parent, analyzer)
        }
        else if (analyzer.isClassDecorator()) {
            this.transformClass(node, parent, analyzer)
        }
    }

    private transformProperty(node, parent: Core.ParentMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let methodName = analyzer.getMethodName();
        let className = analyzer.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz) {
            //property is special, because it only appears only on run time,
            //so here we add it manually
            let property:Core.PropertyMetaData = {
                type: "Property",
                name: analyzer.getMethodName(), 
                analysis: Core.AnalysisType.Valid,
                decorators: [],
                location: {
                    end: 0, start: 0
                }
            }
            if(!clazz.properties) clazz.properties = []
            clazz.properties.push(property)
            this.traverse(analyzer.getChildren(), property, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }

    private transformMethod(node, parent: Core.ParentMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let methodName = analyzer.getMethodName();
        let className = analyzer.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz && clazz.methods) {
            let method = clazz.methods.filter(x => x.name == methodName)[0]
            this.traverse(analyzer.getChildren(), method, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }

    private transformClass(node, parent: Core.ParentMetaData, analyzer: Analyzer.DecoratorAnalyzer) {
        let className = analyzer.getClassName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0];
        if (clazz) {
            this.traverse(analyzer.getChildren(), clazz, [
                new TsChildDecoratorTransformer(this.parserType)
            ])
        }
    }
}