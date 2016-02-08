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

    putValue(value:number) {
        this.putOutput(this.converter.convertTo(value));
    }
}

class calculator {
    constructor(public inputs:measure[],public output:measure,public calc:(v:number[])=>number,parent:HTMLElement) {
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
            output.putValue(calc(vlist));
        });
        div.appendChild(button);
        parent.appendChild(div);
    }
}

var millimeters = new unit('Millimeters',function(a:number) {return a/1000;},function(a:number) {return a*1000;});
var meters = new unit('Meters',function(a:number) {return a;},function(a:number) {return a;});
var inches = new unit('Inches',function(a:number) {return 127*a/5000;},function(a:number) {return 5000*a/127;});
var feet = new unit('Feet',function(a:number) {return 381*a/1250;},function(a:number) {return 1250*a/381;});

var distance:unit[] = [millimeters,meters,inches,feet];

var inverseMeters = new unit('Inverse meters',function(a:number) {return 1/a;},function(a:number) {return 1/a;});
var inverseInches = new unit('Inverse inches',function(a:number) {return 127*(1/a)/5000;},function(a:number) {return 1/(5000*a/127);});

var pitch:unit[] = distance.concat([inverseMeters,inverseInches]);

var radiansPerSecond = new unit('Radians per second',function(a:number) {return a;},function(a:number) {return a;});
var rotationsPerMinute = new unit('RPM',function(a:number) {return Math.PI*a/30},function(a:number) {return a/Math.PI*30});

var axialVelocity:unit[] = [radiansPerSecond,rotationsPerMinute];

var metersPerSecond = new unit('Meters per second',function(a) {return a;},function(a) {return a;});
var feetPerMinute = new unit('Feet per minute',function(a) {return (127*a)/25000;},function(a) {return (25000*a)/127;});

var linearVelocity:unit[] = [metersPerSecond,feetPerMinute];

var unitCategories:unit[][] = [distance,pitch,axialVelocity,linearVelocity];
