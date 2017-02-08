import * as Analyzer from "../analyzers"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class BooleanValueTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.BooleanLiteral)
    transform(node, parent: Core.DecoratorMetaData) {
        let analyser = <Analyzer.ValueAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.ValueAnalyzer, node)
        if (analyser.isPrimitive()) {
            if(!parent.parameters) parent.parameters = []
            parent.parameters.push(<Core.PrimitiveValueMetaData>{
                type: "Boolean",
                value: analyser.getValue()
            })
        }
    }
}

export class StringValueTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.StringLiteral)
    transform(node, parent: Core.DecoratorMetaData) {
        let analyser = <Analyzer.ValueAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.ValueAnalyzer, node)
        if (analyser.isPrimitive()) {
            if(!parent.parameters) parent.parameters = []
            parent.parameters.push(<Core.PrimitiveValueMetaData>{
                type: "String",
                value: analyser.getValue()
            })
        }
    }
}

export class NumberValueTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.NumericLiteral)
    transform(node, parent: Core.DecoratorMetaData) {
        let analyser = <Analyzer.ValueAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.ValueAnalyzer, node)
        if (analyser.isPrimitive()) {
            if(!parent.parameters) parent.parameters = []
            parent.parameters.push(<Core.PrimitiveValueMetaData>{
                type: "Number",
                value: analyser.getValue()
            })
        }
    }
}

export class NullValueTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.NullLiteral)
    transform(node, parent: Core.DecoratorMetaData) {
        let analyser = <Analyzer.ValueAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.ValueAnalyzer, node)
        if (analyser.isNull()) {
            if(!parent.parameters) parent.parameters = []
            parent.parameters.push(<Core.PrimitiveValueMetaData>{
                type: "Null",
                value: analyser.getValue()
            })
        }
    }
}
