
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold">About LUXE</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to provide high-quality, premium products with exceptional service and a seamless shopping experience.
            </p>
          </div>
          
          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2023, LUXE began with a simple idea: create a curated shopping destination for those who appreciate quality, design, and functionality.
              </p>
              <p className="text-muted-foreground mb-4">
                What started as a small online store has grown into a comprehensive marketplace offering carefully selected products across multiple categories. We partner with established brands and emerging designers who share our commitment to excellence.
              </p>
              <p className="text-muted-foreground">
                Our team is dedicated to providing an exceptional shopping experience from browsing to delivery, ensuring that every LUXE customer finds exactly what they're looking for.
              </p>
            </div>
            <div className="bg-secondary rounded-lg aspect-video"></div>
          </div>
          
          {/* Our Values */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                <p className="text-muted-foreground">We never compromise on quality. Each product in our catalog meets rigorous standards for materials, craftsmanship, and durability.</p>
              </div>
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
                <p className="text-muted-foreground">Your satisfaction is our priority. We're committed to responsive service, transparent policies, and putting customers first.</p>
              </div>
              <div className="bg-background border border-border p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-muted-foreground">We're committed to reducing our environmental impact through sustainable practices and partnerships with eco-conscious brands.</p>
              </div>
            </div>
          </div>
          
          {/* Contact Us CTA */}
          <div className="text-center bg-secondary/50 rounded-2xl p-12 mb-20">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have questions, feedback, or just want to say hello? We'd love to hear from you. Our team is ready to assist with any inquiries.
            </p>
            <Button size="lg">Contact Us</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
