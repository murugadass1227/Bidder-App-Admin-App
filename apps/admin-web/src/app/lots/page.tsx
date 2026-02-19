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
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Car,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Lot, LotStatus } from '@/types';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'published', label: 'Published' },
  { value: 'in_auction', label: 'In Auction' },
  { value: 'sold', label: 'Sold' },
  { value: 'unsold', label: 'Unsold' },
  { value: 'released', label: 'Released' },
  { value: 'closed', label: 'Closed' },
];

export default function LotsPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LotStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockLots: Lot[] = []; // keeping your same data logic

  const [lots] = useState<Lot[]>(mockLots);

  const filteredLots = lots.filter(lot => {
    const matchesSearch =
      lot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.vehicleDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.vehicleDetails.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LotStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'published': return 'bg-green-100 text-green-700';
      case 'in_auction': return 'bg-yellow-100 text-yellow-700';
      case 'sold': return 'bg-purple-100 text-purple-700';
      case 'unsold': return 'bg-red-100 text-red-700';
      case 'released': return 'bg-indigo-100 text-indigo-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lots Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage vehicle lots and track lifecycle status
          </p>
        </div>

        <Button className="rounded-xl shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create New Lot
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Lots', value: lots.length, icon: Car },
          { title: 'In Auction', value: lots.filter(l => l.status === 'in_auction').length, icon: Calendar },
          { title: 'Sold', value: lots.filter(l => l.status === 'sold').length, icon: DollarSign },
          { title: 'Unsold', value: lots.filter(l => l.status === 'unsold').length, icon: Car },
        ].map((stat) => (
          <Card key={stat.title} className="rounded-2xl shadow-sm hover:shadow-md transition">
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
              <p className="text-xs text-gray-500 mt-1">System summary</p>
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
              <CardDescription>Search and filter lots</CardDescription>
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
                  placeholder="Search lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="rounded-xl">
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

              <Button variant="outline" className="rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

            </div>
          </CardContent>
        )}
      </Card>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lots ({filteredLots.length})</CardTitle>
          <CardDescription>Manage and monitor all vehicle lots</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lot</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Reserve</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{lot.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {lot.description}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {lot.vehicleDetails.year} {lot.vehicleDetails.make} {lot.vehicleDetails.model}
                    </td>

                    <td className="py-3 px-4">{lot.location}</td>

                    <td className="py-3 px-4">
                      {lot.reservePrice ? `$${lot.reservePrice.toLocaleString()}` : 'Not set'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(lot.status)}`}>
                        {statusOptions.find(opt => opt.value === lot.status)?.label || lot.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500">
                      {lot.createdAt.toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLots.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No lots found</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting filters or create a new lot
                </p>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

    </div>
  );
}
