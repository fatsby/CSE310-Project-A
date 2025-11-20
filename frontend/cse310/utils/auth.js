export const saveToken = (data, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    const now = new Date().getTime();

    const expirationTime = now + data.expiresIn * 1000 - 60000;

    storage.setItem("accessToken", data.accessToken);
    storage.setItem("tokenExpiry", expirationTime.toString());
};

export const getToken = () => {
    return (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
    );
};

export const checkAuth = () => {
    const accessToken = getToken();
    const userInStorage = getUser();

    if (!accessToken || !userInStorage) return false;

    const expiryLocal = localStorage.getItem("tokenExpiry");
    const expirySession = sessionStorage.getItem("tokenExpiry");
    const expiryTime = expiryLocal || expirySession;

    if (!expiryTime) return false;

    const now = new Date().getTime();

    if (now > parseInt(expiryTime)) {
        removeToken();
        return false;
    }

    return true;
};

export const removeToken = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("tokenExpiry");
};

//TRI ADDED THIS
export const saveUser = (user, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("currentUser", JSON.stringify(user));
};

export const getUser = () => {
    const userStr = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
};

export const isUserAdmin = () => {
    const user = getUser();
    if (!user) return false;
    // matches the C# DTO
    return user.isAdmin === true; 
};
