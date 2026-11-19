import { useState, useRef, type ChangeEvent } from "react";
import { useUploadQuery } from "../../../queries/upload.query.ts";
import momentClient from "../../../lib/moment.ts";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob?: string;
  profileImg?: string;
  handleFieldChange: (
    field: "firstName" | "lastName" | "phoneNumber" | "dob" | "profileImg",
    value: string,
  ) => void;
  handleRemoveProfilePicture: () => void;
}

// Custom input component matching theme
const CustomInput = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  max,
}: {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  max?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        max={max}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full h-14 px-4 pt-4 pb-2
          rounded-2xl
          border transition-all
          bg-white
          text-sm text-[#0E0F0C]
          placeholder-transparent
          focus:outline-none
          ${disabled 
            ? 'border-[#EEEEEE] bg-[#FAFAFA] text-[#9A9A9A] cursor-not-allowed' 
            : isFocused 
              ? 'border-[#03034D] ring-2 ring-[#03034D]/10' 
              : 'border-[#EEEEEE] hover:border-[#BDBDBD]'
          }
        `}
        placeholder={label}
      />
      <label
        className={`
          absolute left-4 transition-all pointer-events-none
          ${hasValue || isFocused
            ? 'top-2 text-[10px] font-semibold'
            : 'top-1/2 -translate-y-1/2 text-sm'
          }
          ${disabled
            ? 'text-[#BDBDBD]'
            : isFocused
              ? 'text-[#03034D]'
              : 'text-[#9A9A9A]'
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

const ProfilePersonalInfoSection = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  dob,
  profileImg,
  handleFieldChange,
  handleRemoveProfilePicture,
}: PersonalInfoSectionProps) => {
  const { uploadProfilePictureMutation } = useUploadQuery();
  const [imagePreview, setImagePreview] = useState<string | null>(
    profileImg || null,
  );
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState(phoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState(dob ?? "");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const url = await uploadProfilePictureMutation.mutateAsync(formData);
    handleFieldChange("profileImg", url);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleRemoveProfilePicture();
    setImagePreview(null);
    setImageError("");
    handleFieldChange("profileImg", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-[#0E0F0C]">
        Personal Info
      </h3>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-3 border-[#F0F0F0]"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-[#EB5757] hover:bg-[#d84545] transition-colors"
                aria-label="Remove profile picture"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg,#6DD5FA,#2980B9,#948EEE,#575AE5)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold text-[#948EEE] hover:text-[#7c7ed9] transition-colors"
          >
            {imagePreview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-[11px] mt-0.5 text-[#9A9A9A]">
            JPG, PNG or WebP · max 5 MB
          </p>
          {imageError && (
            <p className="text-xs mt-1 text-[#EB5757]">
              {imageError}
            </p>
          )}
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInput
          label="First name"
          value={firstName}
          disabled
        />
        <CustomInput
          label="Last name"
          value={lastName}
          disabled
        />
      </div>

      {/* Email */}
      <CustomInput
        label="Email address"
        type="email"
        value={email}
        disabled
      />

      {/* Phone */}
      <CustomInput
        label="Phone number"
        type="tel"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          handleFieldChange("phoneNumber", e.target.value);
        }}
      />

      {/* Date of birth */}
      <CustomInput
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => {
          const iso = momentClient.toISOStringFromDate(
            new Date(e.target.value),
          );
          setDateOfBirth(e.target.value);
          handleFieldChange("dob", iso);
        }}
        max={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
};

export default ProfilePersonalInfoSection;
