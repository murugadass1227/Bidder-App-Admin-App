'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2,
  TrendingUp,
  Activity,
  DollarSign,
  Users
} from 'lucide-react';
import { Bid } from '@/types';

const mockBids: Bid[] = [
  {
    id: '1',
    lotId: '1',
    auctionId: '1',
    bidderId: 'user1',
    amount: 15000,
    timestamp: new Date('2024-01-16T10:30:00Z'),
    status: 'winning',
    isSuspicious: false,
  },
  {
    id: '2',
    lotId: '1',
    auctionId: '1',
    bidderId: 'user2',
    amount: 14500,
    timestamp: new Date('2024-01-16T10:25:00Z'),
    status: 'outbid',
    isSuspicious: false,
  },
  {
    id: '3',
    lotId: '2',
    auctionId: '1',
    bidderId: 'user3',
    amount: 22000,
    timestamp: new Date('2024-01-16T10:15:00Z'),
    status: 'active',
    isSuspicious: true,
    suspiciousReason: 'Unusual bidding pattern detected',
  },
  {
    id: '4',
    lotId: '2',
    auctionId: '1',
    bidderId: 'user4',
    amount: 18000,
    timestamp: new Date('2024-01-16T10:10:00Z'),
    status: 'active',
    isSuspicious: false,
  },
];

const mockUsers = {
  user1: { name: 'John Doe', email: 'john@example.com' },
  user2: { name: 'Jane Smith', email: 'jane@example.com' },
  user3: { name: 'Mike Johnson', email: 'mike@example.com' },
  user4: { name: 'Sarah Wilson', email: 'sarah@example.com' },
};

const mockLots = {
  '1': { title: '2023 Toyota Camry SE' },
  '2': { title: '2022 Honda Accord EX' },
};

export default function BidsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [suspiciousFilter, setSuspiciousFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [bids] = useState<Bid[]>(mockBids);

  const filteredBids = bids.filter(bid => {
    const matchesSearch = 
      mockUsers[bid.bidderId as keyof typeof mockUsers]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockLots[bid.lotId as keyof typeof mockLots]?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
    const matchesSuspicious = suspiciousFilter === 'all' || 
      (suspiciousFilter === 'suspicious' && bid.isSuspicious) ||
      (suspiciousFilter === 'normal' && !bid.isSuspicious);
    
    return matchesSearch && matchesStatus && matchesSuspicious;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'outbid': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const suspiciousBids = bids.filter(bid => bid.isSuspicious).length;
  const totalBids = bids.length;
  const totalValue = bids.reduce((sum, bid) => sum + bid.amount, 0);
  const uniqueBidders = new Set(bids.map(bid => bid.bidderId)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bid Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitor bids and detect suspicious activity</p>
        </div>
        <div className="flex gap-2">
          {suspiciousBids > 0 && (
            <Button variant="danger" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {suspiciousBids} Suspicious Bids
            </Button>
          )}
          <Button variant="outline">
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBids}</div>
            <p className="text-xs text-gray-500">All time bids</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Sum of all bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Bidders</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueBidders}</div>
            <p className="text-xs text-gray-500">Active participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{suspiciousBids}</div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activity Alert */}
      {suspiciousBids > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Suspicious Activity Detected
            </CardTitle>
            <CardDescription className="text-red-600">
              {suspiciousBids} bid(s) flagged for unusual patterns. Review immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" size="sm">
              Review All Suspicious Bids
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter bids</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search bids..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="winning">Winning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="outbid">Outbid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={suspiciousFilter} onValueChange={setSuspiciousFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Suspicious activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bids</SelectItem>
                  <SelectItem value="suspicious">Suspicious Only</SelectItem>
                  <SelectItem value="normal">Normal Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                Export
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bids Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bids ({filteredBids.length})</CardTitle>
          <CardDescription>Monitor and manage all bidding activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Bid Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Bidder</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Lot</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBids.map((bid) => {
                  const user = mockUsers[bid.bidderId as keyof typeof mockUsers];
                  const lot = mockLots[bid.lotId as keyof typeof mockLots];
                  
                  return (
                    <tr 
                      key={bid.id} 
                      className={`border-b hover:bg-gray-50 ${
                        bid.isSuspicious ? 'bg-red-50 border-red-200' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {bid.isSuspicious && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium text-gray-900">#{bid.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {lot?.title}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">
                          ${bid.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDateTime(bid.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bid.isSuspicious && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredBids.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
