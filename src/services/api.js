// api.js

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Creates a new user and handles the authentication token
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} The response data including success status and user info
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        password: userData.password,
        profile_path: userData.profile_path || "",
        status: userData.status || "active",
      }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (response.status === 201) {
      sessionStorage.setItem("userAccessToken", data.data.access_token);
      sessionStorage.setItem("tokenType", data.data.token_type);
      sessionStorage.setItem("userEmail", data.data.email_id);

      const userInfo = {
        email: data.data.email_id,
        name: userData.name,
        isActive: data.data.isActive,
      };
      sessionStorage.setItem("userData", JSON.stringify(userInfo));

      return data;
    }

    if (response.status === 422) {
      console.error("Validation Error:", data.detail); // Log the error details
      throw new Error("Validation failed. Check the input fields.");
    }

    // Throw an error for other non-successful status codes (e.g., 400, 500, etc.)
    throw new Error(data.message || "Registration failed");
  } catch (error) {
    console.error("Registration error:", error);

    if (!error.response) {
      throw new Error("Network error. Please check your connection.");
    }

    // Otherwise, throw the original error
    throw error;
  }
};

/**
 * Authenticates a user and handles the authentication token
 * @param {Object} credentials - The login credentials (email and password)
 * @returns {Promise<Object>}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();
    console.log("Login API Response:", data);

    if (response.status === 200 && data.success) {
      // Store auth tokens
      sessionStorage.setItem("userAccessToken", data.data.access_token);
      sessionStorage.setItem("tokenType", data.data.token_type);
      sessionStorage.setItem("userEmail", data.data.email_id);

      // Immediately fetch user info after successful login
      try {
        const userInfoResponse = await fetchUserInfo();
        if (userInfoResponse.success) {
          // Store the complete user data, correctly extracting from nested structure
          const userDataToStore = {
            id: userInfoResponse.data.id,
            email: userInfoResponse.data.email,
            name: userInfoResponse.data.name,
            phone_number: userInfoResponse.data.phone_number,
            profile_path: userInfoResponse.data.profile_path,
            role: userInfoResponse.data.role || "user",
            status: userInfoResponse.data.status || "active",
            isActive: userInfoResponse.isActive,
          };
          sessionStorage.setItem("userData", JSON.stringify(userDataToStore));
        }
      } catch (userInfoError) {
        console.error("Error fetching user info after login:", userInfoError);
      }

      return data;
    }

    throw new Error(data.message || "Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Gets the full authorization header value
 * @returns {string}
 */
export const getAuthorizationHeader = () => {
  const token = sessionStorage.getItem("userAccessToken");
  return token ? `Bearer ${token}` : "";
};

/**
 * Checks if the user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!sessionStorage.getItem("userAccessToken");
};

/**
 * Gets the stored user data
 * @returns {Object|null} The user data if available, or null
 */
export const getUserData = () => {
  try {
    const userData = sessionStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from sessionStorage:", error);
    return null;
  }
};

/**
 * Gets the stored access token
 * @returns {string|null} The access token if available, or null
 */
export const getAccessToken = () => {
  return sessionStorage.getItem("userAccessToken");
};

export const logout = () => {
  sessionStorage.removeItem("userAccessToken");
  sessionStorage.removeItem("tokenType");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userData");
};

export const fetchUserInfo = async () => {
  try {
    const token = sessionStorage.getItem("userAccessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/users/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("User Info Response:", data);

    if (response.status === 200 && data.success) {
      // Store the complete user data
      const userDataToStore = {
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        phone_number: data.data.phone_number,
        profile_path: data.data.profile_path,
        role: data.data.role || "user",
        status: data.data.status || "active",
        isActive: data.isActive,
      };
      sessionStorage.setItem("userData", JSON.stringify(userDataToStore));
      return data;
    }

    throw new Error(data.message || "Failed to fetch user info");
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

/**
 * Updates user information including profile image
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const updateUserInfo = async (userData) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/users/update-user-info`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      // Get current user data
      const currentUserData = getUserData() || {};

      // Update with new data while preserving existing fields
      const userDataToStore = {
        ...currentUserData,
        ...data.data,
        isActive: data.isActive,
      };
      sessionStorage.setItem("userData", JSON.stringify(userDataToStore));
      return data;
    }

    throw new Error(data.message || "Failed to update user info");
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const updateProfilePath = async (profilePath) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/users/update-profile-path`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ profile_path: profilePath }),
    });

    const data = await response.json();

    if (response.status === 200) {
      const userData = getUserData();
      if (userData) {
        userData.profile_path = data.data.profile_path;
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }
      return data;
    }

    throw new Error(data.message || "Failed to update profile path");
  } catch (error) {
    console.error("Error updating profile path:", error);
    throw error;
  }
};

export const uploadResume = async (file) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const formData = new FormData();
    formData.append("file", file);

    const userData = getUserData();
    if (userData && userData.id) {
      formData.append("user_id", userData.id);
    }

    const response = await fetch(`${BASE_URL}/qna/upload-resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    }

    throw new Error(data.message || "Failed to upload resume");
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};
export const fetchUserQna = async () => {
  try {
    const token = sessionStorage.getItem("userAccessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/dashboard/get-user-qna`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("User question Response:", data);

    if (response.status === 200) {
      const userQna = {
        ...data.data,
        isActive: data.isActive,
      };
      sessionStorage.setItem("userData", JSON.stringify(userQna));
      return data;
    }

    throw new Error(data.message || "Failed to fetch user Qna");
  } catch (error) {
    console.error("Error fetching user QNA:", error);
    throw error;
  }
};
export const loadInitialUserData = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    // Try to get cached data first
    let userData = getUserData();

    // If no cached data or it's incomplete, fetch fresh data
    if (!userData || !userData.name) {
      const response = await fetchUserInfo();
      if (response.success) {
        userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          phone_number: response.data.phone_number,
          profile_path: response.data.profile_path,
          role: response.data.role || "user",
          status: response.data.status || "active",
          isActive: response.isActive,
        };
      }
    }

    return userData;
  } catch (error) {
    console.error("Error loading initial user data:", error);
    return null;
  }
};
