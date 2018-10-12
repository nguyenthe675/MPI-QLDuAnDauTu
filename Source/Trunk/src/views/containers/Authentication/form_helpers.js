import React from 'react'
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export const renderTextField = ({ input, type, label, meta: { touched, error }, ...custom }) => (  // Define stateless component to render input and errors
  <div>
    <TextField
      type={type}
      label={label}
      {...input}
      {...custom}
    />
    {touched && error && <span className="error">{error}</span>}
  </div>
)

export const renderFormControl = ({ input, type, label, meta: { touched, error }, ...custom }) => (  // Define stateless component to render input and errors
  // <div>
  //   <TextField
  //     type={type}
  //     label={label}
  //     {...input}
  //     {...custom}
  //   />
  //   {touched && error && <span className="error">{error}</span>}
  // </div>
  <FormControl
    {...custom}
  >
    <InputLabel >{label}</InputLabel>
    <Input type={type} />
    {touched && error && <span className="error">{error}</span>}
  </FormControl>
)
