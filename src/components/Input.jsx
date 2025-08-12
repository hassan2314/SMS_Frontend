// src/components/Input.jsx
import React, { useId } from "react";
import { TextField } from "@mui/material";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <TextField
      id={id}
      type={type}
      label={label}
      variant="outlined"
      fullWidth
      inputRef={ref}
      className={className}
      {...props}
    />
  );
});

export default Input;
