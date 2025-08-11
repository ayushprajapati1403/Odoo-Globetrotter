// Supabase configuration constants
export const SUPABASE_CONFIG = {
  // Authentication settings
  AUTH: {
    // Auto refresh token
    AUTO_REFRESH_TOKEN: true,
    // Persist session in localStorage
    PERSIST_SESSION: true,
    // Detect session in URL
    DETECT_SESSION_IN_URL: true,
  },
  
  // Database settings
  DATABASE: {
    // Default page size for queries
    DEFAULT_PAGE_SIZE: 50,
    // Maximum page size for queries
    MAX_PAGE_SIZE: 1000,
    // Default timeout for queries (in milliseconds)
    QUERY_TIMEOUT: 30000,
  },
  
  // Storage settings
  STORAGE: {
    // Maximum file size (in bytes) - 10MB
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    // Allowed file types for uploads
    ALLOWED_FILE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/json'
    ],
    // Default bucket name for user uploads
    DEFAULT_BUCKET: 'user-uploads',
  },
  
  // Real-time settings
  REALTIME: {
    // Enable real-time subscriptions
    ENABLED: true,
    // Default heartbeat interval (in milliseconds)
    HEARTBEAT_INTERVAL: 30000,
  },
  
  // Error handling
  ERRORS: {
    // Show error notifications
    SHOW_NOTIFICATIONS: true,
    // Log errors to console
    LOG_TO_CONSOLE: true,
    // Retry failed requests
    RETRY_FAILED_REQUESTS: true,
    // Maximum retry attempts
    MAX_RETRY_ATTEMPTS: 3,
  },
  
  // Development settings
  DEVELOPMENT: {
    // Enable debug logging
    DEBUG_LOGGING: process.env.NODE_ENV === 'development',
    // Show SQL queries in console
    SHOW_SQL_QUERIES: process.env.NODE_ENV === 'development',
    // Enable performance monitoring
    PERFORMANCE_MONITORING: process.env.NODE_ENV === 'development',
  }
}

// Database table names
export const TABLES = {
  USERS: 'users',
  CITIES: 'cities',
  TRIPS: 'trips',
  TRIP_STOPS: 'trip_stops',
  ACTIVITIES: 'activities',
  TRIP_ACTIVITIES: 'trip_activities',
  ACCOMMODATIONS: 'accommodations',
  TRANSPORT_COSTS: 'transport_costs',
  CURRENCIES: 'currencies',
  SHARED_LINKS: 'shared_links',
  AUDIT_LOGS: 'audit_logs',
} as const

// Database column names
export const COLUMNS = {
  // Common columns
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  
  // User columns
  USER_ID: 'user_id',
  EMAIL: 'email',
  NAME: 'name',
  ACTIVE: 'active',
  
  // Trip columns
  TRIP_ID: 'trip_id',
  TRIP_NAME: 'name',
  DESCRIPTION: 'description',
  START_DATE: 'start_date',
  END_DATE: 'end_date',
  IS_PUBLIC: 'is_public',
  CURRENCY: 'currency',
  TOTAL_ESTIMATED_COST: 'total_estimated_cost',
  DELETED: 'deleted',
  
  // City columns
  CITY_ID: 'city_id',
  CITY_NAME: 'name',
  COUNTRY: 'country',
  LAT: 'lat',
  LNG: 'lng',
  POPULATION: 'population',
  COST_INDEX: 'cost_index',
  POPULARITY_SCORE: 'popularity_score',
  
  // Activity columns
  ACTIVITY_ID: 'activity_id',
  ACTIVITY_NAME: 'name',
  CATEGORY: 'category',
  COST: 'cost',
  DURATION_MINUTES: 'duration_minutes',
  VENDOR: 'vendor',
  
  // Trip stop columns
  STOP_ID: 'id',
  SEQ: 'seq',
  LOCAL_TRANSPORT_COST: 'local_transport_cost',
  ACCOMMODATION_ESTIMATE: 'accommodation_estimate',
  NOTES: 'notes',
  
  // Trip activity columns
  SCHEDULED_DATE: 'scheduled_date',
  START_TIME: 'start_time',
  
  // Accommodation columns
  PROVIDER: 'provider',
  PRICE_PER_NIGHT: 'price_per_night',
  
  // Transport columns
  FROM_CITY_ID: 'from_city_id',
  TO_CITY_ID: 'to_city_id',
  MODE: 'mode',
  AVG_COST: 'avg_cost',
  AVG_DURATION_MINUTES: 'avg_duration_minutes',
  
  // Currency columns
  CODE: 'code',
  SYMBOL: 'symbol',
  EXCHANGE_RATE_TO_USD: 'exchange_rate_to_usd',
  
  // Shared link columns
  TOKEN: 'token',
  EXPIRES_AT: 'expires_at',
  
  // Audit log columns
  ENTITY_TYPE: 'entity_type',
  ENTITY_ID: 'entity_id',
  ACTION: 'action',
  PERFORMED_BY: 'performed_by',
  PAYLOAD: 'payload',
} as const

// Default values
export const DEFAULTS = {
  // Currency
  DEFAULT_CURRENCY: 'USD',
  
  // Dates
  DEFAULT_TRIP_DURATION_DAYS: 7,
  
  // Costs
  DEFAULT_ACCOMMODATION_COST: 100,
  DEFAULT_TRANSPORT_COST: 50,
  DEFAULT_ACTIVITY_COST: 25,
  
  // Limits
  MAX_TRIP_STOPS: 20,
  MAX_ACTIVITIES_PER_STOP: 10,
  MAX_TRIP_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // Search
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_QUERY_LENGTH: 2,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Error messages
export const ERROR_MESSAGES = {
  // Authentication
  AUTH_REQUIRED: 'You must be logged in to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
  
  // Database
  FETCH_FAILED: 'Failed to fetch data',
  CREATE_FAILED: 'Failed to create item',
  UPDATE_FAILED: 'Failed to update item',
  DELETE_FAILED: 'Failed to delete item',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_DATE_RANGE: 'End date must be after start date',
  INVALID_COST: 'Please enter a valid cost amount',
  
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection',
  TIMEOUT_ERROR: 'Request timed out. Please try again',
  SERVER_ERROR: 'Server error. Please try again later',
  
  // General
  UNKNOWN_ERROR: 'An unexpected error occurred',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  // Authentication
  SIGNUP_SUCCESS: 'Account created successfully! Please check your email to verify your account.',
  SIGNIN_SUCCESS: 'Welcome back!',
  SIGNOUT_SUCCESS: 'You have been signed out successfully.',
  
  // Database
  CREATE_SUCCESS: 'Item created successfully',
  UPDATE_SUCCESS: 'Item updated successfully',
  DELETE_SUCCESS: 'Item deleted successfully',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Trip
  TRIP_CREATED: 'Trip created successfully',
  TRIP_UPDATED: 'Trip updated successfully',
  TRIP_DELETED: 'Trip deleted successfully',
  
  // General
  CHANGES_SAVED: 'Changes saved successfully',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  // User preferences
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  
  // Offline data
  OFFLINE_TRIPS: 'offline_trips',
  OFFLINE_CITIES: 'offline_cities',
  OFFLINE_ACTIVITIES: 'offline_activities',
  
  // Cache
  CACHE_TIMESTAMP: 'cache_timestamp',
  CACHE_VERSION: 'cache_version',
} as const

// API endpoints (for future use if needed)
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/v1/signup',
    SIGNIN: '/auth/v1/token',
    SIGNOUT: '/auth/v1/logout',
    REFRESH: '/auth/v1/token',
    RESET_PASSWORD: '/auth/v1/recover',
  },
  
  // Database
  DATABASE: {
    USERS: '/rest/v1/users',
    TRIPS: '/rest/v1/trips',
    CITIES: '/rest/v1/cities',
    ACTIVITIES: '/rest/v1/activities',
  },
  
  // Storage
  STORAGE: {
    UPLOAD: '/storage/v1/object',
    DOWNLOAD: '/storage/v1/object',
    DELETE: '/storage/v1/object',
  },
} as const
