
function deco(){
    return function(...args){}
}

module Module{
    class myclass{
        @deco()
        myProp:string;

        @deco()
        myNumber:number;
        
        @deco()
        myMethod(){}
    }
}