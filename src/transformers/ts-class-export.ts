import * as Analyzer from "../analyzers"
import * as Core from "../core"


export class TsClassExporterTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = <Analyzer.ClassAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.TSClass, node)
        let parentName = analyzer.getParentName();
        let className = analyzer.getName();
        let clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0]
        if (clazz && ((parent.type == "File" && parentName == "exports")
            || (parent.type == "Module" && parentName == parent.name))) {
                clazz.analysis |= Core.AnalysisType.Exported;
                if(Core.flag(clazz.analysis, Core.AnalysisType.HasMethod))
                    clazz.analysis |= Core.AnalysisType.Valid
        }
    }
}
