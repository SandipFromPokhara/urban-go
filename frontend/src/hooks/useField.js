// src/hooks/useField.js

import { useState } from "react";

export default function useField(initialValue = "", validator = (v) => "") {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState("");

    const onChange =(e) => {
        const value = e.target.value;
        setValue(value);
        setError(validator(value));
    };

    const validate = () => {
        const err = validator(value);
        setError(err);
        return !err;
    }

    return { value, setValue, onChange, error, validate };
}