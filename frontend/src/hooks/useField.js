// frontend/src/hooks/useField.js

import { useState } from "react";

export default function useField(type = "text", initialValue = "", validator = () => "") {
  const [value, setValue] = useState(initialValue || ""); // always a string
  const [error, setError] = useState("");

  const onChange = (e) => {
    const val = (e.target.value || "").toString();
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

  // Only return properties needed for <input>
  return { type, value, onChange, error, validate, reset, setValue };
}
