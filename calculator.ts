class unit {
    constructor(public label:string,public convertFrom:(input:number)=>number,public convertTo:(input:number)=>number) {}
}

class measure {
    private input:HTMLElement;
    public self:HTMLElement;
    private converter:unit;
    private getInput:()=>number;
    private putOutput:(value:number)=>any;

    constructor(public name:string,public dimension:unit[]) {
        var n = document.createElement('span');
        var i = document.createElement('input');
        i.setAttribute('type','text');
        this.getInput = function() {return Number(i.value);};
        this.putOutput = function(value:number) {i.value = String(value)};
        var s = document.createElement('select');
        for(var z:number = 0;z < dimension.length;z++) {
            var t = this;
            var o = document.createElement('option');
            var tmp:any = o;
            o.appendChild(document.createTextNode(dimension[z].label));
            tmp.update = function(a) {
                return function() {
                    t.converter = dimension[a]
                };
            }(z);
            s.appendChild(o);
        }
        s.addEventListener('change',function(e:Event) {
            (<any>(e.target)).selectedOptions[0].update();
        });
        (<any>s).selectedOptions[0].update();
        n.appendChild(document.createTextNode(this.name));
        n.appendChild(i);
        n.appendChild(s);
        this.self = n;
    }

    getValue() {
        return this.converter.convertFrom(this.getInput());
    }

    putValue(value:number,round:(a:number)=>number) {
        this.putOutput(round(this.converter.convertTo(value)));
    }
}

class calculator {
    constructor(inputs:measure[],output:measure,calc:(v:number[])=>number,round:(v:number)=>number,parent:HTMLElement) {
        var div = document.createElement('div');
        var button = document.createElement('input');
        button.setAttribute('type','button');
        button.setAttribute('value','Calculate');
        for(var i = 0;i < inputs.length;i++) {
            div.appendChild(inputs[i].self);
        }
        div.appendChild(output.self);
        button.addEventListener('click',function() {
            var vlist = [];
            for(var i = 0;i < inputs.length;i++) {
                vlist.push(inputs[i].getValue());
            }
            output.putValue(calc(vlist),round);
        });
        div.appendChild(button);
        parent.appendChild(div);
    }
}

class converter extends calculator {
    public swap:()=>void;

    constructor(type:unit[],round:(v:number)=>number,parent:HTMLElement) {
        var p = document.createElement('div');
        parent.appendChild(p);
        var swapper = document.createElement('input');
        swapper.setAttribute('type','button');
        swapper.setAttribute('value','Swap');
        var left = new measure('From',type);
        var right = new measure('To',type);
        super([left],right,function(v) {return v[0];},round,p);
        //p.appendChild(swapper);
        swapper.addEventListener('onclick',function() {
            var l = left.select.selectedIndex;
            var r = right.select.selectedIndex;
            left.select.selectedIndex = r;
            right.select.selectedIndex = l;
        });
    }
}

var millimeters = new unit('Millimeters',function(a:number) {return a/1000;},function(a:number) {return a*1000;});
var meters = new unit('Meters',function(a:number) {return a;},function(a:number) {return a;});
var microns = new unit('Microns',function(a:number) {return a/(1000*1000);},function(a:number) {return a*(1000*1000);});
var inches = new unit('Inches',function(a:number) {return 127*a/5000;},function(a:number) {return 5000*a/127;});
var feet = new unit('Feet',function(a:number) {return 381*a/1250;},function(a:number) {return 1250*a/381;});

var distance:unit[] = [millimeters,meters,microns,inches,feet];

var inverseMeters = new unit('Inverse meters',function(a:number) {return 1/a;},function(a:number) {return 1/a;});
var inverseInches = new unit('Inverse inches',function(a:number) {return 127*(1/a)/5000;},function(a:number) {return 1/(5000*a/127);});

var pitch:unit[] = distance.concat([inverseMeters,inverseInches]);

var radiansPerSecond = new unit('Radians per second',function(a:number) {return a;},function(a:number) {return a;});
var rotationsPerMinute = new unit('RPM',function(a:number) {return Math.PI*a/30},function(a:number) {return a/Math.PI*30});

var axialVelocity:unit[] = [radiansPerSecond,rotationsPerMinute];

var metersPerSecond = new unit('Meters per second',function(a) {return a;},function(a) {return a;});
var feetPerMinute = new unit('Feet per minute',function(a) {return (127*a)/25000;},function(a) {return (25000*a)/127;});

var linearVelocity:unit[] = [metersPerSecond,feetPerMinute];

var celsius = new unit('Degrees celsius',function(a) {return a;},function(a) {return a;});
var fahrenheit = new unit('Degrees fahrenheit',function(a) {return (a-32)*(5/9);},function(a) {return a*(9/5)+32;});
var kelvin = new unit('Kelvin',function(a) {return a-273.15;},function(a) {return a+273.15;});
var rankine = new unit('Rankine',function(a) {return fahrenheit.convertFrom(a-459.67);},function(a) {return fahrenheit.convertTo(a)+459.67;});

var temperature:unit[] = [celsius,fahrenheit,kelvin,rankine];

var kilograms = new unit('Kilograms',function(a) {return a;},function(a) {return a;});
var grams = new unit('Grams',function(a) {return a/1000;},function(a) {return a*1000;});
var pounds = new unit('Pounds',function(a) {return (45359237*a)/100000000;},function(a) {return (100000000*a)/45359237;});
var ounces = new unit('Ounces',function(a) {return pounds.convertFrom(a/16);},function(a) {return pounds.convertTo(a*16);});

var mass:unit[] = [kilograms,grams,pounds,ounces];

var unitCategories:unit[][] = [distance,pitch,axialVelocity,linearVelocity,temperature,mass];
