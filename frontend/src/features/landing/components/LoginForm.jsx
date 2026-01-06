import { Input, Button, Divider } from "@shared/components/atoms";
import { GoogleIcon, AppleIcon } from "@shared/components/atoms/icons";

/**
 * LoginForm - Email/password login with social options
 *
 * @param {function} onSwitchToRegister - Handler to switch to register view
 * @param {function} onSubmit - Form submission handler
 */
const LoginForm = ({ onSwitchToRegister, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit?.({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  };

  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl leading-tight mb-2 tracking-tight">
        Welcome back
      </h2>
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
        Sign in to your account
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" className="flex-1">
            Log in
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onSwitchToRegister}
          >
            Create account
          </Button>
        </div>
      </form>

      <Divider text="or" className="my-6" />

      <div className="space-y-3">
        <Button variant="social" fullWidth>
          <GoogleIcon />
          Sign in with Google
        </Button>
        <Button variant="social" fullWidth>
          <AppleIcon />
          Sign in with Apple
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
