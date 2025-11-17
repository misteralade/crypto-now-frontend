import CustomButton from "../../global/Button.tsx";
interface ProfileSecuritySettingsSectionProps {
  isTwoFactorEnabled: boolean;
  onEnableTwoFactor: () => void;
  onChangePassword: () => void;
}

const ProfileSecuritySettingsSection = ({ isTwoFactorEnabled, onEnableTwoFactor, onChangePassword }: ProfileSecuritySettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Security settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-5 py-2">
          <span className="text-base text-gray-900">Two-factor authentication</span>
          <CustomButton className={`${isTwoFactorEnabled ? `bg-red-600 hover:bg-red-900`: ''}`} buttonText={`${isTwoFactorEnabled ? 'Disable' : 'Enable'}`} onClick={onEnableTwoFactor} />
        </div>
        
        <button onClick={onChangePassword} className="text-lg text-primary transition-colors hover:cursor-pointer">
          Change password
        </button>
      </div>
    </div>
  )
}

export default ProfileSecuritySettingsSection
