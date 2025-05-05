import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Renamed import for clarity
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from "@/lib/utils"; // Import cn utility
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

// Initialize the Inter font
const fontSans = FontSans({
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable // Apply the Inter font variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // Optional: Recommended by next-themes to avoid style flashing
        >
          {children}
          <Toaster /> {/* Add Toaster component */}
        </ThemeProvider>
      </body>
    </html>
  );
}
