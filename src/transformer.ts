import { ClassAnalyzer } from "./analyzers/class-analyzer"
import { MetaData, ParentMetaData, SyntaxKind, Call, TransformerBase, AnalysisType } from "./core"
import { TypeScriptClassTransformer } from "./transformers/ts-class"
import { TsModuleTransformer } from "./transformers/ts-module"

export class Transformer  {
    constructor(private fileName: string) {}
    transform(ast){
        let file: ParentMetaData = {
            type: "File",
            name: this.fileName,
            analysis: AnalysisType.Valid,
            children: [],
            location: ast.loc.start
        }
        let fileTransformer = new FileTransformer(this.fileName)
        fileTransformer.transform(ast, file)
        return file;
    }
}

class FileTransformer extends TransformerBase {
    constructor(private fileName: string) {
        super()
    }
    
    transform(node, parent: MetaData) {
        this.traverse(node.program.body, parent, [
            new TypeScriptClassTransformer(),
            new TsModuleTransformer()
        ])
    }
}