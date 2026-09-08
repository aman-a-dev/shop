"use client";

import { useState, useEffect } from "react";
import { getAllProductsAdmin } from "@/actions/products";
import { getUsers } from "@/actions/admin";
import { getAllCarts } from "@/actions/cart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    carts: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersResult, productsResult, cartsResult] = await Promise.all([
          getUsers(),
          getAllProductsAdmin(),
          getAllCarts(),
        ]);

        let totalRevenue = 0;
        if (cartsResult.success) {
          cartsResult.data.forEach((cart) => {
            cart.items.forEach((item) => {
              totalRevenue += Number(item.product.price) * item.quantity;
            });
          });
        }

        setStats({
          users: usersResult.success ? usersResult.data.length : 0,
          products: productsResult.success ? productsResult.data.length : 0,
          carts: cartsResult.success ? cartsResult.data.length : 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        Dashboard Overview
      </h1>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats.users.toLocaleString()} />
          <StatCard
            title="Total Products"
            value={stats.products.toLocaleString()}
          />
          <StatCard title="Total Carts" value={stats.carts.toLocaleString()} />
          <StatCard
            title="Total Revenue"
            value={`ETB ${stats.revenue.toFixed(2)}`}
          />
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
