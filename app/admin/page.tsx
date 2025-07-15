"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Mail, Download, Search, Calendar, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface WaitlistEntry {
  id: number;
  email: string;
  createdAt: string;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function AdminDashboard() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (getCookie("admin_auth") === "1") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchEntries();
  }, [isAuthenticated]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/admin/waitlist");
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch("/api/admin/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    // Call API route to check admin email
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      document.cookie = "admin_auth=1; path=/; max-age=86400";
      setIsAuthenticated(true);
    } else {
      setLoginError("Unauthorized");
    }
  };

  // Add this function for logout
  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center px-2 sm:px-0">
        <form onSubmit={handleLogin} className="bg-black/80 p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-neutral-800 backdrop-blur-md">
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Admin Login</h2>
          <Input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-neutral-900 border-neutral-700 text-white py-3 px-4 rounded-lg text-lg focus:ring-2 focus:ring-teal-500"
          />
          {loginError && <div className="text-red-400 text-base font-medium">{loginError}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200">Login</Button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 p-2 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-end mb-6">
          <Button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md">Logout</Button>
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 bg-black/60 rounded-2xl p-4 sm:p-8 shadow-xl border border-neutral-800 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            <Button
              asChild
              variant="ghost"
              className="text-neutral-400 hover:text-white text-base px-4 py-2"
            >
              <a href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </a>
            </Button>
            <div className="text-center sm:text-left w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Admin Dashboard</h1>
              <p className="text-neutral-400 text-base sm:text-lg font-medium">Manage your waitlist</p>
            </div>
          </div>
          <Button
            onClick={exportData}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md text-lg w-full sm:w-auto mt-4 sm:mt-0"
          >
            <Download className="h-5 w-5 mr-3" />
            Export CSV
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          <Card className="bg-black/70 backdrop-blur-lg border-2 border-neutral-800 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-neutral-400">Total Signups</CardTitle>
              <Users className="h-6 w-6 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white mb-1">{totalCount}</div>
              <p className="text-sm text-neutral-500 font-medium">
                +{entries.filter(e => new Date(e.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/70 backdrop-blur-lg border-2 border-neutral-800 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-neutral-400">This Week</CardTitle>
              <Calendar className="h-6 w-6 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white mb-1">
                {entries.filter(e => new Date(e.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-sm text-neutral-500 font-medium">New signups this week</p>
            </CardContent>
          </Card>

          <Card className="bg-black/70 backdrop-blur-lg border-2 border-neutral-800 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-neutral-400">Average Daily</CardTitle>
              <Mail className="h-6 w-6 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white mb-1">
                {Math.round(totalCount / Math.max(1, Math.ceil((Date.now() - new Date(entries[entries.length - 1]?.createdAt || Date.now()).getTime()) / (24 * 60 * 60 * 1000))))}
              </div>
              <p className="text-sm text-neutral-500 font-medium">Signups per day</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="bg-black/80 backdrop-blur-lg border-2 border-neutral-800 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white mb-2">Waitlist Entries</CardTitle>
              <CardDescription className="text-neutral-400 text-lg font-medium">
                All registered users in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-neutral-400" />
                  <Input
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-neutral-900/70 border-neutral-700 text-white placeholder:text-neutral-500 py-3 rounded-lg text-lg"
                  />
                </div>
              </div>
              <div className="rounded-xl border-2 border-neutral-800 overflow-x-auto shadow-lg">
                <Table className="min-w-[500px]">
                  <TableHeader>
                    <TableRow className="border-neutral-800">
                      <TableHead className="text-neutral-400 text-lg">ID</TableHead>
                      <TableHead className="text-neutral-400 text-lg">Email</TableHead>
                      <TableHead className="text-neutral-400 text-lg">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id} className="border-neutral-800 hover:bg-neutral-800/40 transition-colors">
                        <TableCell className="font-semibold text-white text-lg">
                          <Badge variant="outline" className="border-teal-500 text-teal-400 px-3 py-1 text-base rounded-full">
                            #{entry.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-neutral-300 text-lg">{entry.email}</TableCell>
                        <TableCell className="text-neutral-400 text-lg">
                          {formatDate(entry.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredEntries.length === 0 && (
                <div className="text-center py-12 text-neutral-400 text-lg font-medium">
                  {searchTerm ? "No entries match your search." : "No entries yet."}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}