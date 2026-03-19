import {Fragment, useEffect, useState} from "react";
import type { SupportedCryptoOrCurrencyResponse } from "../../../../types/response.payload.types";
import type {UserCreateCryptoWalletRequestPayload} from "../../../../types/request.payload.types.ts";
import {X} from "lucide-react";
import BankSelector from "../../../global/BankSelector.tsx";
import { Input } from "@material-tailwind/react";
import {CustomSelect} from "../../../global/CustomSelect.tsx";
import {cryptoNetworkTypes} from "../../../../util/constants.util.ts";
import { walletAddressRegex } from "../../../../util/regex.util.ts";

interface NewCryptoWalletModalProps {
  isOpen: boolean;
  supportedCryptoWallet: SupportedCryptoOrCurrencyResponse[];
  selectedWalletId: string;
  onClose: () => void;
  onSubmit: () => void;
  handleChangeField: (field: keyof UserCreateCryptoWalletRequestPayload, value: any) => void;
}

const NewCryptoWalletModal = ({ isOpen, supportedCryptoWallet, selectedWalletId, onClose, onSubmit, handleChangeField }: NewCryptoWalletModalProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletAddressError, setWalletAddressError] = useState('');
  const [network, setNetwork] = useState('')
  const [walletLabel, setWalletLabel] = useState('')
  
  const selectedOption = supportedCryptoWallet && supportedCryptoWallet?.find((opt) => opt.id === selectedWalletId);

  const validateWalletAddress = (address: string) => {
    if (!address || address.trim() === "") {
      setWalletAddressError("Wallet address is required");
      return false;
    }
    
    const trimmedAddress = address.trim();
    if (!walletAddressRegex.test(trimmedAddress)) {
      setWalletAddressError("Please enter a valid wallet address");
      return false;
    }
    
    setWalletAddressError("");
    return true;
  }

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    handleChangeField("walletAddress", value);
    
    // Only validate if user has started typing (not empty)
    if (value.trim() !== "") {
      validateWalletAddress(value);
    } else {
      setWalletAddressError("");
    }
  }

  const handleWalletAddressBlur = () => {
    validateWalletAddress(walletAddress);
  }
  
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <Fragment>
      <div className="z-50 fixed inset-0 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
        
        {/* Modal */}
        <div className="max-w-2xl relative bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-8 md:p-10">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h2 className="text-3xl font-semibold text-titleColor">Create New Wallet</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6"/>
              </button>
            </div>
            
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/*Crypto Currency Selector*/}
                <BankSelector
                  label="Crypto"
                  options={supportedCryptoWallet}
                  value={selectedWalletId}
                  onValueChange={(value) => {
                    handleChangeField("cryptoId", value)
                  }}
                />
                
                {/*Network Type*/}
                <CustomSelect
                  label="Network type"
                  placeholder="Select network"
                  options={cryptoNetworkTypes}
                  value={network}
                  onValueChange={(value) => {
                    setNetwork(value)
                    handleChangeField("network", value)
                  }}
                />
                
                {/*Wallet Nickname*/}
                <Input
                  label="Wallet Nickname"
                  type="text"
                  value={walletLabel}
                  onChange={(e) => {
                    setWalletLabel(e.target.value);
                    handleChangeField("walletLabel", e.target.value);
                  }}
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                />

                {/*Wallet Address*/}
                <div>
                  <Input
                    label="Wallet Address"
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletAddressChange}
                    onBlur={handleWalletAddressBlur}
                    error={!!walletAddressError}
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  />
                  {walletAddressError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{walletAddressError}</p>
                  )}
                </div>
                
                
                {/*Make Primary Wallet*/}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="isActive"
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => handleChangeField("isPrimary", e.target.checked)}
                      defaultChecked={false}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
                  </label>
                  <span className="text-[16px] font-semibold text-[#454745]">Make Primary {selectedOption && `for ${selectedOption.symbol}`} </span>
                </div>
                
                {/*Make Proceed*/}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleChangeField("isVerified", e.target.checked)}
                    defaultChecked={false}
                    className="h-4 w-4 text-primary border-gray-300 rounded hover:cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    I confirm I own this wallet
                  </label>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-full text-gray-700 font-semibold text-base hover:bg-gray-100 transition-colors hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 h-12 rounded-full font-semibold text-base bg-[#1a1f5c] transition-colors text-white disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#151842] hover:cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NewCryptoWalletModal;