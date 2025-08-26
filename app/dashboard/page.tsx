"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import Button from "@components/ui/button";
import {
  People,
  ShoppingCart,
  DollarCircle,
  TrendUp,
  Notification,
  SearchNormal,
  Menu,
  Activity,
  Chart,
  User,
} from "iconsax-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 4000, profit: 2400 },
  { month: "Feb", revenue: 3000, profit: 1398 },
  { month: "Mar", revenue: 2000, profit: 9800 },
  { month: "Apr", revenue: 2780, profit: 3908 },
  { month: "May", revenue: 1890, profit: 4800 },
  { month: "Jun", revenue: 2390, profit: 3800 },
  { month: "Jul", revenue: 3490, profit: 4300 },
];

const userData = [
  { name: "Jan", new: 120, returning: 80 },
  { name: "Feb", new: 300, returning: 150 },
  { name: "Mar", new: 250, returning: 200 },
  { name: "Apr", new: 400, returning: 300 },
  { name: "May", new: 350, returning: 250 },
  { name: "Jun", new: 500, returning: 400 },
  { name: "Jul", new: 450, returning: 350 },
];

const productData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const recentOrders = [
  {
    id: "#12345",
    customer: "John Doe",
    product: "Product A",
    amount: "$250.00",
    status: "Completed",
  },
  {
    id: "#12346",
    customer: "Sarah Smith",
    product: "Product B",
    amount: "$150.00",
    status: "Processing",
  },
  {
    id: "#12347",
    customer: "Mike Johnson",
    product: "Product C",
    amount: "$320.00",
    status: "Shipped",
  },
  {
    id: "#12348",
    customer: "Emma Wilson",
    product: "Product A",
    amount: "$89.99",
    status: "Completed",
  },
  {
    id: "#12349",
    customer: "David Brown",
    product: "Product D",
    amount: "$450.00",
    status: "Pending",
  },
];

const topProducts = [
  { name: "Product A", sales: 124, revenue: "$1,240" },
  { name: "Product B", sales: 98, revenue: "$980" },
  { name: "Product C", sales: 87, revenue: "$870" },
  { name: "Product D", sales: 65, revenue: "$650" },
  { name: "Product E", sales: 43, revenue: "$430" },
];

export default function DataDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">DataDash</span>
          </div>
          <Button
            variant="text_blue"
            size="small"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar">
            <Menu size="20" />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 text-blue-600">
                <Chart size="20" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <People size="20" />
                <span>Customers</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <ShoppingCart size="20" />
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <Chart size="20" />
                <span>Products</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <Activity size="20" />
                <span>Analytics</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="text_blue"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
                aria-label="Open sidebar">
                <Menu size="20" />
              </Button>
              <div className="relative">
                <SearchNormal
                  size="16"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search data..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="text_blue"
                className="relative"
                aria-label="Notifications">
                <Notification size="20" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 grid place-items-center">
                  <User size="18" />
                </div>
                <span className="hidden md:inline">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Data Dashboard</h1>
            <p className="text-gray-600">
              Comprehensive overview of your business data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader title="Total Revenue" />
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="New Customers" />
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-gray-500">+180.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Total Orders" />
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-gray-500">+19% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Conversion Rate" />
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-gray-500">+2.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader
                title="Revenue Overview"
                subheader="Monthly revenue and profit trends"
              />
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader
                title="User Growth"
                subheader="New vs returning users"
              />
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" fill="#3b82f6" />
                    <Bar dataKey="returning" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader
                title="Recent Orders"
                subheader="Latest customer transactions"
              />
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <span
                          className={`${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          } text-xs px-2 py-1 rounded-full`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Top Products"
                subheader="Best performing products"
              />
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">{product.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader
                title="Product Distribution"
                subheader="Sales by product category"
              />
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={productData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}>
                      {productData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </RPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader
                title="Performance Metrics"
                subheader="Key business indicators"
              />
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Session</p>
                    <p className="text-xl font-bold">4m 32s</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Bounce Rate</p>
                    <p className="text-xl font-bold">24.3%</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-xl font-bold">12,450</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Conversion</p>
                    <p className="text-xl font-bold">3.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
