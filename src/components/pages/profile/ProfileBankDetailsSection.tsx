import type { UserBankAccountResponse } from "../../../types/response.payload.types.ts";
import CustomButton from "../../global/Button.tsx";
import {Fragment} from "react";
import BankAccountCard from "./BankAccountCard.tsx";

interface ProfileBankDetailsSectionProps {
  banks: UserBankAccountResponse[] | undefined;
  makeBankAccountDefault: (id: string) => void;
  handleDeleteBank: (id: string) => void;
  createNewBankModal: () => void;
}

const ProfileBankDetailsSection = ({ banks, makeBankAccountDefault, handleDeleteBank, createNewBankModal }: ProfileBankDetailsSectionProps) => {
  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banks &&
          banks?.map((account, index) => (
            <BankAccountCard
              key={account.id}
              account={account}
              index={index}
              onMakeDefault={makeBankAccountDefault}
              onDelete={handleDeleteBank}
            />
          ))}
      </div>
      
      
      <div className="w-full flex items-center justify-center">
        <CustomButton
          buttonText="Add New Bank Account"
          onClick={createNewBankModal}
        />
      </div>
    </Fragment>
  )
}

export default ProfileBankDetailsSection;
