import { supabase } from '../lib/supabase';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchange_rate_to_usd: number;
  created_at: string;
  updated_at: string;
}

export class CurrencyService {
  // Get all currencies
  static async getAllCurrencies(): Promise<Currency[]> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  // Get currency by ID
  static async getCurrencyById(currencyId: string): Promise<Currency | null> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('id', currencyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching currency:', error);
      return null;
    }
  }

  // Get currency by code
  static async getCurrencyByCode(code: string): Promise<Currency | null> {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching currency by code:', error);
      return null;
    }
  }

  // Convert amount from one currency to another
  static async convertCurrency(
    amount: number,
    fromCurrencyId: string,
    toCurrencyId: string
  ): Promise<number> {
    try {
      // If same currency, return original amount
      if (fromCurrencyId === toCurrencyId) {
        return amount;
      }

      // Get both currencies
      const [fromCurrency, toCurrency] = await Promise.all([
        this.getCurrencyById(fromCurrencyId),
        this.getCurrencyById(toCurrencyId)
      ]);

      if (!fromCurrency || !toCurrency) {
        console.warn('Currency not found, returning original amount');
        return amount;
      }

      // Convert to USD first, then to target currency
      const usdAmount = amount / fromCurrency.exchange_rate_to_usd;
      const convertedAmount = usdAmount * toCurrency.exchange_rate_to_usd;

      return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount; // Return original amount on error
    }
  }

  // Convert amount to USD
  static async convertToUSD(amount: number, fromCurrencyId: string): Promise<number> {
    try {
      const fromCurrency = await this.getCurrencyById(fromCurrencyId);
      if (!fromCurrency) {
        console.warn('Currency not found, returning original amount');
        return amount;
      }

      return amount / fromCurrency.exchange_rate_to_usd;
    } catch (error) {
      console.error('Error converting to USD:', error);
      return amount;
    }
  }

  // Convert amount from USD
  static async convertFromUSD(usdAmount: number, toCurrencyId: string): Promise<number> {
    try {
      const toCurrency = await this.getCurrencyById(toCurrencyId);
      if (!toCurrency) {
        console.warn('Currency not found, returning USD amount');
        return usdAmount;
      }

      return usdAmount * toCurrency.exchange_rate_to_usd;
    } catch (error) {
      console.error('Error converting from USD:', error);
      return usdAmount;
    }
  }

  // Get user's preferred currency
  static async getUserCurrency(userId: string): Promise<Currency | null> {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('currency_id')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (user?.currency_id) {
        return await this.getCurrencyById(user.currency_id);
      }

      return null;
    } catch (error) {
      console.error('Error fetching user currency:', error);
      return null;
    }
  }

  // Format currency amount with symbol
  static formatCurrency(amount: number, currency: Currency): string {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'SGD': 'S$',
      'HKD': 'HK$',
      'INR': '₹',
      'KRW': '₩',
      'THB': '฿',
      'AED': 'د.إ',
      'BRL': 'R$',
      'ARS': '$',
      'PEN': 'S/',
      'ZAR': 'R',
      'MAD': 'د.م.',
      'EGP': '£'
    };

    const symbol = symbols[currency.code] || currency.symbol || currency.code;
    
    // Special formatting for certain currencies
    if (currency.code === 'JPY' || currency.code === 'KRW') {
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  }
}
