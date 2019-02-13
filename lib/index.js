"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useValitedForm;

var _react = require("react");

var _validaJs = _interopRequireDefault(require("valida-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function stateFactory(fields) {
  return Object.keys(fields).reduce(function (acc, key) {
    acc[key] = {
      value: fields[key],
      meta: {
        touched: false,
        dirty: false
      }
    };
    return acc;
  }, {});
}

function emptyErrorFactory(fields) {
  return Object.keys(fields).reduce(function (acc, key) {
    acc[key] = [];
    return acc;
  }, {});
}

function rulesByNameFactory(descriptors, validators) {
  var descriptorBy = descriptors.reduce(function (acc, descriptor) {
    acc[descriptor.name] = acc[descriptor.name] ? acc[descriptor.name].concat([descriptor]) : [descriptor];
    return acc;
  }, {});
  return Object.keys(descriptorBy).reduce(function (acc, key) {
    acc[key] = _validaJs.default.rulesCreator(validators, descriptorBy[key]);
    return acc;
  }, {
    default: _validaJs.default.rulesCreator(validators, descriptors)
  });
}

function getDataFromState(state) {
  return Object.keys(state).reduce(function (acc, key) {
    acc[key] = state[key].value;
    return acc;
  }, {});
}

function extendsValidations(key, validation) {
  var newErrors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return _objectSpread({}, validation, {
    valid: validation.valid && newErrors.length === 0,
    errors: _objectSpread({}, validation.errors, _defineProperty({}, key, newErrors))
  });
}

function onChangeHandlerByKey(state, key, setState, setValidation, validation, rulesBy) {
  return function (event) {
    var newState = _objectSpread({}, state, _defineProperty({}, key, _objectSpread({}, state[key], {
      value: event.currentTarget.value,
      meta: _objectSpread({}, state[key].meta, {
        dirty: true
      })
    })));

    var newErrors = _validaJs.default.validate(rulesBy[key], getDataFromState(newState)).errors[key];

    setState(newState);
    setValidation(extendsValidations(key, validation, newErrors));
  };
}

function onClickHandlerByKey(state, key, setState) {
  return function (_) {
    setState(_objectSpread({}, state, _defineProperty({}, key, _objectSpread({}, state[key], {
      meta: _objectSpread({}, state[key].meta, {
        touched: true
      })
    }))));
  };
}

function formDataFactory(state, setState, setValidation, validation, rulesBy) {
  return Object.keys(state).reduce(function (acc, key) {
    acc[key] = {
      meta: state[key].meta,
      input: {
        value: state[key].value,
        onClick: onClickHandlerByKey(state, key, setState, setValidation, validation, rulesBy),
        onChange: onChangeHandlerByKey(state, key, setState, setValidation, validation, rulesBy)
      }
    };
    return acc;
  }, {});
}

function useValitedForm() {
  var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var descriptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validators = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _validaJs.default.validators;
  var initialErrorsObj = emptyErrorFactory(fields);
  var initialState = stateFactory(fields);

  var _useState = (0, _react.useState)(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var _useState3 = (0, _react.useState)({
    valid: true,
    errors: initialErrorsObj
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      validation = _useState4[0],
      setValidation = _useState4[1];

  var rulesBy = rulesByNameFactory(descriptors, validators);
  var form = formDataFactory(state, setState, setValidation, validation, rulesBy);

  var getData = function getData() {
    return getDataFromState(state);
  };

  var setData = function setData(data) {
    return setState(stateFactory(data));
  };

  var validate = function validate() {
    var newValidations = _validaJs.default.validate(rulesBy.default, getDataFromState(state));

    setValidation(_objectSpread({}, newValidations, {
      errors: _objectSpread({}, initialErrorsObj, newValidations.errors)
    }));
    return newValidations.valid;
  };

  return [form, validation, validate, getData, setData];
}