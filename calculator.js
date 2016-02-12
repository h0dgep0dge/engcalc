var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var unit = (function () {
    function unit(label, convertFrom, convertTo) {
        this.label = label;
        this.convertFrom = convertFrom;
        this.convertTo = convertTo;
    }
    return unit;
})();
var measure = (function () {
    function measure(name, dimension) {
        this.name = name;
        this.dimension = dimension;
        var n = document.createElement('span');
        var i = document.createElement('input');
        i.setAttribute('type', 'text');
        this.getInput = function () { return Number(i.value); };
        this.putOutput = function (value) { i.value = String(value); };
        var s = document.createElement('select');
        for (var z = 0; z < dimension.length; z++) {
            var t = this;
            var o = document.createElement('option');
            var tmp = o;
            o.appendChild(document.createTextNode(dimension[z].label));
            tmp.update = function (a) {
                return function () {
                    t.converter = dimension[a];
                };
            }(z);
            s.appendChild(o);
        }
        s.addEventListener('change', function (e) {
            (e.target).selectedOptions[0].update();
        });
        s.selectedOptions[0].update();
        n.appendChild(document.createTextNode(this.name));
        n.appendChild(i);
        n.appendChild(s);
        this.self = n;
        this.input = i;
        this.select = s;
    }
    measure.prototype.getValue = function () {
        return this.converter.convertFrom(this.getInput());
    };
    measure.prototype.putValue = function (value, round) {
        this.putOutput(round(this.converter.convertTo(value)));
    };
    return measure;
})();
var calculator = (function () {
    function calculator(inputs, output, calc, round, parent) {
        var div = document.createElement('div');
        this.self = div;
        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'Calculate');
        for (var i = 0; i < inputs.length; i++) {
            div.appendChild(inputs[i].self);
        }
        div.appendChild(output.self);
        button.addEventListener('click', function () {
            var vlist = [];
            for (var i = 0; i < inputs.length; i++) {
                vlist.push(inputs[i].getValue());
            }
            output.putValue(calc(vlist), round);
        });
        div.appendChild(button);
        parent.appendChild(div);
    }
    return calculator;
})();
var converter = (function (_super) {
    __extends(converter, _super);
    function converter(type, round, parent) {
        var swapper = document.createElement('input');
        swapper.setAttribute('type', 'button');
        swapper.setAttribute('value', 'Swap');
        var left = new measure('From', type);
        var right = new measure('To', type);
        _super.call(this, [left], right, function (v) { return v[0]; }, round, parent);
        this.self.appendChild(swapper);
        swapper.addEventListener('click', function () {
            var l = left.select.selectedIndex;
            var r = right.select.selectedIndex;
            left.select.selectedIndex = r;
            left.select.selectedOptions[0].update();
            right.select.selectedIndex = l;
            right.select.selectedOptions[0].update();
        });
    }
    return converter;
})(calculator);
var millimeters = new unit('Millimeters', function (a) { return a / 1000; }, function (a) { return a * 1000; });
var meters = new unit('Meters', function (a) { return a; }, function (a) { return a; });
var microns = new unit('Microns', function (a) { return a / (1000 * 1000); }, function (a) { return a * (1000 * 1000); });
var inches = new unit('Inches', function (a) { return 127 * a / 5000; }, function (a) { return 5000 * a / 127; });
var feet = new unit('Feet', function (a) { return 381 * a / 1250; }, function (a) { return 1250 * a / 381; });
var distance = [millimeters, meters, microns, inches, feet];
var inverseMeters = new unit('Inverse meters', function (a) { return 1 / a; }, function (a) { return 1 / a; });
var inverseInches = new unit('Inverse inches', function (a) { return 127 * (1 / a) / 5000; }, function (a) { return 1 / (5000 * a / 127); });
var pitch = distance.concat([inverseMeters, inverseInches]);
var radiansPerSecond = new unit('Radians per second', function (a) { return a; }, function (a) { return a; });
var rotationsPerMinute = new unit('RPM', function (a) { return Math.PI * a / 30; }, function (a) { return a / Math.PI * 30; });
var axialVelocity = [radiansPerSecond, rotationsPerMinute];
var metersPerSecond = new unit('Meters per second', function (a) { return a; }, function (a) { return a; });
var feetPerMinute = new unit('Feet per minute', function (a) { return (127 * a) / 25000; }, function (a) { return (25000 * a) / 127; });
var linearVelocity = [metersPerSecond, feetPerMinute];
var celsius = new unit('Degrees celsius', function (a) { return a; }, function (a) { return a; });
var fahrenheit = new unit('Degrees fahrenheit', function (a) { return (a - 32) * (5 / 9); }, function (a) { return a * (9 / 5) + 32; });
var kelvin = new unit('Kelvin', function (a) { return a - 273.15; }, function (a) { return a + 273.15; });
var rankine = new unit('Rankine', function (a) { return fahrenheit.convertFrom(a - 459.67); }, function (a) { return fahrenheit.convertTo(a) + 459.67; });
var temperature = [celsius, fahrenheit, kelvin, rankine];
var kilograms = new unit('Kilograms', function (a) { return a; }, function (a) { return a; });
var grams = new unit('Grams', function (a) { return a / 1000; }, function (a) { return a * 1000; });
var pounds = new unit('Pounds', function (a) { return (45359237 * a) / 100000000; }, function (a) { return (100000000 * a) / 45359237; });
var ounces = new unit('Ounces', function (a) { return pounds.convertFrom(a / 16); }, function (a) { return pounds.convertTo(a * 16); });
var mass = [kilograms, grams, pounds, ounces];
var unitCategories = [distance, pitch, axialVelocity, linearVelocity, temperature, mass];
