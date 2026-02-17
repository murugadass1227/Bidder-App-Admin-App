'use client';

import { useState, useEffect } from 'react';
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
import { useLotStore } from '@/stores/lotStore';

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

const mockLots: Lot[] = [
  {
    id: '1',
    title: '2023 Toyota Camry SE',
    description: 'Well-maintained sedan with low mileage',
    vehicleDetails: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      vin: '1HGBH41JXMN109186',
      mileage: 15000,
      engineType: '2.5L I4',
      transmission: 'Automatic',
      color: 'Silver',
    },
    damageDescription: 'Minor scratch on rear bumper',
    location: 'Los Angeles, CA',
    reservePrice: 18000,
    buyNowPrice: 22000,
    bidIncrementRules: {
      minIncrement: 100,
      maxIncrement: 1000,
    },
    images: [],
    videos: [],
    documents: [],
    status: 'published',
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    title: '2022 Honda Accord EX',
    description: 'Reliable family car with excellent service history',
    vehicleDetails: {
      make: 'Honda',
      model: 'Accord',
      year: 2022,
      vin: '2HGFC2F59MH123456',
      mileage: 25000,
      engineType: '1.5L Turbo',
      transmission: 'CVT',
      color: 'Blue',
    },
    damageDescription: 'No significant damage',
    location: 'New York, NY',
    reservePrice: 20000,
    buyNowPrice: 25000,
    bidIncrementRules: {
      minIncrement: 150,
      maxIncrement: 1500,
    },
    images: [],
    videos: [],
    documents: [],
    status: 'in_auction',
    createdBy: 'admin',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
  },
];

export default function LotsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LotStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [lots, setLots] = useState<Lot[]>(mockLots);

  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.vehicleDetails.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.vehicleDetails.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LotStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'in_auction': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      case 'unsold': return 'bg-red-100 text-red-800';
      case 'released': return 'bg-indigo-100 text-indigo-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lots Management</h1>
          <p className="text-gray-600 mt-2">Manage vehicle lots and track their status</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Lot
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
            <Car className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lots.length}</div>
            <p className="text-xs text-gray-500">All lots in system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Auction</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lots.filter(lot => lot.status === 'in_auction').length}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lots.filter(lot => lot.status === 'sold').length}
            </div>
            <p className="text-xs text-gray-500">Successfully sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsold</CardTitle>
            <Car className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lots.filter(lot => lot.status === 'unsold').length}
            </div>
            <p className="text-xs text-gray-500">Available for relist</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
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
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lots Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lots ({filteredLots.length})</CardTitle>
          <CardDescription>Manage and monitor all vehicle lots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Lot Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reserve Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLots.map((lot) => (
                  <tr key={lot.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{lot.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {lot.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium">{lot.vehicleDetails.year} {lot.vehicleDetails.make} {lot.vehicleDetails.model}</div>
                        <div className="text-gray-500">{lot.vehicleDetails.mileage.toLocaleString()} miles</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {lot.location}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {lot.reservePrice ? `$${lot.reservePrice.toLocaleString()}` : 'Not set'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lot.status)}`}>
                        {statusOptions.find(opt => opt.value === lot.status)?.label || lot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {lot.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredLots.length === 0 && (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lots found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
