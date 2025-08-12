import { CurrencyService, Currency } from '../services/currencyService';

// Cache for user currency to avoid repeated API calls
let userCurrencyCache: { [userId: string]: Currency | null } = {};

// Get user's currency symbol
export const getUserCurrencySymbol = async (userId: string): Promise<string> => {
  try {
    // Check cache first
    if (userCurrencyCache[userId]) {
      return userCurrencyCache[userId]?.symbol || '$';
    }

    // Fetch from API if not cached
    const currency = await CurrencyService.getUserCurrency(userId);
    if (currency) {
      userCurrencyCache[userId] = currency;
      return currency.symbol || '$';
    }

    // Default to USD if no currency found
    return '$';
  } catch (error) {
    console.error('Error getting user currency symbol:', error);
    return '$';
  }
};

// Get user's currency object
export const getUserCurrency = async (userId: string): Promise<Currency | null> => {
  try {
    // Check cache first
    if (userCurrencyCache[userId]) {
      return userCurrencyCache[userId];
    }

    // Fetch from API if not cached
    const currency = await CurrencyService.getUserCurrency(userId);
    if (currency) {
      userCurrencyCache[userId] = currency;
    }
    return currency;
  } catch (error) {
    console.error('Error getting user currency:', error);
    return null;
  }
};

// Clear currency cache (useful for testing or when user changes preferences)
export const clearCurrencyCache = (userId?: string) => {
  if (userId) {
    delete userCurrencyCache[userId];
  } else {
    userCurrencyCache = {};
  }
};

// Format amount with user's currency
export const formatAmountWithUserCurrency = async (
  amount: number, 
  userId: string, 
  fallbackSymbol: string = '$'
): Promise<string> => {
  try {
    const currency = await getUserCurrency(userId);
    if (currency) {
      return CurrencyService.formatCurrency(amount, currency);
    }
    
    // Fallback formatting
    return `${fallbackSymbol}${amount.toLocaleString()}`;
  } catch (error) {
    console.error('Error formatting amount with user currency:', error);
    return `${fallbackSymbol}${amount.toLocaleString()}`;
  }
};
