import { ModuleAnalyzer } from "../analyzers/module-analyzer"
import { TransformerBase, ParentMetaData, MetaData, MethodMetaData, ClassMetaData, SyntaxKind, Call, flag, AnalysisType } from "../core"
import { TypeScriptClassTransformer } from "./ts-class"

export class TsModuleTransformer extends TransformerBase {

    constructor(private childTransformers?:TransformerBase[]){
        super()
    }

    @Call.when(SyntaxKind.ExpressionStatement)
    transform(node, parent: ParentMetaData) {
        let analyzer = new ModuleAnalyzer(node)
        if (analyzer.isCandidate() && (parent.type == "Module" || parent.type == "File")) {
            let module: ParentMetaData = {
                type: "Module",
                analysis: AnalysisType.Candidate,
                children: [],
                location: node.loc.start,
                name: analyzer.getName()
            }
            parent.children.push(module);
            this.traverse(analyzer.getBody(), module, this.childTransformers)
            this.analyse(module, parent, analyzer)
        }
    }

    private analyse(module: ParentMetaData, parent: MetaData, analyzer: ModuleAnalyzer) {
        let connected = module.children.length > 0
            && module.children.some(x => flag(x.analysis, AnalysisType.Valid))
        let exported = analyzer.isExported(parent.type == "File" ? "exports" : parent.name);
        let analysis = AnalysisType.Candidate;
        if (exported)
            analysis |= AnalysisType.Exported;
        if (connected)
            analysis |= AnalysisType.ConnectedWithChildren
        if (exported && connected)
            analysis |= AnalysisType.Valid
    }
}
