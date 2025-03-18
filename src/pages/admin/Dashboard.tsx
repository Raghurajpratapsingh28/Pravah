import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// import AdminProductList from '@/components/admin/ProductList';
import toast from 'react-hot-toast';
import ProductForm from '@/components/admin/ProductForm';
import AdminProductList from '@/components/admin/ProductList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

      if (!token || !storedUser || storedUser.role !== 'admin') {
        toast.error('Please log in as an admin');
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText || '{"error": "Unknown server error"}');
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const userData = await response.json();
        if (userData.role !== 'admin') {
          throw new Error('You are not authorized as an admin');
        }

        setUser(userData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        localStorage.clear();
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Button onClick={() => navigate('/admin/login')} variant="default">
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user?.name || user?.email} (Admin)
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <AdminProductList />
        {/* <ProductForm/> */}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;