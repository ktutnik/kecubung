import { ClassAnalyzer } from "../analyzers/class-analyzer"
import { MethodTransformer } from "./method"
import { ConstructorTransformer } from "./constructor"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"

export class TypeScriptClassTransformer extends Core.TransformerBase {

    transform(node, parent:Core.MetaData) {
        let analyzer = new ClassAnalyzer(node);
        if (analyzer.isCandidate()) {
            let clazz = <Core.ClassMetaData>{
                type: "Class",
                name: analyzer.getName(),
                baseClass: analyzer.getBaseClass(),
                location: node.loc.start
            }
            this.traverse(node.declarations[0].init.callee.body.body, clazz, [
                new MethodTransformer(),
                new ConstructorTransformer()
            ])
            this.analyse(clazz, parent, analyzer)
        }
    }

    private analyse(clazz:Core.ClassMetaData, parent:Core.MetaData, analyzer:ClassAnalyzer){
        let hasConstructor = clazz.constructor;
        let hasMethods = clazz.methods && clazz.methods.length > 0;
        let isExported = analyzer.isExported(clazz.name, parent.name)
        if(hasConstructor) clazz.analysis |= Core.AnalysisType.HasConstructor
        if(hasMethods) clazz.analysis |= Core.AnalysisType.HasMethod;
        if(isExported) clazz.analysis |= Core.AnalysisType.Exported;
        if(hasMethods && isExported) clazz.analysis |= Core.AnalysisType.Valid
    }
}

