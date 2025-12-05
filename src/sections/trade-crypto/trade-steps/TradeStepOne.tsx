import {useDispatch} from "react-redux";
import { ArrowUpDown } from 'lucide-react';
import TradeFormInput from '../TradeFormInput.tsx'
import CustomButton from "../../../components/global/Button.tsx";
import type {TradeType, TradeAdditionalInfoInterface} from "../../../types/trade.types.ts";
import {useState, type FormEvent} from "react";
import TradeInputDropdown from "../TradeInputDropdown.tsx";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import { setInitiateTransactionField } from '../../../redux/transaction.slice.ts';

interface TradeStepOneProps {
  currency: string;
  tradeType: TradeType;
  handleProceedToPayment: () => void
  orderDetails: TradeAdditionalInfoInterface[],
  selectedToken: SupportedCryptoOrCurrencyResponse | undefined,
  setSelectedToken: (token: SupportedCryptoOrCurrencyResponse) => void,
  selectedCurrency: SupportedCryptoOrCurrencyResponse | undefined,
  setSelectedCurrency: (currency: SupportedCryptoOrCurrencyResponse) => void
  numberOfToken: string | number;
  amountToBuy: string | number;
  setNumberOfToken: (token: string | number) => void;
  setAmountToBuy: (amountToBuy: string | number) => void;
  availableCurrencies: SupportedCryptoOrCurrencyResponse[];
  availableTokens: SupportedCryptoOrCurrencyResponse[];
  token: string;
  isInitiatingTrade: boolean;
  setActiveTab: (value: 'buy' | 'sell') => void;
  handleFocusNumberOfToken: () => void;
  handleFocusAmountToBuy: () => void;
  handleBlurNumberOfToken: () => void;
  handleBlurAmountToBuy: () => void;
}

const TradeStepOne = ({ setAmountToBuy, isInitiatingTrade, numberOfToken, setNumberOfToken, amountToBuy,selectedCurrency, setSelectedCurrency, setSelectedToken,selectedToken, tradeType, handleProceedToPayment, orderDetails, availableCurrencies, availableTokens, handleFocusNumberOfToken, handleFocusAmountToBuy, handleBlurNumberOfToken, handleBlurAmountToBuy }: TradeStepOneProps) => {
  const dispatch = useDispatch();

  const [switchAmountInputsSetup, setSwitchAmountInputsSetup] = useState<boolean>(false);

  const toggleAmountInputsSetup = () => setSwitchAmountInputsSetup(!switchAmountInputsSetup);
  
  const submitInvalid = numberOfToken === "" || amountToBuy === "";
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    handleProceedToPayment();
  }
  
  const handleSelectedToken = (token: SupportedCryptoOrCurrencyResponse) => {
    setSelectedToken(token);
    dispatch(setInitiateTransactionField({
      field: "tokenId",
      value: token.id
    }))
  }
  
  const handleSelectedCurrency = (currency: SupportedCryptoOrCurrencyResponse) => {
    setSelectedCurrency(currency);
    dispatch(setInitiateTransactionField({
      field: "currencyId",
      value: currency.id
    }))
  }
  
  return (
    <form className={`space-y-20`} onSubmit={handleSubmit}>
      {/*Inputs && Additional info*/}
      <div className="space-y-5">
        {/*Inputs*/}
        <div className={`space-y-2 flex items-center justify-center w-full ${switchAmountInputsSetup ? "flex-col" : "flex-col-reverse"}`}>
          {/*Token*/}
          <div className="w-full">
            <TradeFormInput
              name={`${tradeType === "sell" ? "token": "currency"}`}
              label={`enter amount`}
              value={`${tradeType === "sell" ? numberOfToken : amountToBuy}`}
              onInputChange={tradeType === "sell" ? setNumberOfToken: setAmountToBuy}
              onFocus={tradeType === "sell" ? handleFocusNumberOfToken : handleFocusAmountToBuy}
              onBlur={tradeType === "sell" ? handleBlurNumberOfToken : handleBlurAmountToBuy}
              tradeType={tradeType}
              isReadOnly={false}
            >
              {tradeType === "sell" ?
                <TradeInputDropdown currentValue={selectedToken} setCurrentValue={handleSelectedToken} items={availableTokens} /> :
                <TradeInputDropdown currentValue={selectedCurrency} setCurrentValue={handleSelectedCurrency} items={availableCurrencies} />
              }
            </TradeFormInput>
          </div>
          
          <div className="h-20 w-full flex items-center justify-center">
            <div
              className="p-2.5 rounded-full bg-[#948EEE] hover:cursor-pointer hover:bg-[#7b68ee] transition-all"
              onClick={toggleAmountInputsSetup}
            >
              <ArrowUpDown
                color="white"
                size={30}
                onClick={toggleAmountInputsSetup}
              />
            </div>
          </div>
          
          {/*Currency*/}
          <div className="w-full">
            <TradeFormInput
              name={`${tradeType === "sell" ? "currency": "token"}`}
              label={`You will receive`}
              value={`${tradeType === "sell" ? amountToBuy : numberOfToken}`}
              onInputChange={tradeType === "sell" ? setAmountToBuy : setNumberOfToken}
              onFocus={tradeType === "sell" ? handleFocusAmountToBuy : handleFocusNumberOfToken}
              onBlur={tradeType === "sell" ? handleBlurAmountToBuy : handleBlurNumberOfToken}
              isReadOnly={false}
              tradeType={tradeType}
            >
              {tradeType === "sell" ?
                <TradeInputDropdown currentValue={selectedCurrency} setCurrentValue={handleSelectedCurrency} items={availableCurrencies} />
                :
                <TradeInputDropdown currentValue={selectedToken} setCurrentValue={handleSelectedToken} items={availableTokens} />
              }
            </TradeFormInput>
          </div>
        </div>
        
        {/*Additional Info*/}
        <TradeAdditionalInfo heading={"Order details"} additionalInfo={orderDetails} />
      </div>
      
      <div className={`md:w-1/2 w-full mx-auto px-5 md:px-0`}>
        <CustomButton
          className="w-full"
          buttonText={isInitiatingTrade ? "Processing..." : "Proceed to payment"}
          type="submit"
          disabled={submitInvalid || isInitiatingTrade}
        />
      </div>
    </form>
  )
}

export default TradeStepOne;
