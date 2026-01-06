import { Input, Button, Divider } from "@shared/components/atoms";
import { GoogleIcon, AppleIcon } from "@shared/components/atoms/icons";

/**
 * RegisterForm - Account creation with social options
 *
 * @param {function} onSwitchToLogin - Handler to switch to login view
 * @param {function} onSubmit - Form submission handler
 */
const RegisterForm = ({ onSwitchToLogin, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit?.({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
  };

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl leading-tight mb-2 tracking-tight">
        Get started
      </h2>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
        Create your account
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Full name"
          autoComplete="name"
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          required
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1">
            Create account
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onSwitchToLogin}
          >
            Sign in
          </Button>
        </div>
      </form>

      <Divider text="or" className="my-6" />

      <div className="space-y-3">
        <Button variant="social" fullWidth>
          <GoogleIcon />
          Sign up with Google
        </Button>
        <Button variant="social" fullWidth>
          <AppleIcon />
          Sign up with Apple
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
