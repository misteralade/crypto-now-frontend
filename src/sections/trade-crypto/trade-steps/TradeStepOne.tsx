import TradeFormInput from '../TradeFormInput.tsx'
import CustomButton from "../../../components/global/Button.tsx";
import type {TradeType, TradeAdditionalInfoInterface} from "../../../types/trade.types.ts";
import SwapIcon from "../../../assets/icons/fluent_arrow-swap-20-regular.svg"
import {type FormEvent} from "react";
import TradeInputDropdown from "../TradeInputDropdown.tsx";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import {useDispatch} from "react-redux";
import { setInitiateTransactionField } from '../../../redux/transaction.slice.ts';

interface TradeStepOneProps {
  token: string;
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
}

export default function TradeStepOne({setAmountToBuy, numberOfToken, setNumberOfToken, amountToBuy,selectedCurrency, setSelectedCurrency, setSelectedToken,selectedToken, tradeType, handleProceedToPayment, orderDetails, availableCurrencies, availableTokens}: TradeStepOneProps) {
  const dispatch = useDispatch();
  
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
        <div className="space-y-2">
          {/*Token*/}
          <div className={``}>
            <TradeFormInput
              name={`${tradeType === "sell" ? "token": "currency"}`}
              label={`enter amount`}
              value={`${tradeType === "sell" ? numberOfToken : amountToBuy}`}
              onInputChange={tradeType === "sell" ? setNumberOfToken: setAmountToBuy}
              tradeType={tradeType}
              isReadOnly={false}
            >
              {tradeType === "sell" ?
                <TradeInputDropdown currentValue={selectedToken} setCurrentValue={handleSelectedToken} items={availableTokens} /> :
                <TradeInputDropdown currentValue={selectedCurrency} setCurrentValue={handleSelectedCurrency} items={availableCurrencies} />
              }
            </TradeFormInput>
          </div>
          
          <img src={SwapIcon} alt="Swap icon" className={`block mx-auto`}/>
          
          {/*Currency*/}
          <div className={``}>
            <TradeFormInput
              name={`${tradeType === "sell" ? "currency": "token"}`}
              label={`You will receive`}
              value={`${tradeType === "sell" ? amountToBuy : numberOfToken}`}
              isReadOnly={true}
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
          buttonText="Proceed to payment"
          type="submit"
          disabled={submitInvalid}
        />
      </div>
    </form>
  )
}