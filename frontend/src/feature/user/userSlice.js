import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig.js";
import { clearCart } from "../cart/cartSlice.js";
import { clearWishlist } from "../wishlist/wishlistSlice.js";

const AUTH_ROLE_KEY = "authRole";
const ADMIN_TOKEN_KEY = "adminToken";
const USER_TOKEN_KEY = "userToken";
const ADMIN_USER_KEY = "adminUser";
const USER_DATA_KEY = "userData";
const PLACEHOLDER_TOKENS = new Set(["admin-session", "user-session", "null", "undefined"]);

const getRoleFromPath = () =>
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
        ? "admin"
        : "user";

const getTokenKey = (role) => (role === "admin" ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY);
const getUserKey = (role) => (role === "admin" ? ADMIN_USER_KEY : USER_DATA_KEY);

const clearLegacyKeys = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("isAuthenticated");
};

const clearRoleSession = (role) => {
    localStorage.removeItem(getTokenKey(role));
    localStorage.removeItem(getUserKey(role));
    if (localStorage.getItem(AUTH_ROLE_KEY) === role) {
        localStorage.removeItem(AUTH_ROLE_KEY);
    }
    clearLegacyKeys();
};

export const clearClientSession = (dispatch) => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userData");
    localStorage.removeItem("authRole");
    localStorage.removeItem("User");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("cartItem");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("shippingInfo");
    sessionStorage.clear();
    delete axios.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.authorization;
    dispatch?.(clearCart());
    dispatch?.(clearWishlist());
};

const saveRoleSession = (role, user, token = "") => {
    if (!user) return;

    localStorage.setItem(AUTH_ROLE_KEY, role);

    const tokenKey = getTokenKey(role);
    const hasValidToken =
        typeof token === "string" && token.trim() && !PLACEHOLDER_TOKENS.has(token.trim());

    if (role === "admin") {
        if (hasValidToken) {
            localStorage.setItem(tokenKey, token.trim());
        }
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user || null));
    } else {
        if (hasValidToken) {
            localStorage.setItem(tokenKey, token.trim());
        }
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user || null));
    }

    // Backward-compatible keys used by existing UI.
    localStorage.setItem("User", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");
};

const getStoredRoleSession = (role) => {
    const token = localStorage.getItem(getTokenKey(role));
    const user = JSON.parse(localStorage.getItem(getUserKey(role)) || "null");
    return token && user ? { role, token, user } : null;
};

const getPersistedSession = () => {
    const initialRole = getRoleFromPath();
    const session = getStoredRoleSession(initialRole);

    if (!session) {
        return { role: null, isAuthenticated: false, user: null };
    }

    return { role: session.role, isAuthenticated: true, user: session.user };
};

const persistedSession = getPersistedSession();

// registration api
export const register = createAsyncThunk("user/register", async (userData, {rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'Content-Type' : 'application/json'
            }
        } 
        const {data}   = await axios.post('/api/v1/register', userData, config)
        console.log('registration data', data);
        
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration Failled");
    }
});
// Login Api
export const login = createAsyncThunk("user/login", async ({email, password, loginType = "user"}, {rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'content-type' : 'application/json'
            }
        } 
        const {data}   = await axios.post('/api/v1/login', {email,password}, config)

        const role = data?.user?.role === "admin" ? "admin" : "user";
        if (loginType === "admin" && role !== "admin") {
            return rejectWithValue({ message: "This portal is only for admin." });
        }
        if (loginType === "user" && role === "admin") {
            return rejectWithValue({ message: "Admin account is not allowed on user login." });
        }

        clearRoleSession(role);
        saveRoleSession(role, data?.user || null, data?.token || "");

        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Login  Failled");
    }
});

// LaodUser Api
export const loadUser = createAsyncThunk("user/loadUser", async ({ expectedRole } = {}, {rejectWithValue}) => {
    try {
        const role = expectedRole || getRoleFromPath();
        const token = localStorage.getItem(getTokenKey(role));
        if (!token || PLACEHOLDER_TOKENS.has(token.trim())) {
            clearRoleSession(role);
            return { user: null, _sessionRole: null };
        }

        const {data} = await axios.get('/api/v1/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-auth-role': role,
            },
        });

        const actualRole = data?.user?.role === "admin" ? "admin" : "user";
        if (actualRole !== role) {
            clearRoleSession(role);
            return rejectWithValue({ message: "Session role mismatch", statusCode: 401, roleMismatch: true });
        }

        saveRoleSession(actualRole, data?.user || null, token);
        return { ...data, _sessionRole: actualRole }
    } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
            clearRoleSession(expectedRole || getRoleFromPath());
        }
        return rejectWithValue(error.response?.data || "Failed to load user");
    }
});
// update profile
export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, {rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'Content-Type' : 'multipart/form-data'
            }
        } 
        const {data}   = await axios.put('/api/v1/profile/update', userData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Profile updat fail");
    }
});
// update Password
export const updatePassword = createAsyncThunk("user/updatePassword", async (formData, {rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'Content-Type' : 'application/json'
            }
        } 
        const {data}   = await axios.put('/api/v1/password/update', formData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Password update fail");
    }
});
// Forgot Password
export const forgotPassword = createAsyncThunk("user/forgotPassword", async (email, {rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'Content-Type' : 'application/json'
            }
        } 
        const {data}   = await axios.post('/api/v1/forgot/password', email, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Email send Failed");
    }
});
// Reset Password
export const resetPassword = createAsyncThunk("user/resetPassword", async ({token,uderData} ,{rejectWithValue}) => {
    try {
        const config = {
            headers :{
                'Content-Type' : 'application/json'
            }
        } 
        const {data}   = await axios.put(`/api/v1/reset/${token}`, uderData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Email send Failed");
    }
});
// Logout Api
export const logout = createAsyncThunk("user/logout", async (_, { dispatch }) => {
    const role = getRoleFromPath();
    const token = localStorage.getItem(getTokenKey(role));
    try {
        await axios.post('/api/v1/logout', {}, {
            withCredentials: true,
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  'x-auth-role': role,
                }
              : {},
        });

        return { success: true, role };
    } catch (error) {
        return { success: false, role, error: error.response?.data || "Logout Failed" };
    } finally {
        clearClientSession(dispatch);
    }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
        user: persistedSession.user,
        isAuthenticated: persistedSession.isAuthenticated,
        authRole: persistedSession.role,
    success: false,
    message : null
  },
    reducers: {
        removeError: (state) => {
        state.error = null;
        },
        removeSuccess: (state) => {
        state.success = false;
        },
    },
  extraReducers:(builder)=>{
    // Registration Process
    builder
    .addCase(register.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(register.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.user=action.payload?.user || null;
        state.success= true,
        state.isAuthenticated=Boolean(action.payload?.user)
        state.authRole = action.payload?.user?.role === "admin" ? "admin" : "user";
        saveRoleSession(state.authRole, state.user, action.payload?.token)
    })
    .addCase(register.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Registration failed Plz Try again later'
        state.user = null,
        state.isAuthenticated=false,
        state.authRole = null
        
    })
    // Login process
    builder
    .addCase(login.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(login.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.user=action.payload?.user || null;
        state.success= true,
        state.isAuthenticated=Boolean(action.payload?.user)
        state.authRole = action.payload?.user?.role === "admin" ? "admin" : "user";
    })
    .addCase(login.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Login failed. Plz Try again later'
    })
    // Loed User
    builder
    .addCase(loadUser.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(loadUser.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.user=action.payload?.user || null;
        state.isAuthenticated=Boolean(action.payload?.user)
        state.authRole = action.payload?._sessionRole || (action.payload?.user?.role === "admin" ? "admin" : "user");
        
    })
    .addCase(loadUser.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Failed to load User'
        state.user = null,
        state.isAuthenticated=false,
        state.authRole = null;
    })
    // Logout
    builder
    .addCase(logout.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(logout.fulfilled,(state)=>{
        state.loading=false,
        state.error= null;
                state.user=null;
                state.isAuthenticated=false;
                state.authRole = null;
        
    })
    .addCase(logout.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Logout Failed';
        state.user=null;
        state.isAuthenticated=false;
        state.authRole = null;
    });
    // update profile
    builder
    .addCase(updateProfile.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(updateProfile.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.user=action.payload.user || null;
        state.success = action.payload?.success
        state.message = action.payload.message
    })
    .addCase(updateProfile.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Profile update Failed'
    });
    // update password
    builder
    .addCase(updatePassword.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(updatePassword.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.success = action.payload?.success
    })
    .addCase(updatePassword.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Password update fail'
    });
    // Forgot password
    builder
    .addCase(forgotPassword.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(forgotPassword.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.success = action.payload?.success
        state.message = action.payload?.message
    })
    .addCase(forgotPassword.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Email send Failed'
    });
    // reset password
    builder
    .addCase(resetPassword.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(resetPassword.fulfilled,(state,action)=>{
        state.loading=false,
        state.error= null;
        state.success = action.payload?.success
        state.user=null
        state.isAuthenticated = false
    })
    .addCase(resetPassword.rejected,(state,action)=>{
        state.loading=false,
        state.error=action.payload?.message || 'Email send Failed'
    });
  }
});

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
