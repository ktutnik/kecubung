import { ClassAnalyzer } from "../analyzers/class-analyzer"
import * as Core from "../core"


export class TsClassExporterTransformer extends Core.TransformerBase {
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = new ClassAnalyzer(node);
        let parentName = analyzer.getParentName();
        let className = analyzer.getName();
        let clazz:Core.ClassMetaData;
        if (parent.children) clazz = <Core.ClassMetaData>parent.children.filter(x => x.name == className)[0]
        if (clazz && ((parent.type == "File" && parentName == "exports")
            || (parent.type == "Module" && parentName == parent.name))) {
                clazz.analysis |= Core.AnalysisType.Exported;
                if(Core.flag(clazz.analysis, Core.AnalysisType.HasMethod))
                    clazz.analysis |= Core.AnalysisType.Valid
        }
    }
}
