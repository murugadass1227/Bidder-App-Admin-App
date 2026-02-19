'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Car, 
  Gavel, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Loader2
} from 'lucide-react';
import apiService from '@/services/api';

interface DashboardStats {
  totalLots: number;
  activeAuctions: number;
  totalBids: number;
  totalUsers: number;
  pendingApprovals: number;
  unsoldLots90Days: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'lot_created' | 'auction_started' | 'bid_placed' | 'user_registered';
  description: string;
  timestamp: Date;
  user: string;
  userId?: string;
  entityId?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersResponse = await apiService.getBidders({ limit: 1 });

      const mockStats: DashboardStats = {
        totalLots: 1234,
        activeAuctions: 23,
        totalBids: 45678,
        totalUsers: usersResponse.total,
        pendingApprovals: 5,
        unsoldLots90Days: 12,
        recentActivity: [
          {
            id: '1',
            type: 'lot_created',
            description: 'New lot "2023 Toyota Camry" created',
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            user: 'John Doe',
          },
          {
            id: '2',
            type: 'auction_started',
            description: 'Auction "Weekly Vehicle Auction" started',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            user: 'Jane Smith',
          },
          {
            id: '3',
            type: 'bid_placed',
            description: 'Bid of $15,000 placed on "2022 Honda Civic"',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            user: 'Mike Johnson',
          },
          {
            id: '4',
            type: 'user_registered',
            description: 'New user registered: sarah@example.com',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            user: 'System',
          },
        ],
      };

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatTimestamp = (date: Date) => {
    if (typeof window === 'undefined') {
      return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const statsData = [
    { title: 'Total Lots', value: stats?.totalLots?.toLocaleString() ?? '0', change: '+12.3%', icon: Car },
    { title: 'Active Auctions', value: stats?.activeAuctions?.toLocaleString() ?? '0', change: '+5.2%', icon: Gavel },
    { title: 'Total Bids', value: stats?.totalBids?.toLocaleString() ?? '0', change: '+18.7%', icon: TrendingUp },
    { title: 'Registered Users', value: stats?.totalUsers?.toLocaleString() ?? '0', change: '+9.1%', icon: Users },
  ];

  const alerts = [
    {
      id: 1,
      title: 'Unsold Lots Alert',
      description: `${stats?.unsoldLots90Days || 0} lots have been unsold for over 90 days`,
      action: 'Review Lots',
    },
    {
      id: 2,
      title: 'Pending Approvals',
      description: `${stats?.pendingApprovals || 0} reserve price approvals pending`,
      action: 'Review Approvals',
    },
    {
      id: 3,
      title: 'Suspicious Activity',
      description: 'Unusual bidding pattern detected on Auction #1234',
      action: 'Investigate',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600 font-medium">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-red-800 font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDashboardStats} className="mt-3">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          BIC Auction Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor auctions, lots, bids and user activity in real time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-xl bg-blue-50">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Activity */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {stats?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="mt-2 h-2 w-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)} • {activity.user}
                  </p>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alerts
            </CardTitle>
            <CardDescription>Items needing attention</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-l-4 border-yellow-400 pl-4">
                <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                <Button variant="ghost" size="sm" className="mt-2 text-xs p-0 h-auto">
                  {alert.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common shortcuts</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Button className="flex flex-col gap-2 h-auto py-5">
              <Car className="h-6 w-6" />
              New Lot
            </Button>

            <Button variant="outline" className="flex flex-col gap-2 h-auto py-5">
              <Gavel className="h-6 w-6" />
              Auction
            </Button>

            <Button variant="outline" className="flex flex-col gap-2 h-auto py-5">
              <Users className="h-6 w-6" />
              Users
            </Button>

            <Button variant="outline" className="flex flex-col gap-2 h-auto py-5">
              <TrendingUp className="h-6 w-6" />
              Reports
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
