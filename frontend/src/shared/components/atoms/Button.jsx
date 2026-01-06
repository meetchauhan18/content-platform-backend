/**
 * Button - Reusable button component with variants
 * Uses design tokens from theme
 *
 * Variants:
 * - primary: Filled accent background
 * - secondary: Outlined with border
 * - ghost: Text only, no border
 * - social: For social login buttons with icon
 *
 * @param {string} variant - Button style variant
 * @param {string} type - Button type (button, submit, reset)
 * @param {boolean} fullWidth - Whether button takes full width
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional classes
 */
const Button = ({
  variant = "primary",
  type = "button",
  fullWidth = false,
  onClick,
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyles = [
    "inline-flex items-center justify-center gap-3",
    "px-6 py-3",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    fullWidth ? "w-full" : "",
  ].join(" ");

  const variants = {
    primary: [
      "rounded-md",
      "bg-accent text-surface-light",
      "dark:bg-accent-dark dark:text-surface-dark",
      "hover:bg-accent-hover dark:hover:bg-accent-dark-hover",
      "focus:ring-accent dark:focus:ring-accent-dark",
    ].join(" "),

    secondary: [
      "rounded-md",
      "border border-neutral-200 dark:border-neutral-700",
      "text-text-primary-light dark:text-text-primary-dark",
      "hover:bg-neutral-100 dark:hover:bg-neutral-800",
      "focus:ring-neutral-400",
    ].join(" "),

    ghost: [
      "text-text-secondary-light dark:text-text-secondary-dark",
      "hover:text-text-primary-light dark:hover:text-text-primary-dark",
      "focus:ring-transparent",
    ].join(" "),

    social: [
      "rounded-md",
      "border border-neutral-200 dark:border-neutral-700",
      "text-text-primary-light dark:text-text-primary-dark",
      "hover:bg-neutral-100 dark:hover:bg-neutral-800",
      "focus:ring-neutral-400",
    ].join(" "),

    pill: [
      "rounded-full",
      "bg-accent text-surface-light",
      "dark:bg-accent-dark dark:text-surface-dark",
      "hover:bg-accent-hover dark:hover:bg-accent-dark-hover",
      "focus:ring-accent dark:focus:ring-accent-dark",
      "shadow-sm",
    ].join(" "),

    "pill-outline": [
      "rounded-full",
      "border border-accent dark:border-accent-dark",
      "text-accent dark:text-accent-dark",
      "hover:bg-accent hover:text-surface-light",
      "dark:hover:bg-accent-dark dark:hover:text-surface-dark",
      "focus:ring-accent dark:focus:ring-accent-dark",
    ].join(" "),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
