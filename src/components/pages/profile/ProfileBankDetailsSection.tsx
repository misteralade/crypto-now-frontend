import type { UserBankAccountResponse } from "../../../types/response.payload.types.ts";
import {Fragment} from "react";
import BankAccountCard from "./BankAccountCard.tsx";

interface ProfileBankDetailsSectionProps {
  banks: UserBankAccountResponse[] | undefined;
  makeBankAccountDefault: (id: string) => void;
  handleDeleteBank: (id: string) => void;
  createNewBankModal: () => void;
}

const ProfileBankDetailsSection = ({ banks, makeBankAccountDefault, handleDeleteBank }: ProfileBankDetailsSectionProps) => {
  return (
    <Fragment>
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-start">
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
