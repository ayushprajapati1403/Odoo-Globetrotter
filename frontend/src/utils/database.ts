import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// Type helpers
export type User = Tables['users']['Row']
export type Trip = Tables['trips']['Row']
export type City = Tables['cities']['Row']
export type Activity = Tables['activities']['Row']
export type TripStop = Tables['trip_stops']['Row']
export type TripActivity = Tables['trip_activities']['Row']
export type Accommodation = Tables['accommodations']['Row']
export type TransportCost = Tables['transport_costs']['Row']
export type Currency = Tables['currencies']['Row']

// Data formatting utilities
export const formatCurrency = (amount: number | null, currency: string = 'USD'): string => {
  if (amount === null || amount === undefined) return 'N/A'
  
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$'
  }
  
  const symbol = currencySymbols[currency] || currency
  return `${symbol}${amount.toFixed(2)}`
}

export const formatDuration = (minutes: number | null): string => {
  if (minutes === null || minutes === undefined) return 'N/A'
  
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

export const formatDate = (date: string | null): string => {
  if (!date) return 'N/A'
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

export const formatDateTime = (date: string | null, time: string | null): string => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = new Date(date)
    const timeStr = time ? ` at ${time}` : ''
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + timeStr
  } catch {
    return 'Invalid Date'
  }
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRequired = (value: any): boolean => {
  return value !== null && value !== undefined && value !== ''
}

export const validateTripDates = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return start <= end
}

// Data transformation utilities
export const sortTripsByDate = (trips: Trip[]): Trip[] => {
  return [...trips].sort((a, b) => {
    if (!a.start_date && !b.start_date) return 0
    if (!a.start_date) return 1
    if (!b.start_date) return -1
    
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })
}

export const sortActivitiesByTime = (activities: TripActivity[]): TripActivity[] => {
  return [...activities].sort((a, b) => {
    if (!a.scheduled_date && !b.scheduled_date) return 0
    if (!a.scheduled_date) return 1
    if (!b.scheduled_date) return -1
    
    const dateComparison = new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    if (dateComparison !== 0) return dateComparison
    
    if (!a.start_time && !b.start_time) return 0
    if (!a.start_time) return 1
    if (!b.start_time) return -1
    
    return a.start_time.localeCompare(b.start_time)
  })
}

export const groupActivitiesByDate = (activities: TripActivity[]): Record<string, TripActivity[]> => {
  const grouped: Record<string, TripActivity[]> = {}
  
  activities.forEach(activity => {
    if (activity.scheduled_date) {
      const dateKey = activity.scheduled_date.split('T')[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(activity)
    }
  })
  
  // Sort activities within each date group
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey] = sortActivitiesByTime(grouped[dateKey])
  })
  
  return grouped
}

// Cost calculation utilities
export const calculateTripCost = (trip: Trip, stops: TripStop[]): number => {
  let totalCost = trip.total_estimated_cost || 0
  
  // Add costs from trip stops
  stops.forEach(stop => {
    if (stop.local_transport_cost) totalCost += stop.local_transport_cost
    if (stop.accommodation_estimate) totalCost += stop.accommodation_estimate
  })
  
  return totalCost
}

export const calculateStopCost = (stop: TripStop, activities: TripActivity[]): number => {
  let totalCost = 0
  
  if (stop.local_transport_cost) totalCost += stop.local_transport_cost
  if (stop.accommodation_estimate) totalCost += stop.accommodation_estimate
  
  activities.forEach(activity => {
    if (activity.cost) totalCost += activity.cost
  })
  
  return totalCost
}

// Search utilities
export const searchInText = (text: string, query: string): boolean => {
  if (!text || !query) return false
  return text.toLowerCase().includes(query.toLowerCase())
}

export const searchInArray = (array: string[], query: string): boolean => {
  if (!array || !query) return false
  return array.some(item => searchInText(item, query))
}

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error_description) return error.error_description
  return 'An unexpected error occurred'
}

export const isSupabaseError = (error: any): boolean => {
  return error && (error.code || error.message || error.details)
}

// Local storage utilities for offline support
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to read from localStorage:', error)
    return defaultValue
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}
