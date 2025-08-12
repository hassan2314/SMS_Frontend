// src/components/Select.jsx
import React, { useId } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
} from "@mui/material";

const Select = React.forwardRef(function Select(
  { options = [], label, className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <FormControl fullWidth className={className}>
      {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
      <MUISelect
        labelId={`${id}-label`}
        id={id}
        label={label}
        inputRef={ref}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
});

export default Select;
