import * as Analyzer from "../analyzers"
import { Es6ClassMember } from "./es6-class-member"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"

export class Es6ClassTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.ClassDeclaration)
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = <Analyzer.ClassAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Es6Class, node)
        if (analyzer.isCandidate()) {
            let clazz = <Core.ClassMetaData>{
                type: "Class",
                name: analyzer.getName(),
                baseClass: analyzer.getBaseClass(),
                location: analyzer.getLocation(),
                analysis: Core.AnalysisType.Candidate
            }
            parent.children.push(clazz)
            this.traverse(analyzer.getMember(), clazz, [
                new Es6ClassMember(this.parserType),
            ])
            this.analyse(clazz, parent, analyzer)
        }
    }


    private analyse(clazz: Core.ClassMetaData, parent: Core.MetaData, analyzer: Analyzer.ClassAnalyzer) {
        /*
        TS class is not valid *YET* here,
        validation done on TSClassExport
        */
        clazz.analysis |= Core.AnalysisType.HasConstructor
        let hasMethods = clazz.methods && clazz.methods.length > 0;
        if (hasMethods) clazz.analysis |= Core.AnalysisType.HasMethod;
    }
}

