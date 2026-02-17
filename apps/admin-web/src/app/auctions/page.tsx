'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Square,
  Eye, 
  Edit, 
  Trash2,
  Gavel,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { Auction, AuctionStatus } from '@/types';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const mockAuctions: Auction[] = [
  {
    id: '1',
    name: 'Weekly Vehicle Auction',
    description: 'Regular weekly auction for used vehicles',
    startTime: new Date('2024-01-20T10:00:00Z'),
    endTime: new Date('2024-01-20T18:00:00Z'),
    timezone: 'America/New_York',
    type: 'timed_online',
    status: 'active',
    lotIds: ['1', '2', '3'],
    rules: {
      minOpeningBid: 1000,
      bidIncrementRules: {
        minIncrement: 100,
        maxIncrement: 1000,
      },
      antiSnipingEnabled: true,
      antiSnipingTime: 5,
      reservePriceEnabled: true,
    },
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    name: 'Luxury Car Showcase',
    description: 'Premium and luxury vehicles auction',
    startTime: new Date('2024-01-25T14:00:00Z'),
    endTime: new Date('2024-01-25T20:00:00Z'),
    timezone: 'America/New_York',
    type: 'timed_online',
    status: 'scheduled',
    lotIds: ['4', '5'],
    rules: {
      minOpeningBid: 5000,
      bidIncrementRules: {
        minIncrement: 500,
        maxIncrement: 5000,
      },
      antiSnipingEnabled: true,
      antiSnipingTime: 10,
      reservePriceEnabled: true,
    },
    createdBy: 'admin',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

export default function AuctionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [auctions] = useState<Auction[]>(mockAuctions);

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || auction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: AuctionStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getAuctionTypeLabel = (type: string) => {
    switch (type) {
      case 'timed_online': return 'Timed Online';
      case 'open': return 'Open Auction';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auctions Management</h1>
          <p className="text-gray-600 mt-2">Create and manage auction events</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Auction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auctions.length}</div>
            <p className="text-xs text-gray-500">All auction events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auctions.filter(auction => auction.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auctions.filter(auction => auction.status === 'scheduled').length}
            </div>
            <p className="text-xs text-gray-500">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auctions.reduce((total, auction) => total + auction.lotIds.length, 0)}
            </div>
            <p className="text-xs text-gray-500">Across all auctions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter auctions</CardDescription>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                Export
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Auctions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Auctions ({filteredAuctions.length})</CardTitle>
          <CardDescription>Manage and monitor all auction events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Auction Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Schedule</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Lots</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{auction.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {auction.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {getAuctionTypeLabel(auction.type)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDateTime(auction.startTime)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(auction.endTime)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {auction.lotIds.length} lots
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                        {statusOptions.find(opt => opt.value === auction.status)?.label || auction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {auction.status === 'active' && (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {auction.status === 'paused' && (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {auction.status === 'scheduled' && (
                          <Button variant="ghost" size="sm">
                            <Square className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAuctions.length === 0 && (
              <div className="text-center py-8">
                <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
