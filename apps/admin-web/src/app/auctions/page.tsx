'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
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
  Users,
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

export default function AuctionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<AuctionStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockAuctions: Auction[] = []; // same data source logic
  const [auctions] = useState<Auction[]>(mockAuctions);

  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch =
      auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || auction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: AuctionStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);

  const getAuctionTypeLabel = (type: string) => {
    if (type === 'timed_online') return 'Timed Online';
    if (type === 'open') return 'Open Auction';
    return type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Auctions Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, schedule and control auction events
          </p>
        </div>

        <Button className="rounded-xl shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create New Auction
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Auctions',
            value: auctions.length,
            icon: Gavel,
          },
          {
            title: 'Active',
            value: auctions.filter((a) => a.status === 'active').length,
            icon: Play,
          },
          {
            title: 'Scheduled',
            value: auctions.filter((a) => a.status === 'scheduled').length,
            icon: Calendar,
          },
          {
            title: 'Total Lots',
            value: auctions.reduce(
              (sum, a) => sum + a.lotIds.length,
              0
            ),
            icon: Users,
          },
        ].map((stat) => (
          <Card
            key={stat.title}
            className="rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-xl bg-blue-50">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                System overview
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Search and filter auctions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-lg"
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
                  className="pl-10 rounded-xl"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value: any) =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Statuses
                  </SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="rounded-xl">
                Export
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>
            Auctions ({filteredAuctions.length})
          </CardTitle>
          <CardDescription>
            Manage and monitor auction events
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Auction
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Lots
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAuctions.map((auction) => (
                  <tr
                    key={auction.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {auction.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {auction.description}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {getAuctionTypeLabel(auction.type)}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {formatDateTime(auction.startTime)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(auction.endTime)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {auction.lotIds.length}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          auction.status
                        )}`}
                      >
                        {
                          statusOptions.find(
                            (s) => s.value === auction.status
                          )?.label
                        }
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
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

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAuctions.length === 0 && (
              <div className="text-center py-12">
                <Gavel className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">
                  No auctions found
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Adjust filters or create a new auction
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
