import { CustomInput } from "../../global/CustomInput.tsx";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  handleFieldChange: (field: 'firstName' | 'lastName' | 'phoneNumber', value: string) => void;
}

export default function ProfilePersonalInfoSection({ firstName, lastName, email, phoneNumber, handleFieldChange }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg">Personal Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CustomInput
          label="First name"
          type="text"
          placeholder={firstName}
          onChange={(e) => handleFieldChange("firstName", e.target.value)}
        />
        
        <CustomInput
          label="Last name"
          type="text"
          placeholder={lastName}
          onChange={(e) => handleFieldChange("lastName", e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CustomInput
          label="Email"
          type="email"
          value={email}
          disabled
          readOnly
        />
        <CustomInput
          label="Phone number"
          type="tel"
          placeholder={phoneNumber}
          onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
        />
      </div>
    </div>
  );
}
