function decoOne() {
    return function (...args) { };
}

function decoTwo(param: string) {
    return function (...args) { };
}

export module MyModule {

    @decoTwo("helo world!")
    export class MyClass {
        constructor() { }
        @decoOne()
        myMethod( @decoOne() par1) { }
    }
}
