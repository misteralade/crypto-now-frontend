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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
    </Fragment>
  )
}

export default ProfileBankDetailsSection;
