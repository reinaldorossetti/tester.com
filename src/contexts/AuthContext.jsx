import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * @typedef {Object} AuthUser
 * @property {number}  id         - Database row ID.
 * @property {string}  name       - User's first name.
 * @property {string}  lastName   - User's last name.
 * @property {string}  email      - User's email address.
 * @property {string}  personType - `'PF'` (individual) or `'PJ'` (company).
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {AuthUser|null} user       - Currently authenticated user, or `null`.
 * @property {boolean}       isLoggedIn - `true` when a user session is active.
 * @property {function(AuthUser): void} login  - Persists a user session.
 * @property {function(): void}          logout - Clears the current session.
 */

/** @type {React.Context<AuthContextValue>} */
const AuthContext = createContext(undefined);

/**
 * Provides authentication state to the component tree.
 *
 * On mount the provider restores any previously persisted session from
 * `localStorage` so that the user stays logged in across page reloads.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  /** @type {[AuthUser|null, React.Dispatch<React.SetStateAction<AuthUser|null>>]} */
  const [user, setUser] = useState(null);

  // Restore session from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // Corrupt data — ignore and start with no session
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  /**
   * Logs a user in by storing their data in React state and localStorage.
   *
   * @param {AuthUser} userData - Authenticated user details from the database.
   * @returns {void}
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  /**
   * Logs the current user out by clearing React state and removing the
   * persisted session from localStorage.
   *
   * @returns {void}
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook that returns the current {@link AuthContextValue}.
 *
 * Must be called from a component rendered inside {@link AuthProvider}.
 *
 * @returns {AuthContextValue}
 * @throws {Error} If called outside an `AuthProvider` tree.
 *
 * @example
 * const { isLoggedIn, user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
