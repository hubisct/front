import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, LogIn, ArrowLeft, Lock, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { isValidEmail, isValidPassword } from "../utils/validation";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in or after login
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/painel");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("E-mail inválido");
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordError("Senha deve ter ao menos 10 caracteres");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setError(
        "E-mail ou senha incorretos. Verifique seus dados e tente novamente.",
      );
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center md:items-start justify-center px-4 py-12 md:pt-20 relative"
      style={{
        background:
          "linear-gradient(135deg, #F3F0FF 0%, #FFF7ED 50%, #EFF6FF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#7C3AED" }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#EA580C" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#FBBF24" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-700 transition-colors mb-6 font-semibold text-sm"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)",
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="h-18 bg-white/80 rounded-2xl px-3 flex items-center">
                <ImageWithFallback
                  src="/logo-hubis.png"
                  alt="HUB IS"
                  className="h-14 w-auto object-contain"
                />
              </div>
            </div>
            <h1
              className="text-white mb-1"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "1.4rem",
              }}
            >
              Área Restrita
            </h1>
            <p
              className="text-white/80 text-sm"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
            >
              Acesso para administradores e empreendedores
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className="block text-gray-700 mb-1.5"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (!email) setEmailError("E-mail obrigatório");
                      else if (!isValidEmail(email))
                        setEmailError("E-mail inválido");
                      else setEmailError("");
                    }}
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50 focus:bg-white"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  />
                </div>
                {emailError && (
                  <p
                    className="text-red-600 text-sm mt-1"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-gray-700 mb-1.5"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => {
                      if (!password) setPasswordError("Senha obrigatória");
                      else if (!isValidPassword(password))
                        setPasswordError(
                          "Senha deve ter ao menos 10 caracteres",
                        );
                      else setPasswordError("");
                    }}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50 focus:bg-white"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p
                    className="text-red-600 text-sm mt-1"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p
                    className="text-red-700 text-sm"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: loading
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)",
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </>
                )}
              </button>

              {/* Recovery hint */}
              <p
                className="text-center text-gray-500 text-xs"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                Esqueceu o acesso?{" "}
                <span className="text-purple-600">
                  Entre em contato com a equipe do Hub IS
                </span>
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
