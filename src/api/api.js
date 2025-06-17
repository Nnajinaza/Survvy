// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api/v1", // update if needed
// });

// // Add access token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle 401 errors and refresh access token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loop
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         const userId = localStorage.getItem("userId");

//         if (!refreshToken) {
//           throw new Error("No refresh token found.");
//         }

//         const res = await axios.post("http://localhost:4000/api/v1/auth/refresh-token", {
//           refreshToken,
//           userId

//         });

//         const newAccessToken = res.data.accessToken;

//         localStorage.setItem("accessToken", newAccessToken);

//         // Update headers for retry
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed or expired.");
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api/v1", // update if needed
// });

// let isRefreshing = false; // Track if the token refresh is in progress
// let subscribers = []; // Collect requests waiting for the token refresh

// // Add access token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Function to notify all requests waiting for the token refresh
// function onAccessTokenFetched(newToken) {
//   subscribers.forEach((callback) => callback(newToken));
//   subscribers = []; // Clear the subscribers once they're notified
// }

// // Function to add a subscriber (i.e., requests that need to wait for the token refresh)
// function addSubscriber(callback) {
//   subscribers.push(callback);
// }

// // Handle 401 errors and refresh access token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loop
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         // If refresh is in progress, wait for it to finish and retry the request
//         return new Promise((resolve) => {
//           addSubscriber((newToken) => {
//             originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//             resolve(api(originalRequest)); // Retry the original request with the new token
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         const userId = localStorage.getItem("userId");

//         if (!refreshToken || !userId) {
//           throw new Error("No refresh token or user ID found.");
//         }

//         // Refresh the token using the API
//         const res = await axios.post("http://localhost:4000/api/v1/auth/refresh-token", {
//           refreshToken,
//           userId,
//         });

//         const newAccessToken = res.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);

//         // Notify all waiting requests that the new token is ready
//         onAccessTokenFetched(newAccessToken);

//         // Retry the original request with the new access token
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed or expired.");
//         localStorage.clear(); // Clear tokens if refresh fails
//         window.location.href = "/login"; // Redirect to login on error
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

// A queue to hold pending requests during token refresh
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add access token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// List of endpoints that do NOT require an Authorization header
const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/verify-otp",
];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url.includes(endpoint)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Handle 401 errors and refresh access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const userId = localStorage.getItem("userId");

        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://localhost:4000/api/v1/auth/refresh-token", {
          refreshToken,
          userId,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        onRefreshed(newAccessToken);

        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
