import { useState } from 'react'
import ValidaJS from 'valida-js'

function stateFactory (fields) {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key] = {
      value: fields[key],
      meta: {
        touched: false,
        dirty: false
      }
    }
    return acc
  }, {})
}

function emptyErrorFactory (fields) {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})
}

function rulesByNameFactory (descriptors, validators) {
  const descriptorBy = descriptors.reduce((acc, descriptor) => {
    acc[descriptor.name] = acc[descriptor.name]
      ? acc[descriptor.name].concat([descriptor])
      : [descriptor]
    return acc
  }, {})
  return Object.keys(descriptorBy).reduce((acc, key) => {
    acc[key] = ValidaJS.rulesCreator(validators, descriptorBy[key])
    return acc
  }, { default: ValidaJS.rulesCreator(validators, descriptors) })
}

function getDataFromState (state) {
  return Object.keys(state).reduce((acc, key) => {
    acc[key] = state[key].value
    return acc
  }, {})
}

function extendsValidations (key, validation, newErrors = []) {
  const newValidation = {
    errors: {
      ...validation.errors,
      [key]: newErrors
    }
  }
  newValidation['valid'] = Object.keys(newValidation.errors).every(errorKey => {
    return newValidation.errors[errorKey].length === 0
  })
  return newValidation
}

function onChangeHandlerByKey (state, key, setState, setValidation, validation, rulesBy) {
  return (event) => {
    const newState = {
      ...state,
      [key]: {
        ...state[key],
        value: event.currentTarget.value,
        meta: {
          ...state[key].meta,
          dirty: true
        }
      }
    }
    const newErrors = ValidaJS.validate(rulesBy[key], getDataFromState(newState)).errors[key]
    setState(newState)
    setValidation(extendsValidations(key, validation, newErrors))
  }
}

function onClickHandlerByKey (state, key, setState) {
  return (_) => {
    setState({
      ...state,
      [key]: {
        ...state[key],
        meta: {
          ...state[key].meta,
          touched: true
        }
      }
    })
  }
}

function formDataFactory (state, setState, setValidation, validation, rulesBy) {
  return Object.keys(state).reduce((acc, key) => {
    acc[key] = {
      meta: state[key].meta,
      input: {
        value: state[key].value,
        onClick: onClickHandlerByKey(state, key, setState, setValidation, validation, rulesBy),
        onChange: onChangeHandlerByKey(state, key, setState, setValidation, validation, rulesBy)
      }
    }
    return acc
  }, {})
}

export default function useValitedForm (fields = {}, descriptors = [], validators = ValidaJS.validators) {
  const initialErrorsObj = emptyErrorFactory(fields)
  const initialState = stateFactory(fields)
  const [state, setState] = useState(initialState)
  const [validation, setValidation] = useState({ valid: true, errors: initialErrorsObj })
  const rulesBy = rulesByNameFactory(descriptors, validators)
  const form = formDataFactory(state, setState, setValidation, validation, rulesBy)

  const getData = () => getDataFromState(state)
  const setData = (data) => setState(stateFactory(data))
  const validate = () => {
    const newValidations = ValidaJS.validate(rulesBy.default, getDataFromState(state))
    setValidation({ ...newValidations, errors: { ...initialErrorsObj, ...newValidations.errors } })
    return newValidations.valid
  }

  return [
    form,
    validation,
    validate,
    getData,
    setData
  ]
}
