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
var millimeters = new unit('Millimeters', function (a) { return a / 1000; }, function (a) { return a * 1000; });
var meters = new unit('Meters', function (a) { return a; }, function (a) { return a; });
var inches = new unit('Inches', function (a) { return 127 * a / 5000; }, function (a) { return 5000 * a / 127; });
var feet = new unit('Feet', function (a) { return 381 * a / 1250; }, function (a) { return 1250 * a / 381; });
var distance = [millimeters, meters, inches, feet];
var inverseMeters = new unit('Inverse meters', function (a) { return 1 / a; }, function (a) { return 1 / a; });
var inverseInches = new unit('Inverse inches', function (a) { return 127 * (1 / a) / 5000; }, function (a) { return 1 / (5000 * a / 127); });
var pitch = distance.concat([inverseMeters, inverseInches]);
var radiansPerSecond = new unit('Radians per second', function (a) { return a; }, function (a) { return a; });
var rotationsPerMinute = new unit('RPM', function (a) { return Math.PI * a / 30; }, function (a) { return a / Math.PI * 30; });
var axialVelocity = [radiansPerSecond, rotationsPerMinute];
var metersPerSecond = new unit('Meters per second', function (a) { return a; }, function (a) { return a; });
var feetPerMinute = new unit('Feet per minute', function (a) { return (127 * a) / 25000; }, function (a) { return (25000 * a) / 127; });
var linearVelocity = [metersPerSecond, feetPerMinute];
var celcius = new unit('Degrees celcius', function (a) { return a; }, function (a) { return a; });
var fahrenheit = new unit('Degrees fahrenheit', function (a) { return a / 2; }, function (a) { return ((9 / 5) * (a + (5463 / 20)) - (45967 / 100)); });
var temperature = [celcius, fahrenheit];
var unitCategories = [distance, pitch, axialVelocity, linearVelocity, temperature];
