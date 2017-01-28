import { ClassAnalyzer } from "../analyzers/class-analyzer"
import { MethodTransformer } from "./method"
import { ConstructorTransformer } from "./constructor"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"

export class TsClassTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.VariableDeclaration)
    transform(node, parent: Core.ParentMetaData) {
        let analyzer = new ClassAnalyzer(node);
        if (analyzer.isCandidate()) {
            let clazz = <Core.ClassMetaData>{
                type: "Class",
                name: analyzer.getName(),
                baseClass: analyzer.getBaseClass(),
                location: {
                    line: node.loc.start.line,
                    column: node.loc.start.column
                },
                analysis: Core.AnalysisType.Candidate
            }
            if(!parent.children) parent.children = []
            parent.children.push(clazz)
            this.traverse(node.declarations[0].init.callee.body.body, clazz, [
                new MethodTransformer(),
                new ConstructorTransformer()
            ])
            this.analyse(clazz, parent, analyzer)
        }
    }


    private analyse(clazz: Core.ClassMetaData, parent: Core.MetaData, analyzer: ClassAnalyzer) {
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

