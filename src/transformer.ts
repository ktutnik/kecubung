import { ClassAnalyzer } from "./analyzers/class-analyzer"
import { MetaData, ParentMetaData, SyntaxKind, Call, TransformerBase, AnalysisType } from "./core"
import { TsClassTransformer } from "./transformers/ts-class"
import { TsModuleTransformer } from "./transformers/ts-module"
import { TsDecorator } from "./transformers/ts-decorator"
import { TsClassExporterTransformer } from "./transformers/ts-class-export"

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
            new TsClassTransformer(),
            new TsModuleTransformer(),
            new TsDecorator(),
            new TsClassExporterTransformer()
        ])
    }
}