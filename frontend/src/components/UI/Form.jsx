import React from "react";

const Form = React.forwardRef(
  ({ children, label, htmlFor, onChange, ...props }, ref) => {
    return (
      <div className="mb-3">
        <label htmlFor={htmlFor} className="form-label">
          {label}
        </label>
        <input {...props} ref={ref} onChange={onChange} />
        {children}
      </div>
    );
  }
);

export default Form;
