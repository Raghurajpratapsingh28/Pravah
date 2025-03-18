import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User, Package, CreditCard, Heart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user || typeof token !== 'string') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      toast({ title: 'Error', description: 'Please log in again', variant: 'destructive' });
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log('Token being sent:', token); // Debug
        const response = await fetch('http://localhost:3000/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Response status:', response.status); // Debug
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error data:', errorData); // Debug
          if (response.status === 401) {
            throw new Error('Session expired or invalid token');
          }
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Fetch profile error:', err); // Debug
        setError(err.message);
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
        if (err.message.includes('expired') || err.message.includes('invalid token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({ title: 'Success', description: 'Logged out successfully' });
    navigate('/');
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500 mb-4">{error}</p><Button onClick={() => navigate('/login')}>Go to Login</Button></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 space-y-4">
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                  <User size={32} className="text-primary" />
                </div>
                <h2 className="font-semibold text-lg">{profileData.name}</h2>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {new Date(profileData.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="flex flex-col">
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6"><User size={16} className="mr-3" /> My Account</Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6"><Package size={16} className="mr-3" /> My Orders</Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6"><CreditCard size={16} className="mr-3" /> Payment Methods</Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6"><Heart size={16} className="mr-3" /> Wishlist</Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6 text-destructive" onClick={handleLogout}><LogOut size={16} className="mr-3" /> Logout</Button>
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <Tabs defaultValue="account">
                <TabsList className="mb-6">
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <input type="text" value={profileData.name} className="w-full mt-1 rounded-md border border-input px-3 py-2 bg-gray-100" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input type="email" value={profileData.email} className="w-full mt-1 rounded-md border border-input px-3 py-2 bg-gray-100" readOnly />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button disabled>Update Profile (Coming Soon)</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="orders">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center py-8 text-muted-foreground">Order history coming soon.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="addresses">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Saved Addresses</h3>
                        <Button variant="outline" size="sm" disabled>Add New Address (Coming Soon)</Button>
                      </div>
                      <p className="text-center py-8 text-muted-foreground">You don't have any saved addresses yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}