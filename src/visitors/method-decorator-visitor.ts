import { Call, SyntaxKind, MetaData, AnalysisType, Visitor, MetaDataFactory, flag } from "../core"
import {MethodDecoratorAnalyzer} from "../analyzers/method-decorator-analyzer"

export class MethodDecoratorVisitor implements Visitor {
    constructor(private factory: MetaDataFactory) { }

    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        return null
    }

    @Call.when(SyntaxKind.CallExpression)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        let analyzer = new MethodDecoratorAnalyzer(node)
        if (analyzer.isDecorator()) {
            let className = analyzer.getClassName();
            let methodName = analyzer.getMethodName()
            let decorators = analyzer.getDecorators()
            let clazz = meta.children.filter(x => x.type == "Class" 
                && x.name == className)[0]
            if (clazz) {
                let method = clazz.children.filter(x => x.type == "Method"
                && x.name == methodName)[0]
                if(method) {
                    method.decorators = decorators;
                    for(let i = 0; i < method.children.length; i++){
                        method.children[0].decorators = analyzer.getParameters(i);
                    }
                }
            } 
        }
        return null;
    }
}