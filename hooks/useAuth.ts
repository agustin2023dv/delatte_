import { useEffect, useState } from 'react';
import { getItem, setItem, removeItem } from '../storage/storage';

export function useAuth() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await getItem('userRole');
        setUserRole(role || null);
      } catch (error) {
        console.error('Error retrieving userRole:', error);
      }
    };

    fetchUserRole();
  }, []);

  const logout = async () => {
    await removeItem('userRole');
    await removeItem('token');
    await removeItem('userEmail');
    setUserRole(null);
  };

  return { userRole, logout };
}
