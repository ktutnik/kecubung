import * as Analyzer from "../analyzers"
import { MethodTransformer } from "./method"
import { ConstructorTransformer } from "./constructor"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"

export class TsClassTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.VariableDeclaration)
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = <Analyzer.ClassAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.TSClass, node)
        if (analyzer.isCandidate()) {
            let clazz = <Core.ClassMetaData>{
                type: "Class",
                name: analyzer.getName(),
                baseClass: analyzer.getBaseClass(),
                location: analyzer.getLocation(),
                analysis: Core.AnalysisType.Candidate
            }
            if(!parent.children) parent.children = []
            parent.children.push(clazz)
            this.traverse(analyzer.getMember(), clazz, [
                new MethodTransformer(this.parserType),
                new ConstructorTransformer(this.parserType)
            ])
            this.analyse(clazz, parent, analyzer)
        }
    }


    private analyse(clazz: Core.ClassMetaData, parent: Core.MetaData, analyzer: Analyzer.ClassAnalyzer) {
        /*
        TS class is not valid *YET* here,
        validation done on Module/File level
        */
        let hasConstructor = clazz.constructor;
        let hasMethods = clazz.methods && clazz.methods.length > 0;
        if (hasConstructor) clazz.analysis |= Core.AnalysisType.HasConstructor
        if (hasMethods) clazz.analysis |= Core.AnalysisType.HasMethod;
    }
}

