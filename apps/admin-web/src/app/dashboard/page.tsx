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
  Clock,
  Eye,
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
      
      // Fetch users count
      const usersResponse = await apiService.getBidders({ limit: 1 });
      
      // Mock data for other stats (you can add more API calls later)
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
        ]
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
    // Ensure consistent rendering between server and client
    if (typeof window === 'undefined') {
      // On the server, just return a simple string or a fixed format
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
    {
      title: 'Total Lots',
      value: stats?.totalLots?.toLocaleString() ?? '0',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: Car,
    },
    {
      title: 'Active Auctions',
      value: stats?.activeAuctions?.toLocaleString() ?? '0',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Gavel,
    },
    {
      title: 'Total Bids',
      value: stats?.totalBids?.toLocaleString() ?? '0',
      change: '+18.7%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Registered Users',
      value: stats?.totalUsers?.toLocaleString() ?? '0',
      change: '+9.1%',
      changeType: 'positive' as const,
      icon: Users,
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Unsold Lots Alert',
      description: `${stats?.unsoldLots90Days || 0} lots have been unsold for over 90 days`,
      action: 'Review Lots',
    },
    {
      id: 2,
      type: 'info' as const,
      title: 'Pending Approvals',
      description: `${stats?.pendingApprovals || 0} reserve price approvals pending`,
      action: 'Review Approvals',
    },
    {
      id: 3,
      type: 'error' as const,
      title: 'Suspicious Activity',
      description: 'Unusual bidding pattern detected on Auction #1234',
      action: 'Investigate',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-800">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDashboardStats} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Botswana Insurance Company (BIC)
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Auction Management Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Latest actions and events in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(activity.timestamp)} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription className="text-sm">
              Important items requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-l-yellow-400 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Car className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Create New Lot</span>
              <span className="sm:hidden">New Lot</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Gavel className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Start Auction</span>
              <span className="sm:hidden">Auction</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">View Reports</span>
              <span className="sm:hidden">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
