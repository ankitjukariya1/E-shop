// API Base URL
const API_URL = "http://localhost:3000/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Set auth data
const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear auth data
const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is logged in
const isLoggedIn = () => {
  return !!getToken();
};

// Check if user is admin
const isAdmin = () => {
  const user = getUser();
  return user && user.role === "admin";
};

// Check if user is seller
const isSeller = () => {
  const user = getUser();
  return user && user.role === "seller";
};

// Update navigation based on auth status
const updateNav = () => {
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = document.getElementById("userName");
  const ordersLink = document.getElementById("ordersLink");
  const adminLink = document.getElementById("adminLink");

  const sellerLink = document.getElementById("sellerLink");

  if (isLoggedIn()) {
    const user = getUser();
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (userName) {
      userName.textContent = user.name;
      userName.style.display = "block";
    }
    if (ordersLink) ordersLink.style.display = "block";

    if (isAdmin() && adminLink) {
      adminLink.style.display = "block";
    }

    if (isSeller() && sellerLink) {
      sellerLink.style.display = "block";
    }
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userName) userName.style.display = "none";
    if (ordersLink) ordersLink.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
    if (sellerLink) sellerLink.style.display = "none";
  }
};

// Logout function
const logout = () => {
  clearAuthData();
  window.location.href = "/login.html";
};

// Setup logout button
document.addEventListener("DOMContentLoaded", () => {
  updateNav();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
