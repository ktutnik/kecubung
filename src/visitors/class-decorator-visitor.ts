import { Call, SyntaxKind, MetaData, AnalysisType, Visitor, MetaDataFactory, flag } from "../core"
import {ClassDecoratorAnalyzer} from "../analyzers/class-decorator-analyzer"

export class ClassDecoratorVisitor implements Visitor {
    constructor(private factory: MetaDataFactory) { }

    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        return null
    }

    @Call.when(SyntaxKind.AssignmentExpression)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        let analyzer = new ClassDecoratorAnalyzer(node)
        if ((meta.type == "Module" || meta.type == "File")
            && analyzer.isDecorator()) {
            let className = analyzer.getClassName();
            let decorators = analyzer.getDecorators()
            let clazz = meta.children.filter(x => x.type == "Class" 
                && x.name == className)[0]
            if (clazz) clazz.decorators = decorators;
        }
        return null;
    }
}