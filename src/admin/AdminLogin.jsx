import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const adminApiOfflineMessage =
  "Admin API is offline. Start the app with npm.cmd run dev so the frontend and admin server run together.";

const readJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      error:
        "The admin API returned an unexpected response. Please confirm the backend server is running.",
    };
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const otpInputRefs = useRef([]);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [otpChallenge, setOtpChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const otpCode = otpDigits.join("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Admin API is unavailable");
        return response.json();
      })
      .then((session) => {
        if (!isMounted) return;
        setApiStatus("online");
        if (session.authenticated) navigate("/admin/dashboard");
      })
      .catch(() => {
        if (isMounted) setApiStatus("offline");
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleOtpDigitChange = (index, value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length > 1) {
      const nextDigits = [...otpDigits];
      digits
        .slice(0, 6 - index)
        .split("")
        .forEach((digit, offset) => {
          nextDigits[index + offset] = digit;
        });
      setOtpDigits(nextDigits);
      const focusIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    if (digit && index < otpInputRefs.current.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedDigits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (!pastedDigits.length) return;

    const nextDigits = Array(6).fill("");
    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setOtpDigits(nextDigits);

    const focusIndex = Math.min(pastedDigits.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const resetOtpStep = () => {
    setOtpChallenge(null);
    setOtpDigits(Array(6).fill(""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await readJsonResponse(response);

      if (!response.ok) {
        toast.error(result.error || "Invalid username or password.");
        return;
      }

      setApiStatus("online");
      if (result.otpRequired) {
        setOtpChallenge({
          challengeId: result.challengeId,
          username: result.username,
          recipientHint: result.recipientHint,
          expiresInMinutes: result.expiresInMinutes,
        });
        setCredentials((current) => ({ ...current, password: "" }));
        setOtpDigits(Array(6).fill(""));
        toast.success("Verification code sent to your email.");
        setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
        return;
      }

      toast.success("Login successful.");
      navigate("/admin/dashboard");
    } catch {
      setApiStatus("offline");
      toast.error(adminApiOfflineMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otpChallenge || otpCode.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: otpChallenge.challengeId,
          otp: otpCode,
        }),
      });
      const result = await readJsonResponse(response);

      if (!response.ok) {
        toast.error(result.error || "Invalid or expired verification code.");
        return;
      }

      setApiStatus("online");
      toast.success("Verification complete.");
      navigate("/admin/dashboard");
    } catch {
      setApiStatus("offline");
      toast.error(adminApiOfflineMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-800 px-4">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-cyan/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue flex items-center justify-center mx-auto mb-4">
              <i
                className={`fas ${
                  otpChallenge ? "fa-shield-halved" : "fa-lock"
                } text-3xl text-white`}
              ></i>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {otpChallenge ? "Verify Access" : "Admin Login"}
            </h2>
            <p className="text-gray-400 mt-2">
              {otpChallenge
                ? `Enter the 6-digit code sent to ${
                    otpChallenge.recipientHint || "your email"
                  }`
                : "Enter your credentials to access the dashboard"}
            </p>
          </div>

          {apiStatus === "offline" && (
            <div className="mb-6 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              <i className="fas fa-triangle-exclamation mr-2"></i>
              {adminApiOfflineMessage}
            </div>
          )}

          {!otpChallenge ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Username
                </label>
                <div className="relative">
                  <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-accent-cyan"
                    placeholder="Admin username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-accent-cyan"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-gray-300 transition-colors hover:text-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/60"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>Sign in
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-3 text-sm text-cyan-50">
                <div className="flex items-start gap-3">
                  <i className="fas fa-envelope mt-1 text-accent-cyan"></i>
                  <div>
                    <p className="font-semibold text-white">
                      Code sent for {otpChallenge.username}
                    </p>
                    <p className="mt-1 text-gray-300">
                      It expires in {otpChallenge.expiresInMinutes || 10} minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-center text-gray-300 mb-3 font-semibold">
                  Verification code
                </label>
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(input) => {
                        otpInputRefs.current[index] = input;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      aria-label={`Verification digit ${index + 1}`}
                      value={digit}
                      onChange={(e) =>
                        handleOtpDigitChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="h-14 rounded-xl border border-white/20 bg-white/10 text-center text-2xl font-bold text-white shadow-inner shadow-black/10 outline-none transition-all duration-200 focus:border-accent-cyan focus:bg-white/15 focus:ring-2 focus:ring-accent-cyan/40 sm:h-16"
                      maxLength="1"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-circle-check mr-2"></i>Verify code
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetOtpStep}
                className="w-full rounded-lg border border-white/15 py-3 font-semibold text-gray-200 transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              >
                <i className="fas fa-arrow-left mr-2"></i>Use different credentials
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
