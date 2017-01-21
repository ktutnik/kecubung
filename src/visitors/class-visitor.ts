import { Call, SyntaxKind, MetaData, AnalysisType, Visitor, MetaDataFactory, flag } from "../core"
import { ClassAnalyzer } from "../analyzers/class-analyzer"
import { MethodAnalyzer } from "../analyzers/method-analyzer"

export class ClassVisitor implements Visitor {
    constructor(private factory: MetaDataFactory) { }

    @Call.when(
        SyntaxKind.VariableDeclaration,
        SyntaxKind.FunctionDeclaration,
        SyntaxKind.AssignmentExpression,
        SyntaxKind.ClassExpression,
        SyntaxKind.ClassMethod
    )
    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        switch (node.type) {
            case SyntaxKind.VariableDeclaration:
                return this.createCandidate(node, metaParent);
            case SyntaxKind.FunctionDeclaration:
                return this.addHasConstructorFlag(node, meta)
            case SyntaxKind.ClassExpression:
                return this.createEs6Class(node, meta);
            case SyntaxKind.ClassMethod:
                return this.createEs6Method(node, meta)
            default:
                return this.addMethod(node, meta)
        }
    }

    @Call.when(SyntaxKind.AssignmentExpression)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        return this.addIsExportedFlag(node, meta)
    }

    private createCandidate(node, meta: MetaData) {
        let analyzer = new ClassAnalyzer(node)
        if (analyzer.isCandidate()) {
            let result = <MetaData>{
                type: "Class",
                name: analyzer.getName(),
                analysis: AnalysisType.Candidate,
                children: [],
            };
            return this.factory.create(node, result, meta)
        }
        return null;
    }

    private createEs6Class(node, meta) {
        let result = <MetaData>{
            type: "Class",
            name: node.id.name,
            analysis: AnalysisType.Candidate,
            children: [],
        };
        return this.factory.create(node, result, meta)
    }

    private addHasConstructorFlag(node, meta: MetaData) {
        if (meta.type == "Class"
            && node.type == SyntaxKind.FunctionDeclaration
            && node.id.name == meta.name
            && flag(meta.analysis, AnalysisType.Candidate)) {
            meta.analysis |= AnalysisType.HasConstructor;

            let result = <MetaData>{
                type: "Constructor",
                name: meta.name,
                children: node.params.map(x => <MetaData>{
                    type: "Parameter",
                    name: x.name,
                    analysis: AnalysisType.Valid,
                    children: []
                })
            }
            return this.factory.create(node, result, meta)
        }
        return null;
    }

    private addMethod(node, meta: MetaData) {
        let analyzer = new MethodAnalyzer(node)
        if (meta.type == "Class"
            && analyzer.isMethod(meta.name)
            && flag(meta.analysis, AnalysisType.HasConstructor)) {
            meta.analysis |= AnalysisType.HasMethod;
            let parameters = analyzer.getParams().map(x => <MetaData>{
                type: "Parameter",
                name: x,
                analysis: AnalysisType.Valid,
                children: [],
            });
            let result = <MetaData>{
                type: "Method",
                name: analyzer.getName(),
                analysis: AnalysisType.Valid,
                children: parameters
            }
            return this.factory.create(node, result, meta)
        }
        return null;
    }

    private createEs6Method(node, meta:MetaData) {
        let isctor = node.kind == "constructor";
        meta.analysis |= isctor ? AnalysisType.HasConstructor : AnalysisType.HasMethod
        return <MetaData>{
            type: isctor ? "Constructor" : "Method",
            name: isctor ? meta.name : node.key.name,
            children: node.params.map(x => <MetaData>{
                type: "Parameter",
                name: x.name,
                analysis: AnalysisType.Valid,
                children: []
            })
        }
    }

    private addIsExportedFlag(node, meta: MetaData) {
        let analyzer = new ClassAnalyzer(node);
        let className = analyzer.getName();
        let clazz = meta.children.filter(x => x.name == className)[0]
        if (clazz
            && (meta.type == "Module" || meta.type == "File")
            && analyzer.isExported(className, meta.name)) {
            clazz.analysis |= AnalysisType.Exported;
            if (flag(clazz.analysis, AnalysisType.HasConstructor)
                && flag(clazz.analysis, AnalysisType.HasMethod)) {
                clazz.analysis |= AnalysisType.Valid;
            }
        }
        return null;
    }
}
