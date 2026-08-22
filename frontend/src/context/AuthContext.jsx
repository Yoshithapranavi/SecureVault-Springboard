import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getCurrentUser } from "../services/authService";
import { logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(() =>
        localStorage.getItem("securevault_token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(
        Boolean(token)
    );


    // =========================================================
    // LOAD CURRENT USER
    // =========================================================

    useEffect(() => {

        const loadUser = async () => {

            if (!token) {

                setUser(null);
                setLoading(false);

                return;
            }

            try {

                const response =
                    await getCurrentUser();

                if (response?.success) {

                    setUser(response.data);

                } else {

                    throw new Error(
                        response?.message ||
                        "Unable to retrieve current user."
                    );
                }

            } catch (error) {

                console.error(
                    "Current user loading failed:",
                    error
                );

                localStorage.removeItem(
                    "securevault_token"
                );

                localStorage.removeItem(
                    "securevault_user"
                );

                localStorage.removeItem("user");

                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, [token]);


    // =========================================================
    // LOGIN
    // =========================================================

    const login = (jwtToken) => {

        localStorage.setItem(
            "securevault_token",
            jwtToken
        );

        setToken(jwtToken);
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = async () => {

        try {

            await logoutUser();

        } catch (error) {

            console.error(
                "Logout request failed:",
                error
            );

        } finally {

            localStorage.removeItem(
                "securevault_token"
            );

            localStorage.removeItem(
                "securevault_user"
            );

            localStorage.removeItem("user");

            setToken(null);
            setUser(null);
        }
    };


    // =========================================================
    // VALUES
    // =========================================================

    const isAuthenticated =
        Boolean(token);

    const isAdmin =
        user?.role === "ADMIN";


    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                isAdmin,
                loading,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);
}