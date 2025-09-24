import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router";

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="glass-dark border-b border-white/10 sticky top-0 z-40 animate-slide-up text-foreground">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-black">SkillAssess</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-4">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/reports", label: "Reports" },
                ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
              ].map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs font-medium text-black/90 hover:text-black transition-all duration-150 hover:scale-105 stagger-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-150 hover-lift"
            >
              <div className="w-7 h-7 btn-gradient rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-black">
                  {getInitials(user?.name ?? "")}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium text-gray-900 text-sm">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform duration-150 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 glass rounded-lg shadow-xl animate-scale-in">
                <div className="p-2 border-b border-gray-200/20">
                  <p className="font-medium text-gray-900 text-sm">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/reports"
                    className="flex items-center gap-2 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    My Reports
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
