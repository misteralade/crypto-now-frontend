import CustomButton from "../../components/global/Button.tsx";
interface ProfileSecuritySettingsSectionProps {
    onEnableTwoFactor: () => void
    onChangePassword: () => void
}

export default function ProfileSecuritySettingsSection({ onEnableTwoFactor, onChangePassword }: ProfileSecuritySettingsSectionProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Security settings</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-5 py-2">
                    <span className="text-base text-gray-900">Two-factor authentication</span>
                    <CustomButton buttonText={`Enable`} onClick={onEnableTwoFactor} />
                </div>
                <button onClick={onChangePassword} className="text-lg text-primary transition-colors">
                    Change password
                </button>
            </div>
        </div>
    )
}
