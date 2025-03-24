import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/header'
}: ProtectedRouteProps) => {
  // Obter dados do usuário de forma segura
  const userData = sessionStorage.getItem('user');
  const token = sessionStorage.getItem('authToken');
  
  // Tratamento seguro do parse do usuário
  let user: { role?: string } = {};
  try {
    user = userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  // Verificação de autenticação
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Verificação de permissões
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderização condicional
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;