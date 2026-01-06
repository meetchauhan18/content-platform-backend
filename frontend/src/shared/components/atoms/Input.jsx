/**
 * Input - Reusable form input component
 * Uses design tokens from theme
 *
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Controlled value
 * @param {function} onChange - Change handler
 * @param {string} name - Input name for form handling
 * @param {boolean} required - Whether field is required
 * @param {string} autoComplete - Autocomplete attribute
 * @param {string} className - Additional classes
 */
const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  autoComplete,
  className = "",
  ...props
}) => {
  const baseStyles = [
    "w-full",
    "px-4 py-3",
    "rounded-md",
    "border border-neutral-200 dark:border-neutral-700",
    "bg-surface-light dark:bg-neutral-800",
    "text-text-primary-light dark:text-text-primary-dark",
    "placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark",
    "focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:border-transparent",
    "transition-all duration-150",
  ].join(" ");

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      autoComplete={autoComplete}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
