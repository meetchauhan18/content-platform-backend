/**
 * Divider - Horizontal divider with optional text
 * Uses design tokens from theme
 *
 * @param {string} text - Optional text to display in center
 * @param {string} className - Additional classes
 */
const Divider = ({ text, className = "" }) => {
  if (!text) {
    return (
      <div
        className={`w-full h-px bg-neutral-200 dark:bg-neutral-700 ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
      <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
        {text}
      </span>
      <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
};

export default Divider;
