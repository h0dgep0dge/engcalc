class unit {
	constructor(public label:string,public convertFrom:(input:number)=>number,public convertTo:(input:number)=>number) {}
	
	createInput():any {
		var i = document.createElement('input');
		i.setAttribute('type','text');
		return [i,function() {return Number(i.value);},function(value:number) {i.value = String(value);}];
	}
}

interface labelledNumber {
	label: string;
	value: number;
}

class dropdownUnit extends unit {
	constructor(label:string,convertFrom:(input:number)=>number,private options:labelledNumber[]) {
		super(label,convertFrom,function(a) {return a;});
	}
	
	createInput():any {
		var i = document.createElement('select');
		for(var z:number = 0;z < this.options.length;z++) {
			var o = document.createElement('option');
			o.appendChild(document.createTextNode(this.options[z].label));
			o.setAttribute('value',String(this.options[z].value));
			i.appendChild(o);
		}
		return [i,function() {return Number((<HTMLOptionElement>i.selectedOptions[0]).value);},function(value:number) {console.log('Is there even a good way to do this?');}];
	}
}

class measure {
	private inputContainer:HTMLElement;
	public input:HTMLElement;
	public select:HTMLSelectElement;
	public self:HTMLElement;
	private converter:unit;
	private getInput:()=>number;
	private putOutput:(value:number)=>any;

	constructor(public name:string,public dimension:unit[]) {
		this.self = document.createElement('span');
		this.inputContainer = document.createElement('span');
		
		this.select = document.createElement('select');
		for(var z:number = 0;z < dimension.length;z++) {
			var t = this;
			var o = document.createElement('option');
			var tmp:any = o;
			o.appendChild(document.createTextNode(dimension[z].label));
			tmp.update = function(a) {
				return function() {
					t.converter = dimension[a];
					var inputInstance = dimension[a].createInput();
					t.input = inputInstance[0];
					t.getInput = inputInstance[1];
					t.putOutput = inputInstance[2];
					while(t.inputContainer.firstChild) t.inputContainer.removeChild(t.inputContainer.firstChild);
					t.inputContainer.appendChild(t.input);
				};
			}(z);
			this.select.appendChild(o);
		}
		this.select.addEventListener('change',function(e:Event) {
			(<any>(e.target)).selectedOptions[0].update();
		});
		(<any>this.select).selectedOptions[0].update();
		this.self.appendChild(document.createTextNode(this.name));
		this.self.appendChild(this.inputContainer);
		this.self.appendChild(this.select);
	}
	
	getValue() {
		return this.converter.convertFrom(this.getInput());
	}

	putValue(value:number,round:(a:number)=>number) {
		this.putOutput(round(this.converter.convertTo(value)));
	}
}

class calculator {
	public self:HTMLElement;
	constructor(inputs:measure[],output:measure,calc:(v:number[])=>number,round:(v:number)=>number,parent:HTMLElement) {
		var div = document.createElement('div');
		this.self = div;
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
		var swapper = document.createElement('input');
		swapper.setAttribute('type','button');
		swapper.setAttribute('value','Swap');
		var left = new measure('From',type);
		var right = new measure('To',type);
		super([left],right,function(v) {return v[0];},round,parent);
		this.self.appendChild(swapper);
		swapper.addEventListener('click',function() {
			var l = left.select.selectedIndex;
			var r = right.select.selectedIndex;
			left.select.selectedIndex = r;
			(<any>left.select).selectedOptions[0].update();
			right.select.selectedIndex = l;
			(<any>right.select).selectedOptions[0].update();
		});
	}
}

var millimeters = new unit('Millimeters',function(a:number) {return a/1000;},function(a:number) {return a*1000;});
var meters = new unit('Meters',function(a:number) {return a;},function(a:number) {return a;});
var microns = new unit('Microns',function(a:number) {return a/(1000*1000);},function(a:number) {return a*(1000*1000);});
var inches = new unit('Inches',function(a:number) {return 127*a/5000;},function(a:number) {return 5000*a/127;});
var feet = new unit('Feet',function(a:number) {return 381*a/1250;},function(a:number) {return 1250*a/381;});
var thousanths = new unit('Thousanths of an inch',function(a:number) {return inches.convertFrom(a/1000);},function(a:number) {return inches.convertTo(a)*1000;});

var distance:unit[] = [millimeters,meters,microns,inches,feet,thousanths];

var inverseMeters = new unit('Inverse meters',function(a:number) {return 1/a;},function(a:number) {return 1/a;});
var inverseInches = new unit('Inverse inches',function(a:number) {return 127*(1/a)/5000;},function(a:number) {return 1/(5000*a/127);});
var metricCoarseThreads = new dropdownUnit('Coarse M thread pitches',millimeters.convertFrom,[{label:'M1.60',value:0.35},{label:'M2',value:0.40},{label:'M2.50',value:0.45},{label:'M3',value:0.50},{label:'M3.50',value:0.60},{label:'M4',value:0.70},{label:'M5',value:0.80},{label:'M6',value:1},{label:'M8',value:1.25},{label:'M10',value:1.50},{label:'M12',value:1.75},{label:'M14',value:2},{label:'M16',value:2},{label:'M20',value:2.50},{label:'M22',value:2.50},{label:'M24',value:3},{label:'M27',value:3},{label:'M30',value:3.50},{label:'M36',value:4},{label:'M42',value:4.50},{label:'M48',value:5},{label:'M56',value:5.50},{label:'M64',value:6},{label:'M68',value:6}]);
var USCThreads = new dropdownUnit('Coarse UTS thread pitches',inverseInches.convertFrom,[{label:'#1',value:64},{label:'#2',value:56},{label:'#3',value:48},{label:'#4',value:40},{label:'#5',value:40},{label:'#6',value:32},{label:'#8',value:32},{label:'#10',value:24},{label:'#12',value:24},{label:'1\u20444',value:20},{label:'5\u204416',value:18},{label:'3\u20448',value:16},{label:'7\u204416',value:14},{label:'1\u20442',value:13},{label:'9\u204416',value:12},{label:'5\u20448',value:11},{label:'3\u20444',value:10},{label:'7\u20448',value:9},{label:'1',value:8}]);

var pitch:unit[] = distance.concat([inverseMeters,inverseInches,metricCoarseThreads,USCThreads]);

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
