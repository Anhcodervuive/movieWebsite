import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.auth.currentUser);

    const isPermitTo = useCallback(
        (actions) => {
            if (user) {
            }
        },
        [user]
    );

    const isRoleIs = useCallback(
        (roles) => {
            if (user) {
                return user.role
                    .map((role) => role.name)
                    .some((role) => roles.includes(role));
            } else {
                return false;
            }
        },
        [user]
    );

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
            if (user.role.map((role) => role.name).includes('Admin')) {
                setIsAdmin(true);
            }
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, [user]);

    return { isAuthenticated, isAdmin, isLoading, isRoleIs, isPermitTo };
}

export default useAuth;
