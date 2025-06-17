// import { createContext, useState, useEffect } from "react";
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { email, role }
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const email = localStorage.getItem("email");
//     const role = localStorage.getItem("role");
//     if (token && email && role) {
//       setUser({ email, role });
//     }
//   }, []);
//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     window.location.href = "/login";
//   };
//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// import React, { createContext, useState, useEffect, useContext } from "react";
// import api from "../api/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
//   const [loading, setLoading] = useState(true);

//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       const userId = localStorage.getItem("userId");

//       if (!refreshToken || !userId) throw new Error("Missing refresh credentials");

//       const res = await api.post("/auth/refresh-token", {
//         refreshToken,
//         userId,
//       });

//       const newAccessToken = res.data.accessToken;
//       localStorage.setItem("accessToken", newAccessToken);
//       setAccessToken(newAccessToken);
//     } catch (err) {
//       console.error("Refresh failed", err);
//       logout();
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setAccessToken(null);
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         // You can add an optional verify endpoint call here if needed
//         await refreshToken();
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyToken();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
//       {!loading ? children : <div>Loading...</div>}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../api/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const publicRoutes = ["/login", "/signup"];

//   const refreshToken = async () => {
//     const refreshToken = localStorage.getItem("refreshToken");
//     const userId = localStorage.getItem("userId");

//     if (!refreshToken || !userId) {
//       console.warn("Refresh skipped: Missing refreshToken or userId");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await api.post("/auth/refresh-token", {
//         refreshToken,
//         userId,
//       });

//       const newAccessToken = res.data.accessToken;
//       localStorage.setItem("accessToken", newAccessToken);
//       setAccessToken(newAccessToken);
//     } catch (err) {
//       console.error("Refresh failed", err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setAccessToken(null);
//     navigate("/login");
//   };

//   useEffect(() => {
//     if (publicRoutes.includes(location.pathname)) {
//       setLoading(false); // ✅ Skip refresh on login/signup
//     } else {
//       refreshToken();
//     }
//   }, [location.pathname]);

//   return (
//     <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
//       {!loading ? children : <div>Loading...</div>}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useState, useEffect, useContext } from "react";
// import api from "../api/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
//   const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
//   const [user, setUser] = useState({
//     userId: localStorage.getItem("userId"),
//     role: localStorage.getItem("role"),
//     email: localStorage.getItem("email"),
//   });
//   const [loading, setLoading] = useState(true);

//   const setToken = ({ accessToken, refreshToken, userId, role, email }) => {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     localStorage.setItem("userId", userId);
//     localStorage.setItem("role", role);
//     localStorage.setItem("email", email);

//     setAccessToken(accessToken);
//     setRefreshToken(refreshToken);
//     setUser({ userId, role, email });
//   };

//   const logout = () => {
//     localStorage.clear();
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     window.location.href = "/login";
//   };

//   const refreshAccessToken = async () => {
//     try {
//       if (!refreshToken || !user?.userId) throw new Error("Missing refresh credentials");

//       const res = await api.post("/auth/refresh-token", {
//         refreshToken,
//         userId: user.userId,
//       });

//       const newAccessToken = res.data.accessToken;
//       localStorage.setItem("accessToken", newAccessToken);
//       setAccessToken(newAccessToken);
//     } catch (err) {
//       console.error("Refresh failed", err);
//       logout();
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         if (refreshToken && user?.userId) {
//           await refreshAccessToken();
//           setLoading(false);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ accessToken, refreshToken, user, setToken, logout }}>
//       {!loading ? children : <div>Loading...</div>}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [user, setUser] = useState({
    userId: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    email: localStorage.getItem("email"),
  });
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const setToken = ({ accessToken, refreshToken, userId, role, email }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ userId, role, email });
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // seconds
      return decoded.exp < now;
    } catch (err) {
      console.error("Invalid token or decode error", err);
      return true;
    }
  };

  const refreshAccessTokenIfNeeded = async () => {
    if (!accessToken || isTokenExpired(accessToken)) {
      console.log("Access token expired. Attempting refresh...");
      try {
        if (!refreshToken || !user.userId) throw new Error("Missing refresh credentials");

        const res = await api.post("/auth/refresh-token", {
          refreshToken,
          userId: user.userId,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
      } catch (err) {
        console.error("Token refresh failed", err);
        logout();
      }
    } else {
      console.log("Access token still valid. No refresh needed.");
    }
  };

  useEffect(() => {
    const isPublicRoute = location.pathname === "/login" || location.pathname === "/signup"  || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      await refreshAccessTokenIfNeeded();
      setLoading(false);
    };

    initializeAuth();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, setToken, logout }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

