
import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
}

export default function InputField({ label, type = "text", name, required = false, error, className = "", ...props }: InputFieldProps) {
    return (
        <div className="form-item">
            <label className="flex flex-col">
                {label}
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
                    type={type}
                    name={name}
                    required={required}
                    {...props}
                />
                {
                    error && (<em className="text-red-600">{error}</em>)
                }
            </label>
        </div>
    );
}
