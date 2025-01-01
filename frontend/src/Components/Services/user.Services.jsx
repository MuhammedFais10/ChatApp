import api from "../../axiosConfig";










export const login = async (email, password) => {
  try {
    const { data } = await api.post("users/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data)); // Save user data
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // Set token for future requests
    return data;
  } catch (error) {
    throw error.response?.data || new Error("Login failed");
  }
};


// Register function
export const register = async (registerData) => {
  try {
    const { data } = await api.post("users/register", registerData); // ✅ Use `api.post`
    localStorage.setItem("user", JSON.stringify(data));
    console.log("Registration Success:", data);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // Set token for future requests
    return data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Registration failed");
  }
};

// Fetch all users
export const fetchAllUsers = async (search = "") => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) throw new Error("Unauthorized: No token found"); 

    const { data } = await api.get(`users/fetchAllUsers?search=${search}`, {
      headers: {
        Authorization: `Bearer ${user.token}`, 
      },
    });

    console.log("Fetched Users from API:", data); // ✅ Debugging log
    return data;
  } catch (error) {
    console.error("Fetch Users Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Failed to fetch users");
  }
};