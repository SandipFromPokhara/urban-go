// frontend/src/hooks/useField.js

import { useState } from "react";

export default function useField(
  type = "text",
  initialValue = "",
  validator = () => ""
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setError(validator(val));
  };

  const validate = () => {
    const err = validator(value);
    setError(err);
    return !err;
  };

  const reset = () => {
    setValue("");
    setError("");
  };

  return { type, value, onChange, reset, error, validate };
}
