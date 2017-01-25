import { ModuleAnalyzer } from "../analyzers/module-analyzer"
import * as Core from "../core"
import { TsClassTransformer } from "./ts-class"
import { TsDecorator } from "./ts-decorator"
import { TsClassExporterTransformer } from "./ts-class-export"

export class TsModuleTransformer extends Core.TransformerBase {

    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = new ModuleAnalyzer(node)
        if (analyzer.isCandidate() && (parent.type == "Module" || parent.type == "File")) {
            let module: Core.ParentMetaData = {
                type: "Module",
                analysis: Core.AnalysisType.Candidate,
                children: [],
                location: node.loc.start,
                name: analyzer.getName()
            }
            parent.children.push(module);
            this.traverse(analyzer.getBody(), module, [
                new TsClassTransformer(),
                new TsModuleTransformer(),
                new TsDecorator(),
                new TsClassExporterTransformer()
            ])
            this.analyse(module, parent, analyzer)
        }
    }

    private analyse(module: Core.ParentMetaData, parent: Core.MetaData, analyzer: ModuleAnalyzer) {
        let connected = module.children.length > 0
            && module.children.some(x => Core.flag(x.analysis, Core.AnalysisType.Valid))
        let exported = analyzer.isExported(parent.type == "File" ? "exports" : parent.name);
        let analysis = Core.AnalysisType.Candidate;
        if (exported)
            analysis |= Core.AnalysisType.Exported;
        if (connected)
            analysis |= Core.AnalysisType.ConnectedWithChildren
        if (exported && connected)
            analysis |= Core.AnalysisType.Valid
    }
}
