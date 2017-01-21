import { SyntaxKind, MetaData, AnalysisType, flag } from "../core"

export class MetaDataAnalyzer {
    constructor(private meta: MetaData, private metaParent: MetaData) { }

    //is has exported children?
    hasExportedChildren() {
        return this.meta.children.some(x => flag(x.analysis, AnalysisType.Exported));
    }

    hasValidChildren() {
        return this.meta.children.some(x => flag(x.analysis, AnalysisType.Valid));
    }
}