import type { UserBankAccountResponse } from "../../../types/response.payload.types.ts";
import {Fragment} from "react";
import BankAccountCard from "./BankAccountCard.tsx";

interface ProfileBankDetailsSectionProps {
  banks: UserBankAccountResponse[] | undefined;
  makeBankAccountDefault: (id: string) => void;
  handleDeleteBank: (id: string) => void;
  createNewBankModal: () => void;
  onEditBankAccount: (account: UserBankAccountResponse) => void;
}

const ProfileBankDetailsSection = ({ banks, makeBankAccountDefault, handleDeleteBank, onEditBankAccount }: ProfileBankDetailsSectionProps) => {
  const canDelete = (banks?.length ?? 0) > 1;

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
              onEdit={onEditBankAccount}
              canDelete={canDelete}
            />
          ))}
      </div>
    </Fragment>
  )
}

export default ProfileBankDetailsSection;
