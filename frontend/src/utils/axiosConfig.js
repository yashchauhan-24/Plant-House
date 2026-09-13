import axios from "axios";

const INVALID_TOKENS = new Set(["admin-session", "user-session", "null", "undefined"]);

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

const getAuthRoleFromPath = () => {
	if (typeof window === "undefined") return "user";
	return window.location.pathname.startsWith("/admin") ? "admin" : "user";
};

axios.interceptors.request.use(
	(config) => {
		const explicitRole = config?.headers?.["x-auth-role"];
		const role = explicitRole || getAuthRoleFromPath();
		const tokenKey = role === "admin" ? "adminToken" : "userToken";
		const rawToken = localStorage.getItem(tokenKey);
		const token = rawToken?.trim();
		const hasValidToken = token && !INVALID_TOKENS.has(token);

		if (hasValidToken) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
			config.headers["x-auth-role"] = role;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

export default axios;
