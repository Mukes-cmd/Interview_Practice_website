import { createContext, useState, useEffect } from "react";
import { getme } from "./Services/auth.api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const getansSetuser = async () => {
            try {
                const data = await getme();
                setuser(data?.user ?? null);
            } catch (error) {
                console.log(error.response?.data || error.message);
                setuser(null);
            } finally {
                setloading(false);
            }
        };
        getansSetuser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    );
};
