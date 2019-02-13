React Valida Hook
==========================================

Custom hook to create validable forms using `valida-js` for validation

For validation rules see valida-js [docs](https://www.npmjs.com/package/valida-js)

```js
/**
 * useValitedForm Hook
 * @param {Object} initialData
 * @param {Array} validation rules
 * @param {Object} valida-js validators. default: valida-js default validators
 * */
```

## How to use it

Live example [here](https://frontarm.com/demoboard/?id=b7b836cc-327f-4061-9aeb-621458064c97)

```js
import React from 'react'
import ReactDOM from 'react-dom'
import useValitedForm from 'react-valida-hook'

const initialState = {
  firstName: '',
  lastName: '',
  email: ''
}

const validations = [
  {
    name: 'firstName',
    type: 'required',
    stateMap: 'firstName'
  },
  {
    name: 'lastName',
    type: 'required',
    stateMap: 'lastName'
  },
  {
    name: 'email',
    type: 'required',
    stateMap: 'email'
  },
  {
    name: 'email',
    type: 'isEmail',
    stateMap: 'email'
  }
]

function UserForm () {
  const [formData, validation, validateForm, getData] = useValitedForm(initialState, validations)
  const submit = (event) => {
    event.preventDefault()
    const valid = validateForm()
    console.log(getData())
  }
  return (
    <form noValidate={true} onSubmit={submit}>
      <div>
        <label htmlFor='first-name'>First name:</label>
        <input name='first-name' id='first-name' { ...formData.firstName.input } />
        <div className='errors'>
          { validation.errors.firstName.join(', ')}
        </div>
      </div>
      <div>
        <label htmlFor='last-name'>Last name:</label>
        <input name='last-name' id='last-name' { ...formData.lastName.input } />
        <div className='errors'>
          { validation.errors.lastName.join(', ')}
        </div>
      </div>
      <div>
        <label htmlFor='email'>Email:</label>
        <input name='email' id='email' { ...formData.email.input } />
        <div className='errors'>
          { validation.errors.email.join(', ')}
        </div>
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
}

ReactDOM.render(
  <div>
    <UserForm />
  </div>,
  document.getElementById('root')
)
```

### How do develop a feature development

#### How to run the project

```bash
# Install all the dependencies of the project with npm or yarn
yarn # or npm install

# Run the development server with
yarn dev # or npm run dev
```

#### How to run test

```bash
yarn test # or yarn test --watch
```

#### How to build the project

```bash
yarn build # npm run build
```