import config from '@/config';
import { useAuth } from '@/hooks';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({
    children,
    requireAuth,
    requiredRoles = [],
    requiredPermissions = [],
    ...rest
}) => {
    const { isAuthenticated, isLoading, isPermitTo, isRoleIs } = useAuth();

    if (!isLoading && requireAuth && !isAuthenticated) {
        return <Navigate to={config.routes.login} replace />;
    }
    if (!isLoading && requiredRoles.length > 0 && !isRoleIs(requiredRoles)) {
        return <Navigate to={config.routes.error.forbidden} replace />;
    }
    if (
        !isLoading &&
        requiredPermissions.length > 0 &&
        isPermitTo(requiredPermissions)
    ) {
        return <Navigate to={config.routes.error.forbidden} replace />;
    }
    return children;
};

export default PrivateRoute;
