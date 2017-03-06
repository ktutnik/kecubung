
function deco(any?){
    return function(...args){}
}

module Module{
    class myclass{
        @deco({data:"MyData", bool:false})
        myProp:string;

        @deco()
        myNumber:number;
        
        @deco()
        myMethod(){}
    }
}

export class MyClass{
    myMethod(){}
}