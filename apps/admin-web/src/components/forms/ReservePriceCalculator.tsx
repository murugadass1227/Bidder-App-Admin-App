'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Calculator, 
  TrendingUp, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MotorCodingModel } from '@/types';

interface VehicleData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  marketDemand: 'high' | 'medium' | 'low';
}

interface ReservePriceCalculatorProps {
  vehicleData: VehicleData;
  onReserveCalculated: (reservePrice: number, model: MotorCodingModel) => void;
}

const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Kia'];
const conditions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];
const demandLevels = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function ReservePriceCalculator({ vehicleData, onReserveCalculated }: ReservePriceCalculatorProps) {
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<MotorCodingModel | null>(null);
  const [localData, setLocalData] = useState<VehicleData>(vehicleData);

  // Mock historical data for calculation
  const getBasePrice = (make: string, model: string, year: number) => {
    const basePrices: Record<string, Record<string, number>> = {
      'Toyota': { 'Camry': 25000, 'Corolla': 20000, 'RAV4': 28000 },
      'Honda': { 'Accord': 26000, 'Civic': 22000, 'CR-V': 29000 },
      'Ford': { 'F-150': 35000, 'Mustang': 30000, 'Explorer': 32000 },
      'Chevrolet': { 'Silverado': 37000, 'Malibu': 24000, 'Tahoe': 45000 },
      'BMW': { '3 Series': 42000, '5 Series': 55000, 'X5': 62000 },
    };

    const makePrices = basePrices[make] || {};
    const basePrice = makePrices[model] || 25000;
    
    // Adjust for year (depreciation)
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const depreciation = Math.min(age * 0.08, 0.7); // Max 70% depreciation
    
    return basePrice * (1 - depreciation);
  };

  const calculateReservePrice = async () => {
    setCalculating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const basePrice = getBasePrice(localData.make, localData.model, localData.year);
    
    // Condition factor
    const conditionFactors = {
      excellent: 1.0,
      good: 0.85,
      fair: 0.7,
      poor: 0.5,
    };
    
    // Market demand factor
    const demandFactors = {
      high: 1.15,
      medium: 1.0,
      low: 0.85,
    };
    
    // Mileage adjustment (assume 12,000 miles/year average)
    const currentYear = new Date().getFullYear();
    const expectedMileage = (currentYear - localData.year) * 12000;
    const mileageRatio = localData.mileage / expectedMileage;
    const mileageFactor = Math.max(0.7, 1 - (mileageRatio - 1) * 0.1);
    
    // Location factor (mock data)
    const locationFactors: Record<string, number> = {
      'Los Angeles, CA': 1.1,
      'New York, NY': 1.05,
      'Chicago, IL': 1.0,
      'Houston, TX': 0.95,
      'Phoenix, AZ': 0.9,
    };
    
    const locationFactor = locationFactors[localData.location] || 1.0;
    
    // Calculate final factors
    const conditionFactor = conditionFactors[localData.condition];
    const demandFactor = demandFactors[localData.marketDemand];
    
    // Calculate suggested reserve price
    const suggestedReserve = Math.round(
      basePrice * conditionFactor * demandFactor * mileageFactor * locationFactor
    );
    
    // Create motor coding model result
    const model: MotorCodingModel = {
      rating: suggestedReserve > 30000 ? 'A' : suggestedReserve > 20000 ? 'B' : suggestedReserve > 15000 ? 'C' : 'D',
      factors: {
        condition: conditionFactor,
        marketDemand: demandFactor,
        age: Math.max(0.3, 1 - (currentYear - localData.year) * 0.1),
        mileage: mileageFactor,
        location: locationFactor,
      },
      suggestedReserve,
      confidence: Math.min(95, 70 + (5 - Math.abs(mileageRatio - 1)) * 5),
    };
    
    setResult(model);
    onReserveCalculated(suggestedReserve, model);
    setCalculating(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Reserve Price Calculator
          </CardTitle>
          <CardDescription>
            Calculate optimal reserve price using Motor Coding Model and historical data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <Select value={localData.make} onValueChange={(value) => setLocalData({...localData, make: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <Input
                value={localData.model}
                onChange={(e) => setLocalData({...localData, model: e.target.value})}
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Input
                type="number"
                value={localData.year}
                onChange={(e) => setLocalData({...localData, year: parseInt(e.target.value)})}
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
              <Input
                type="number"
                value={localData.mileage}
                onChange={(e) => setLocalData({...localData, mileage: parseInt(e.target.value)})}
                placeholder="Miles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <Select value={localData.condition} onValueChange={(value: any) => setLocalData({...localData, condition: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Demand</label>
              <Select value={localData.marketDemand} onValueChange={(value: any) => setLocalData({...localData, marketDemand: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demandLevels.map((demand) => (
                    <SelectItem key={demand.value} value={demand.value}>
                      {demand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                value={localData.location}
                onChange={(e) => setLocalData({...localData, location: e.target.value})}
                placeholder="e.g., Los Angeles, CA"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={calculateReservePrice} 
              disabled={calculating || !localData.make || !localData.model}
              className="w-full sm:w-auto"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {calculating ? 'Calculating...' : 'Calculate Reserve Price'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Calculation Results
            </CardTitle>
            <CardDescription>
              Motor Coding Model analysis and recommended reserve price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Main Result */}
              <div className="space-y-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">
                    ${result.suggestedReserve.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Suggested Reserve Price</div>
                  <div className={`text-sm font-medium mt-2 ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}% Confidence
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">Motor Coding Rating</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(result.rating)}`}>
                    {result.rating}
                  </span>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Factor Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Condition</span>
                    <span className="text-sm font-medium">{(result.factors.condition * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Market Demand</span>
                    <span className="text-sm font-medium">{(result.factors.marketDemand * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Age Factor</span>
                    <span className="text-sm font-medium">{(result.factors.age * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mileage Factor</span>
                    <span className="text-sm font-medium">{(result.factors.mileage * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location Factor</span>
                    <span className="text-sm font-medium">{(result.factors.location * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Recommendations</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Set reserve price at ${result.suggestedReserve.toLocaleString()} for optimal auction performance</li>
                    <li>• Consider market conditions and adjust if demand changes</li>
                    <li>• Monitor bidding activity and be prepared to adjust</li>
                    {result.confidence < 80 && (
                      <li>• Lower confidence due to limited comparable data - consider manual review</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
