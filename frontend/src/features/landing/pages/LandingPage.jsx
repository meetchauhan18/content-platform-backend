// libs imports
import { useState } from "react";

// local imports
import LandingLogoImg from "../../../assets/images/Vami - for dark mode.png";
import LandingArtImg from "../../../assets/images/landing_page_art.png";
import { LoginForm, RegisterForm } from "../components";
import { Button } from "@shared/components/atoms";
import { ArrowRightIcon } from "@shared/components/atoms/icons";

/**
 * View states for landing page content area
 * @typedef {'hero' | 'login' | 'register'} ViewState
 */

/**
 * HeroContent - Main landing page hero section
 */
const HeroContent = ({ onGetStarted, onLearnMore }) => (
  <div>
    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 tracking-tight">
      Thoughts
      <br />
      <span className="italic font-normal opacity-90">Words</span> &amp;
      <br />
      ideas
    </h1>

    <p className="font-body text-base md:text-lg font-normal text-text-secondary-light dark:text-text-secondary-dark max-w-md mx-auto lg:mx-0 leading-relaxed mb-8">
      A place to read, write, and deepen your understanding.
      <span className="font-medium mt-2 block">Connected, not bound.</span>
    </p>

    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
      <Button variant="pill" onClick={onGetStarted}>
        Start reading
      </Button>

      <button
        onClick={onLearnMore}
        className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors duration-150"
      >
        Learn more
        <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-150" />
      </button>
    </div>
  </div>
);

/**
 * LandingPage - Main landing page with auth forms
 *
 * Architecture:
 * - Uses view state machine: 'hero' | 'login' | 'register'
 * - Modular form components for maintainability
 * - Smooth transitions between states
 * - Fully tokenized styling
 */
const LandingPage = () => {
  /** @type {[ViewState, function]} */
  const [view, setView] = useState("hero");

  // View transition handlers
  const showHero = () => setView("hero");
  const showLogin = () => setView("login");
  const showRegister = () => setView("register");

  // Form submission handlers (to be connected to auth service)
  const handleLoginSubmit = (data) => {
    console.log("Login:", data);
    // TODO: Connect to auth service
  };

  const handleRegisterSubmit = (data) => {
    console.log("Register:", data);
    // TODO: Connect to auth service
  };

  // Derived state
  const isAuthView = view === "login" || view === "register";

  // Transition classes for content switching
  const getTransitionClasses = (targetView) => {
    const isActive = view === targetView;
    return isActive
      ? "opacity-100 translate-x-0"
      : "opacity-0 translate-x-[20px] absolute inset-0 pointer-events-none";
  };

  return (
    <div className="h-screen overflow-hidden bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark font-body flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full px-6 py-4">
        <div className="max-w-content mx-auto flex justify-between items-center">
          {/* Logo - returns to hero */}
          <button
            onClick={showHero}
            className="flex items-center focus:outline-none"
            aria-label="Return to home"
          >
            <img
              alt="VAMI Logo"
              src={LandingLogoImg}
              className="h-10 w-auto"
            />
          </button>

          {/* Navigation - hides on auth views */}
          <div
            className={`flex items-center gap-8 transition-all duration-300 ease-out ${
              isAuthView
                ? "opacity-0 translate-y-[-8px] pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="hidden md:flex items-center gap-8">
              {["Philosophy", "Journal", "Membership"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors duration-150"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={showLogin}
                className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark hover:opacity-70 transition-opacity duration-150"
              >
                Sign in
              </button>
              <Button variant="pill-outline" onClick={showRegister}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-content w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* LEFT - Dynamic Content Area */}
          <div className="flex-1 max-w-lg text-center lg:text-left relative">
            {/* Hero View */}
            <div
              className={`transition-all duration-300 ease-out ${getTransitionClasses("hero")}`}
            >
              <HeroContent
                onGetStarted={showRegister}
                onLearnMore={() => {}}
              />
            </div>

            {/* Login View */}
            <div
              className={`transition-all duration-300 ease-out ${getTransitionClasses("login")}`}
            >
              <LoginForm
                onSwitchToRegister={showRegister}
                onSubmit={handleLoginSubmit}
              />
            </div>

            {/* Register View */}
            <div
              className={`transition-all duration-300 ease-out ${getTransitionClasses("register")}`}
            >
              <RegisterForm
                onSwitchToLogin={showLogin}
                onSubmit={handleRegisterSubmit}
              />
            </div>
          </div>

          {/* RIGHT - Visual Element */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <img
              alt="Abstract art representing human connection"
              src={LandingArtImg}
              className="object-contain max-h-[50vh] w-auto"
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 px-6">
        <div className="max-w-content mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-text-muted-light dark:text-text-muted-dark gap-2">
          <div className="flex flex-wrap justify-center gap-6">
            {["About", "Blog", "Privacy", "Terms"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>
          <p>© 2026 VAMI Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
