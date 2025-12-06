import type {UserCryptoWalletResponse} from "../../../types/response.payload.types.ts";
import {Fragment} from "react";
import CustomButton from "../../global/Button.tsx";
import CryptoWalletCard from "./CryptoWalletCard.tsx";

interface ProfileAddressDetailsSectionProps {
  wallets: UserCryptoWalletResponse[] | undefined;
  createNewWalletModal: () => void;
  makePrimaryWallet: (id: string) => void;
  deleteWallet: (id: string) => void;
}

const ProfileAddressDetailsSection = ({ wallets, createNewWalletModal, makePrimaryWallet, deleteWallet  }: ProfileAddressDetailsSectionProps) => {
  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets &&
          wallets?.map((wallet, index) => (
            <CryptoWalletCard
              id={wallet.id}
              symbol={wallet.cryptocurrency?.symbol || ''}
              network={wallet.network}
              walletLabel={wallet.walletLabel || ''}
              isPrimary={wallet.isPrimary}
              isVerified={wallet.isVerified}
              walletAddress={wallet.walletAddress}
              createdAt={wallet.createdAt}
              index={index}
              onMakePrimary={makePrimaryWallet}
              onDelete={deleteWallet}
            />
          ))}
      </div>
      
      <div className="w-full flex items-center justify-center">
        <CustomButton
          buttonText="Add New Wallet"
          onClick={createNewWalletModal}
        />
      </div>
    </Fragment>
  )
}

export default ProfileAddressDetailsSection;