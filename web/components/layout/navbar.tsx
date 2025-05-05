"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    
    if (user.first_name) {
      return user.first_name[0].toUpperCase();
    }
    
    if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return "";
  };

  return (
    <header className="bg-slate-800 text-white py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Rahnuma
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/prd" className="text-slate-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/prd/create" className="text-slate-300 hover:text-white">
            Create PRD
          </Link>
          <Link href="#" className="text-slate-300 hover:text-white">
            Documentation
          </Link>
        </nav>
        
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm">
                <span className="text-slate-300">Hello, </span>
                <span className="font-medium">{user?.first_name || user?.username}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full text-white hover:bg-slate-700">
                    <Avatar>
                      <AvatarFallback className="bg-slate-700 text-white border border-slate-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/prd">
                    <DropdownMenuItem className="cursor-pointer">
                      My PRDs
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/prd/create">
                    <DropdownMenuItem className="cursor-pointer">
                      Create New PRD
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="text-white border-slate-600 hover:bg-slate-700">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}