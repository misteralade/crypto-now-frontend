import CopyAccountDetails from "./CopyAccountDetails.tsx";
import type {ReactNode} from "react";

interface TradeAdditionalInfoProps {
  heading: string;
  additionalInfo: {
    title: string;
    value: string | ReactNode;
  }[];
}

export default function TradeAdditionalInfo ({ heading, additionalInfo = [] }: TradeAdditionalInfoProps) {

  const isCopyableField = (title: string): boolean => {
    const lowerTitle = title.toLowerCase();
    return lowerTitle.includes('wallet address') ||
      lowerTitle.includes('account number') ||
      lowerTitle.includes('bank account number');
  };

  return(
    <div className={`bg-formGroupBg rounded-lg space-y-5 p-5 border border-border`}>
      <h2 className={`text-sm text-grey2 font-semibold uppercase`}>{heading}</h2>

      <div className={`space-y-2`}>
        {additionalInfo.map((item, index) => (
          <div key={index} className={`flex ${typeof item.value === 'string' ? "items-center": "md:items-end items-center"} gap-5 justify-between `} >
            <h3 className={`text-grey2 font-medium`}>{item.title}</h3>

            {/* Render copyable fields with CopyAccountDetails */}
            {isCopyableField(item.title) && typeof item.value === 'string' ? (
              <CopyAccountDetails accountNumber={item.value} />
            ) : (
              /* Render regular fields */
              typeof item.value === 'string' ?
                <p className={`text-black overflow-hidden whitespace-nowrap text-ellipsis`}>{item.value}</p> :
                item.value
            )}
          </div>
        ))}
      </div>
    </div>
  )
}