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

    if (!accessToken) return false;

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
