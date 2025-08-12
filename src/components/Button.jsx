// src/components/Button.jsx
import React from "react";
import { Button as MUIButton } from "@mui/material";

const Button = ({
  children,
  type = "button",
  className = "",
  variant = "contained", // can be "outlined" or "text" if needed
  color = "primary", // MUI color theme: "primary", "secondary", "error", etc.
  ...props
}) => {
  return (
    <MUIButton
      type={type}
      variant={variant}
      color={color}
      className={className}
      sx={{
        borderRadius: "9999px", // matches `rounded-full`
        py: 1,
        px: 3,
        textTransform: "none", // prevent all caps
      }}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
