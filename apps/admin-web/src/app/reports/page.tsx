'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Download, 
  Filter, 
  TrendingUp, 
  DollarSign,
  Car,
  Users,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

const reportTypes = [
  { value: 'sales_report', label: 'Sales Report', icon: DollarSign },
  { value: 'bidder_participation', label: 'Bidder Participation', icon: Users },
  { value: 'lot_performance', label: 'Lot Performance', icon: Car },
  { value: 'settlement_vs_reserve', label: 'Settlement vs Reserve', icon: TrendingUp },
  { value: 'vehicle_classifications', label: 'Vehicle Classifications', icon: BarChart3 },
  { value: 'time_to_disposal', label: 'Time to Disposal', icon: Calendar },
  { value: 'bidder_activity_heatmap', label: 'Bidder Activity Heatmap', icon: Activity },
  { value: 'unsold_stock_aging', label: 'Unsold Stock Aging', icon: Car },
  { value: 'kyc_completeness', label: 'KYC Completeness', icon: Users },
];

interface Bidder {
  name: string;
  bids: number;
  won: number;
}

interface VehicleClassification {
  type: string;
  count: number;
  percentage: number;
}

interface RecoveryRate {
  make: string;
  recovery: number;
}

const mockReportData = {
  sales_report: {
    totalSales: 2450000,
    totalLots: 156,
    averagePrice: 15673,
    soldLots: 142,
    unsoldLots: 14,
    sellThroughRate: 91.0,
    monthlyData: [
      { month: 'Jan', sales: 180000, lots: 12 },
      { month: 'Feb', sales: 220000, lots: 15 },
      { month: 'Mar', sales: 195000, lots: 13 },
      { month: 'Apr', sales: 280000, lots: 18 },
      { month: 'May', sales: 310000, lots: 20 },
      { month: 'Jun', sales: 265000, lots: 17 },
    ],
  },
  bidder_participation: {
    totalBidders: 892,
    activeBidders: 456,
    newBidders: 67,
    returningBidders: 389,
    averageBidsPerUser: 12.5,
    topBidders: [
      { name: 'John Doe', bids: 45, won: 12 },
      { name: 'Jane Smith', bids: 38, won: 8 },
      { name: 'Mike Johnson', bids: 32, won: 6 },
    ],
  },
  vehicle_classifications: {
    totalVehicles: 156,
    classifications: [
      { type: 'Sedan', count: 45, percentage: 28.8 },
      { type: 'SUV', count: 38, percentage: 24.4 },
      { type: 'Truck', count: 32, percentage: 20.5 },
      { type: 'Coupe', count: 18, percentage: 11.5 },
      { type: 'Convertible', count: 15, percentage: 9.6 },
      { type: 'Other', count: 8, percentage: 5.1 },
    ],
    recoveryRates: [
      { make: 'Toyota', recovery: 92.5 },
      { make: 'Honda', recovery: 89.3 },
      { make: 'Ford', recovery: 87.1 },
      { make: 'Chevrolet', recovery: 85.7 },
      { make: 'BMW', recovery: 94.2 },
    ],
  },
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('sales_report');
  const [dateRange, setDateRange] = useState<string>('last_30_days');
  const [showFilters, setShowFilters] = useState(false);

  const currentReport = reportTypes.find(r => r.value === selectedReport);
  const reportData = mockReportData[selectedReport as keyof typeof mockReportData] as any;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales_report':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(reportData.totalSales)}</div>
                  <p className="text-xs text-gray-500">Last 6 months</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(reportData.averagePrice)}</div>
                  <p className="text-xs text-gray-500">Per vehicle</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sell-Through Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.sellThroughRate}%</div>
                  <p className="text-xs text-gray-500">{reportData.soldLots}/{reportData.totalLots} sold</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
                  <Car className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalLots}</div>
                  <p className="text-xs text-gray-500">{reportData.unsoldLots} unsold</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Sales performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would be rendered here</p>
                    <p className="text-sm text-gray-400">Using Recharts library</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'bidder_participation':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bidders</CardTitle>
                  <Users className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalBidders}</div>
                  <p className="text-xs text-gray-500">Registered users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bidders</CardTitle>
                  <Activity className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.activeBidders}</div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Bidders</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.newBidders}</div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Bids/User</CardTitle>
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.averageBidsPerUser}</div>
                  <p className="text-xs text-gray-500">Per active user</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Bidders</CardTitle>
                <CardDescription>Most active participants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topBidders.map((bidder: Bidder, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{bidder.name}</div>
                        <div className="text-sm text-gray-500">{bidder.bids} total bids</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{bidder.won} won</div>
                        <div className="text-sm text-gray-500">{((bidder.won / bidder.bids) * 100).toFixed(1)}% success</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'vehicle_classifications':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Types</CardTitle>
                  <CardDescription>Distribution by vehicle classification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.classifications.map((item: VehicleClassification, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.count}</div>
                          <div className="text-sm text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recovery Rates by Make</CardTitle>
                  <CardDescription>Percentage of vehicles sold vs listed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.recoveryRates.map((item: RecoveryRate, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.make}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${item.recovery}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">{item.recovery}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Report Coming Soon</h3>
                <p className="text-gray-500">This report type is under development</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Advanced reporting dashboards and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Report Type</CardTitle>
          <CardDescription>Choose the type of report you want to generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.value}
                  onClick={() => setSelectedReport(report.value)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedReport === report.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{report.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Customize report parameters</CardDescription>
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
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Auction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Auctions</SelectItem>
                  <SelectItem value="timed_online">Timed Online</SelectItem>
                  <SelectItem value="open">Open Auction</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Vehicle category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="coupe">Coupe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Report Content */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          {currentReport && <currentReport.icon className="h-6 w-6 text-gray-600" />}
          <h2 className="text-2xl font-bold text-gray-900">
            {currentReport?.label}
          </h2>
        </div>
        {renderReportContent()}
      </div>
    </div>
  );
}
