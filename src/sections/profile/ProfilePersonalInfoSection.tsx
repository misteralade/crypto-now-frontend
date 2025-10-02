import {CustomInput} from "../../components/global/CustomInput.tsx";

interface PersonalInfoSectionProps {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    onFirstNameChange: (value: string) => void
    onLastNameChange: (value: string) => void
    onEmailChange: (value: string) => void
    onPhoneNumberChange: (value: string) => void
}

export default function ProfilePersonalInfoSection({
                                                firstName,
                                                lastName,
                                                email,
                                                phoneNumber,
                                                onFirstNameChange,
                                                onLastNameChange,
                                                onEmailChange,
                                                onPhoneNumberChange,
                                            }: PersonalInfoSectionProps) {

    return (
        <div className="space-y-6">
            <h3 className="text-lg">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <CustomInput
                    label="First name"
                    type="text"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                />
                <CustomInput
                    label="Last name"
                    type="text"
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <CustomInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                />
                <CustomInput
                    label="Phone number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => onPhoneNumberChange(e.target.value)}
                />
            </div>
        </div>
    )
}
