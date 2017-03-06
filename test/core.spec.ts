import * as Core from "../src/core"
import * as Chai from "chai"

export class DummyTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.VariableDeclaration)
    transform(node, parent: Core.ParentMetaData) {
    }
}

export class FakeTransformer extends Core.TransformerBase {
    transform(node, parent: Core.ParentMetaData) {
    }
}

describe("Call", () => {

    it("Should return metadata properly", () => {
        let result = Core.Call.getWhen(new DummyTransformer(), "transform")
        Chai.expect(result).eq(Core.SyntaxKind.VariableDeclaration)
    })

    it("Should throw when no result provided", () => {
        Chai.expect(() => Core.Call.getWhen(new FakeTransformer(), "transform"))
            .throw("Unable to get metadata identifier, try to re-install refrect-metadata module")
    })
})