import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
    const { session, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // If logged in but not in whitelist
    if (!isAdmin) {
        // Need to access signOut here, but we can't destructure it above easily if we want to keep clean logic.
        // Ideally, the user should be able to Sign Out from this screen.
        // Let's just create a quick Sign Out button component or reload.
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">Your account ({session.user.email}) is not authorized to access the Admin Console.</p>
            </div>
        );
    }

    return <Outlet />;
};
