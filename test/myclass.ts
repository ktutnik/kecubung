function decoOne() {
    return function (...args) { };
}

function decoTwo(param: string) {
    return function (...args) { };
}

export module MyModule {

    @decoTwo("helo world!")
    export class MyBaseClass {
        constructor() { }
        @decoOne()
        myMethod( @decoOne() par1) { }
    }
    export module ChildModule {
        export class ChildClass extends MyBaseClass {
            childMethod() { }
        }
    }

}

export class OuterClass{
    myOtherMethod(){}
}

export module ParentModule.ChildModule{
    export class MyClass{}
}


