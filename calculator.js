var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var unit = (function () {
    function unit(label, convertFrom, convertTo) {
        this.label = label;
        this.convertFrom = convertFrom;
        this.convertTo = convertTo;
    }
    unit.prototype.createField = function () {
        var i = document.createElement('input');
        i.setAttribute('type', 'text');
        return [i, function () { return Number(i.value); }, function (value) { i.value = String(value); }];
    };
    return unit;
}());
var dropdownUnit = (function (_super) {
    __extends(dropdownUnit, _super);
    function dropdownUnit(label, converter, options) {
        _super.call(this, label, converter.convertFrom, converter.convertTo);
        this.options = options;
    }
    dropdownUnit.prototype.createField = function () {
        var i = document.createElement('select');
        for (var z = 0; z < this.options.length; z++) {
            var o = document.createElement('option');
            o.appendChild(document.createTextNode(this.options[z].label));
            o.setAttribute('value', String(this.options[z].value));
            i.appendChild(o);
        }
        return [i, function () { return Number(i.selectedOptions[0].value); }, function (value) { console.log('Is there even a good way to do this?'); }];
    };
    return dropdownUnit;
}(unit));
var measure = (function () {
    function measure(name, dimension) {
        this.name = name;
        this.dimension = dimension;
        this.self = document.createElement('span');
        this.inputContainer = document.createElement('span');
        this.select = document.createElement('select');
        for (var z = 0; z < dimension.length; z++) {
            var t = this;
            var o = document.createElement('option');
            var tmp = o;
            o.appendChild(document.createTextNode(dimension[z].label));
            tmp.update = function (a) {
                return function () {
                    t.converter = dimension[a];
                    var inputInstance = dimension[a].createField();
                    t.input = inputInstance[0];
                    t.getInput = inputInstance[1];
                    t.putOutput = inputInstance[2];
                    while (t.inputContainer.firstChild)
                        t.inputContainer.removeChild(t.inputContainer.firstChild);
                    t.inputContainer.appendChild(t.input);
                };
            }(z);
            this.select.appendChild(o);
        }
        this.select.addEventListener('change', function (e) {
            (e.target).selectedOptions[0].update();
        });
        this.select.selectedOptions[0].update();
        this.self.appendChild(document.createTextNode(this.name));
        this.self.appendChild(this.inputContainer);
        this.self.appendChild(this.select);
    }
    measure.prototype.getValue = function () {
        return this.converter.convertFrom(this.getInput());
    };
    measure.prototype.putValue = function (value, round) {
        this.putOutput(round(this.converter.convertTo(value)));
    };
    return measure;
}());
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
}());
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
}(calculator));
var millimeters = new unit('Millimeters', function (a) { return a / 1000; }, function (a) { return a * 1000; });
var meters = new unit('Meters', function (a) { return a; }, function (a) { return a; });
var microns = new unit('Microns', function (a) { return a / (1000 * 1000); }, function (a) { return a * (1000 * 1000); });
var inches = new unit('Inches', function (a) { return 127 * a / 5000; }, function (a) { return 5000 * a / 127; });
var feet = new unit('Feet', function (a) { return 381 * a / 1250; }, function (a) { return 1250 * a / 381; });
var thousanths = new unit('Thousanths of an inch', function (a) { return inches.convertFrom(a / 1000); }, function (a) { return inches.convertTo(a) * 1000; });
var distance = [millimeters, meters, microns, inches, feet, thousanths];
var inverseMeters = new unit('Inverse meters', function (a) { return 1 / a; }, function (a) { return 1 / a; });
var inverseInches = new unit('Inverse inches', function (a) { return 127 * (1 / a) / 5000; }, function (a) { return 1 / (5000 * a / 127); });
var metricCoarseThreads = new dropdownUnit('Coarse M thread pitches', millimeters, [{ label: 'M1.60', value: 0.35 }, { label: 'M2', value: 0.40 }, { label: 'M2.50', value: 0.45 }, { label: 'M3', value: 0.50 }, { label: 'M3.50', value: 0.60 }, { label: 'M4', value: 0.70 }, { label: 'M5', value: 0.80 }, { label: 'M6', value: 1 }, { label: 'M8', value: 1.25 }, { label: 'M10', value: 1.50 }, { label: 'M12', value: 1.75 }, { label: 'M14', value: 2 }, { label: 'M16', value: 2 }, { label: 'M20', value: 2.50 }, { label: 'M22', value: 2.50 }, { label: 'M24', value: 3 }, { label: 'M27', value: 3 }, { label: 'M30', value: 3.50 }, { label: 'M36', value: 4 }, { label: 'M42', value: 4.50 }, { label: 'M48', value: 5 }, { label: 'M56', value: 5.50 }, { label: 'M64', value: 6 }, { label: 'M68', value: 6 }]);
var UNCThreads = new dropdownUnit('Coarse UTS thread pitches', inverseInches, [{ label: '#1', value: 64 }, { label: '#2', value: 56 }, { label: '#3', value: 48 }, { label: '#4', value: 40 }, { label: '#5', value: 40 }, { label: '#6', value: 32 }, { label: '#8', value: 32 }, { label: '#10', value: 24 }, { label: '#12', value: 24 }, { label: '1\u20444', value: 20 }, { label: '5\u204416', value: 18 }, { label: '3\u20448', value: 16 }, { label: '7\u204416', value: 14 }, { label: '1\u20442', value: 13 }, { label: '9\u204416', value: 12 }, { label: '5\u20448', value: 11 }, { label: '3\u20444', value: 10 }, { label: '7\u20448', value: 9 }, { label: '1', value: 8 }]);
var UNFThreads = new dropdownUnit('Fine UTS thread pitches', inverseInches, [{ label: "#0", value: 80 }, { label: "#1", value: 72 }, { label: "#2", value: 64 }, { label: "#3", value: 56 }, { label: "#4", value: 48 }, { label: "#5", value: 44 }, { label: "#6", value: 40 }, { label: "#8", value: 36 }, { label: "#10", value: 32 }, { label: "#12", value: 28 }, { label: "1\u20444", value: 28 }, { label: "5\u204416", value: 24 }, { label: "3\u20448", value: 24 }, { label: "7\u204416", value: 20 }, { label: "1\u20442", value: 20 }, { label: "9\u204416", value: 18 }, { label: "5\u20448", value: 18 }, { label: "3\u20444", value: 16 }, { label: "7\u20448", value: 14 }, { label: "1", value: 12 }]);
var UNEFThreads = new dropdownUnit('Extra fine UTS thread pitches', inverseInches, [{ label: "#12", value: 32 }, { label: "1\u20444", value: 32 }, { label: "5\u204416", value: 32 }, { label: "3\u20448", value: 32 }, { label: "7\u204416", value: 28 }, { label: "1\u20442", value: 28 }, { label: "9\u204416", value: 24 }, { label: "5\u20448", value: 24 }, { label: "3\u20444", value: 20 }, { label: "7\u20448", value: 20 }, { label: "1", value: 20 }]);
var pitch = distance.concat([inverseMeters, inverseInches, metricCoarseThreads, UNCThreads, UNFThreads, UNEFThreads]);
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
