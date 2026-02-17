'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Lot, LotStatus } from '@/types';

const lotSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().min(1, 'VIN is required'),
  mileage: z.number().min(0),
  engineType: z.string().min(1, 'Engine type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  color: z.string().min(1, 'Color is required'),
  damageDescription: z.string().min(1, 'Damage description is required'),
  location: z.string().min(1, 'Location is required'),
  reservePrice: z.number().optional(),
  buyNowPrice: z.number().optional(),
  minIncrement: z.number().min(1, 'Minimum increment is required'),
  maxIncrement: z.number().optional(),
  status: z.enum(['draft', 'ready', 'published', 'in_auction', 'sold', 'unsold', 'released', 'closed']),
});

type LotFormData = z.infer<typeof lotSchema>;

interface LotFormProps {
  lot?: Lot;
  onSubmit: (data: LotFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const transmissionOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'cvt', label: 'CVT' },
  { value: 'dual-clutch', label: 'Dual Clutch' },
];

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

export function LotForm({ lot, onSubmit, onCancel, isLoading }: LotFormProps) {
  const form = useForm<LotFormData>({
    resolver: zodResolver(lotSchema),
    defaultValues: lot ? {
      title: lot.title,
      description: lot.description,
      make: lot.vehicleDetails.make,
      model: lot.vehicleDetails.model,
      year: lot.vehicleDetails.year,
      vin: lot.vehicleDetails.vin,
      mileage: lot.vehicleDetails.mileage,
      engineType: lot.vehicleDetails.engineType,
      transmission: lot.vehicleDetails.transmission,
      color: lot.vehicleDetails.color,
      damageDescription: lot.damageDescription,
      location: lot.location,
      reservePrice: lot.reservePrice,
      buyNowPrice: lot.buyNowPrice,
      minIncrement: lot.bidIncrementRules.minIncrement,
      maxIncrement: lot.bidIncrementRules.maxIncrement,
      status: lot.status,
    } : {
      title: '',
      description: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      mileage: 0,
      engineType: '',
      transmission: '',
      color: '',
      damageDescription: '',
      location: '',
      reservePrice: undefined,
      buyNowPrice: undefined,
      minIncrement: 100,
      maxIncrement: undefined,
      status: 'draft',
    },
  });

  const handleSubmit = (data: LotFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {lot ? 'Edit Lot' : 'Create New Lot'}
          </h2>
          <p className="text-gray-600 mt-1">
            {lot ? 'Update lot information' : 'Add a new vehicle lot to the system'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General details about the lot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2023 Toyota Camry SE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe the vehicle condition, features, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>Specific information about the vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN</FormLabel>
                      <FormControl>
                        <Input placeholder="Vehicle Identification Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Silver" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.5L I4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Condition and Location */}
          <Card>
            <CardHeader>
              <CardTitle>Condition & Location</CardTitle>
              <CardDescription>Vehicle condition and storage location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="damageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe any damage or issues with the vehicle"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Los Angeles, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing and Bidding Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Bidding Rules</CardTitle>
              <CardDescription>Set pricing and bid increment rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reservePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reserve Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Minimum acceptable price"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyNowPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy Now Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Instant purchase price"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Increment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Bid Increment (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Maximum allowed increment"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : lot ? 'Update Lot' : 'Create Lot'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
