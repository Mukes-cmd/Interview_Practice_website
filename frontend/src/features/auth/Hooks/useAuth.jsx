import { useContext} from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout} from "../Services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setuser, loading, setloading } = context;

    const handlerlogin = async ({ email, password }) => {
        setloading(true);
        try {
            const data = await login({ email, password });
            
            setuser(data.user);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setloading(false);
        }
    };

    const handleregister = async ({ username, email, password }) => {
        setloading(true);
        try {
            const data = await register({ username, email, password });
            setuser(data.user);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setloading(false);
        }
    };

    const handlelogout = async () => {
        setloading(true);
        try {
            await logout();
            setuser(null);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setloading(false);
        }
    };




    return {
        user,
        setuser,
        loading,
        handlerlogin,
        handlelogout,
        handleregister
    };
};
