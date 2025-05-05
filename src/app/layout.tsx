import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use a standard Google Font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from "@/lib/utils"; // Import cn utility

// Initialize the Inter font
const inter = Inter({
  variable: '--font-sans', // Use a standard variable name like --font-sans
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TaskTango', // Updated App Name
  description: 'Your simple and stylish Todo App', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable // Apply the Inter font variable
      )}>
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
