import * as Analyzer from "../analyzers"
import * as Core from "../core"
import { TsClassTransformer } from "./ts-class"
import { TsDecorator } from "./ts-decorator"
import { TsClassExporterTransformer } from "./ts-class-export"

export class TsModuleTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = <Analyzer.ModuleAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.TSModule, node)
        if (analyzer.isCandidate() && (parent.type == "Module" || parent.type == "File")) {
            let module: Core.ParentMetaData = {
                type: "Module",
                analysis: Core.AnalysisType.Candidate,
                children: [],
                location: analyzer.getLocation(),
                name: analyzer.getName()
            }
            parent.children.push(module);
            this.traverse(analyzer.getBody(), module, [
                new TsClassTransformer(this.parserType),
                new TsModuleTransformer(this.parserType),
                new TsDecorator(this.parserType),
                new TsClassExporterTransformer(this.parserType)
            ])
            this.analyse(module, parent, analyzer)
        }
    }

    private analyse(module: Core.ParentMetaData, parent: Core.MetaData, analyzer: Analyzer.ModuleAnalyzer) {
        let connected = module.children.length > 0
            && module.children.some(x => Core.flag(x.analysis, Core.AnalysisType.Valid))
        let exported = analyzer.isExported(parent.type == "File" ? "exports" : parent.name);
        if (exported)
            module.analysis |= Core.AnalysisType.Exported;
        if (connected)
            module.analysis |= Core.AnalysisType.ConnectedWithChildren
        if (exported && connected)
            module.analysis |= Core.AnalysisType.Valid
    }
}
