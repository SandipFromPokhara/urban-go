// frontend/src/hooks/useField.js

import { useState } from "react";

export default function useField(
  type = "text",
  initialValue = "",
  validator = () => "",
  maxLength = Infinity
) {
  const [value, setValue] = useState(initialValue || ""); // always a string
  const [error, setError] = useState("");

  const onChange = (e) => {
    let val = (e.target.value || "").toString();

    // Apply maxLength
    if (val.length > maxLength) val = val.slice(0, maxLength);
    setValue(val);
    setError(validator(val));
  };

  const validate = () => {
    const err = validator(value || "");
    setError(err);
    return !err;
  };

  const reset = () => {
    setValue("");
    setError("");
  };

  // Return properties for spreading directly on <input>
  return { type, value, onChange, error, validate, reset, setValue };
}
