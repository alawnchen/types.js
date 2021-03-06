(function() {
  "use strict";
  var LITERALS, TYPES, Types, breakIfEqual, createForce, instanceOf, testValues, typeOf, _,
    __slice = [].slice;

  instanceOf = function(type, value) {
    return value instanceof type;
  };

  typeOf = function(value, type) {
    if (type == null) {
      type = 'object';
    }
    return typeof value === type;
  };

  LITERALS = {
    'Boolean': false,
    'String': '',
    'Object': {},
    'Array': [],
    'Function': function() {},
    'Number': (function() {
      var number;
      number = new Number;
      number["void"] = true;
      return number;
    })()
  };

  TYPES = {
    'Undefined': function(value) {
      return value === void 0;
    },
    'Null': function(value) {
      return value === null;
    },
    'Function': function(value) {
      return typeOf(value, 'function');
    },
    'Boolean': function(value) {
      return typeOf(value, 'boolean');
    },
    'String': function(value) {
      return typeOf(value, 'string');
    },
    'Array': function(value) {
      return typeOf(value) && instanceOf(Array, value);
    },
    'RegExp': function(value) {
      return typeOf(value) && instanceOf(RegExp, value);
    },
    'Date': function(value) {
      return typeOf(value) && instanceOf(Date, value);
    },
    'Number': function(value) {
      return typeOf(value, 'number') && (value === value) || (typeOf(value) && instanceOf(Number, value));
    },
    'Object': function(value) {
      return typeOf(value) && (value !== null) && !instanceOf(Boolean, value) && !instanceOf(Number, value) && !instanceOf(Array, value) && !instanceOf(RegExp, value) && !instanceOf(Date, value);
    },
    'NaN': function(value) {
      return typeOf(value, 'number') && (value !== value);
    },
    'Defined': function(value) {
      return value !== void 0;
    }
  };

  TYPES.StringOrNumber = function(value) {
    return TYPES.String(value) || TYPES.Number(value);
  };

  Types = _ = {
    parseIntBase: 10
  };

  createForce = function(type) {
    var convertType;
    convertType = function(value) {
      switch (type) {
        case 'Number':
          if ((_.isNumber(value = parseInt(value, _.parseIntBase))) && !value["void"]) {
            return value;
          }
          break;
        case 'String':
          if (_.isStringOrNumber(value)) {
            return value + '';
          }
          break;
        default:
          if (Types['is' + type](value)) {
            return value;
          }
      }
    };
    return function(value, replacement) {
      if ((value != null) && void 0 !== (value = convertType(value))) {
        return value;
      }
      if ((replacement != null) && void 0 !== (replacement = convertType(replacement))) {
        return replacement;
      }
      return LITERALS[type];
    };
  };

  testValues = function(predicate, breakState, values) {
    var value, _i, _len;
    if (values == null) {
      values = [];
    }
    if (values.length < 1) {
      return predicate === TYPES.Undefined;
    }
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      if (predicate(value) === breakState) {
        return breakState;
      }
    }
    return !breakState;
  };

  breakIfEqual = true;

  (function() {
    var name, predicate, _results;
    _results = [];
    for (name in TYPES) {
      predicate = TYPES[name];
      _results.push((function(name, predicate) {
        Types['is' + name] = predicate;
        Types['not' + name] = function(value) {
          return !predicate(value);
        };
        Types['has' + name] = function() {
          return testValues(predicate, breakIfEqual, arguments);
        };
        Types['all' + name] = function() {
          return testValues(predicate, !breakIfEqual, arguments);
        };
        if (name in LITERALS) {
          return Types['force' + name] = createForce(name);
        }
      })(name, predicate));
    }
    return _results;
  })();

  Types.intoArray = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length < 2) {
      if (_.isString(args[0])) {
        args = args.join('').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ');
      } else if (_.isArray(args[0])) {
        args = args[0];
      }
    }
    return args;
  };

  Types["typeof"] = function(value) {
    var name, predicate;
    for (name in TYPES) {
      predicate = TYPES[name];
      if (predicate(value) === true) {
        return name.toLowerCase();
      }
    }
  };

  if ((typeof define !== "undefined" && define !== null) && ('function' === typeof define) && define.amd) {
    define('types', [], function() {
      return Types;
    });
  } else if (typeof window !== 'undefined') {
    window.Types = Types;
  } else if (typeof module !== 'undefined') {
    module.exports = Types;
  }

}).call(this);
