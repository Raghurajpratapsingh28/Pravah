import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import AdminProductList from '@/components/admin/ProductList';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    console.log('Initial check - Token:', token?.substring(0, 10) + '...', 'Stored User:', storedUser);

    if (!token || !storedUser) {
      console.log('No token or user found, redirecting to login');
      navigate('/admin/login');
      toast.error('Please log in as an admin');
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log('Fetching profile with token:', token.substring(0, 10) + '...');
        const response = await fetch('http://localhost:3000/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Profile response status:', response.status);
        const responseText = await response.text();
        console.log('Profile response body:', responseText);

        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch {
            errorData = { error: 'Unknown error from server' };
          }
          throw new Error(errorData.error || `Failed to verify admin (Status: ${response.status})`);
        }

        const userData = JSON.parse(responseText);
        console.log('Profile data:', userData);

        if (!userData.role || userData.role !== 'admin') {
          console.log('Role check failed:', { role: userData.role });
          throw new Error('You are not authorized as an admin');
        }

        setUser(userData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        toast.error(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/admin/login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Logged in as {user?.email} (Admin)</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-grow mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminProductList />
      </main>
      <Footer />
    </div>
  );
}