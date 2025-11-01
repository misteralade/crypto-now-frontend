import type {SupportedCryptoOrCurrencyResponse} from "../../types/response.payload.types.ts";

interface CurrencySelectorProps {
  currencies: Array<SupportedCryptoOrCurrencyResponse> | undefined;
  selectedCurrency: SupportedCryptoOrCurrencyResponse | undefined;
  handleSelectedCurrencyIdChange: (currencyId: string) => void;
}

const CurrencySelector = ({ currencies, selectedCurrency, handleSelectedCurrencyIdChange }: CurrencySelectorProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg bg-white">
      {/* Logo */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
        <img
          src={selectedCurrency?.logoUrl || ''}
          alt={selectedCurrency?.logoUrl}
          className="w-5 h-5 object-contain"
        />
      </div>
      
      {/* Dropdown */}
      <select
        className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer"
        value={selectedCurrency ? selectedCurrency.id : ''}
        onChange={(e) => handleSelectedCurrencyIdChange(e.target.value)}
      >
        {currencies && currencies.map((currency) => (
          <option value={currency.id} key={currency.id}>{currency.code || currency.symbol}</option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;