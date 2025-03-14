
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { User, Package, CreditCard, Heart, LogOut } from 'lucide-react';

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2023'
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-4">
              <div className="bg-background border border-border rounded-lg p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                  <User size={32} className="text-primary" />
                </div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since {user.joinDate}</p>
              </div>
              
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="flex flex-col">
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6">
                    <User size={16} className="mr-3" /> My Account
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6">
                    <Package size={16} className="mr-3" /> My Orders
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6">
                    <CreditCard size={16} className="mr-3" /> Payment Methods
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6">
                    <Heart size={16} className="mr-3" /> Wishlist
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 pl-6 text-destructive">
                    <LogOut size={16} className="mr-3" /> Logout
                  </Button>
                </div>
              </div>
            </aside>
            
            {/* Main Content */}
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
                          <label className="text-sm font-medium">First Name</label>
                          <input 
                            type="text" 
                            value="John" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Last Name</label>
                          <input 
                            type="text" 
                            value="Doe" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input 
                            type="email" 
                            value="john.doe@example.com" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <input 
                            type="tel" 
                            value="+1 555 987 6543" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Password</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="text-sm font-medium">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                        <div></div>
                        <div>
                          <label className="text-sm font-medium">New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full mt-1 rounded-md border border-input px-3 py-2"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Update Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center py-8 text-muted-foreground">You haven't placed any orders yet.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="addresses">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Saved Addresses</h3>
                        <Button variant="outline" size="sm">Add New Address</Button>
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
