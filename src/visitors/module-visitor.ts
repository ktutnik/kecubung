import { Call, SyntaxKind, MetaData, AnalysisType, Visitor, MetaDataFactory, flag } from "../core"
import {ModuleAnalyzer} from "../analyzers/module-analyzer"
import { MetaDataAnalyzer } from "../analyzers/metadata-analyzer"

export class ModuleVisitor implements Visitor {
    constructor(private factory: MetaDataFactory) { }

    @Call.when(SyntaxKind.CallExpression)
    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        let analyzer = new ModuleAnalyzer(node)
        if (analyzer.isCandidate()) {
            let result = <MetaData>{
                type: "Module",
                name: analyzer.getName(),
                analysis: AnalysisType.Candidate,
                children: [],
            }
            return this.factory.create(node, result, meta)
        }
        return null;
    }

    @Call.when(SyntaxKind.CallExpression)
    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        let metaAnalizer = new MetaDataAnalyzer(meta, metaParent)
        let analyzer = new ModuleAnalyzer(node)
        //module is connected with its children
        if (metaAnalizer.hasExportedChildren())
            meta.analysis |= AnalysisType.ConnectedWithChildren;
        //module is exported
        if (analyzer.isExported(metaParent ? metaParent.name : ""))
            meta.analysis |= AnalysisType.Exported;
        //valid if connected & exported
        if (flag(meta.analysis, AnalysisType.ConnectedWithChildren)
            && flag(meta.analysis, AnalysisType.Exported))
            meta.analysis |= AnalysisType.Valid;

        return null;
    }

}