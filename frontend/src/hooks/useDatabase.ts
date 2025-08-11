import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as databaseService from '../services/database'

// Hook for fetching user trips
export const useUserTrips = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTrips([])
      setLoading(false)
      return
    }

    const fetchTrips = async () => {
      try {
        setLoading(true)
        const { data, error } = await databaseService.tripService.getUserTrips(user.id)
        if (error) throw error
        setTrips(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [user])

  const refetch = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await databaseService.tripService.getUserTrips(user.id)
      if (error) throw error
      setTrips(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trips')
    } finally {
      setLoading(false)
    }
  }

  return { trips, loading, error, refetch }
}

// Hook for fetching a single trip
export const useTrip = (tripId: string | null) => {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) {
      setTrip(null)
      setLoading(false)
      return
    }

    const fetchTrip = async () => {
      try {
        setLoading(true)
        const { data, error } = await databaseService.tripService.getTrip(tripId)
        if (error) throw error
        setTrip(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trip')
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [tripId])

  const refetch = async () => {
    if (!tripId) return
    try {
      setLoading(true)
      const { data, error } = await databaseService.tripService.getTrip(tripId)
      if (error) throw error
      setTrip(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip')
    } finally {
      setLoading(false)
    }
  }

  return { trip, loading, error, refetch }
}

// Hook for searching cities
export const useCitySearch = () => {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchCities = async (query: string) => {
    if (!query.trim()) {
      setCities([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error } = await databaseService.cityService.searchCities(query)
      if (error) throw error
      setCities(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search cities')
      setCities([])
    } finally {
      setLoading(false)
    }
  }

  return { cities, loading, error, searchCities }
}

// Hook for fetching popular cities
export const usePopularCities = () => {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const { data, error } = await databaseService.cityService.getPopularCities()
        if (error) throw error
        setCities(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular cities')
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return { cities, loading, error }
}

// Hook for fetching city activities
export const useCityActivities = (cityId: string | null) => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cityId) {
      setActivities([])
      setLoading(false)
      return
    }

    const fetchActivities = async () => {
      try {
        setLoading(true)
        const { data, error } = await databaseService.activityService.getCityActivities(cityId)
        if (error) throw error
        setActivities(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [cityId])

  return { activities, loading, error }
}

// Hook for user profile
export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data, error } = await databaseService.userService.getProfile(user.id)
        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user logged in' }

    try {
      const { data, error } = await databaseService.userService.updateProfile(user.id, updates)
      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  return { profile, loading, error, updateProfile }
}
