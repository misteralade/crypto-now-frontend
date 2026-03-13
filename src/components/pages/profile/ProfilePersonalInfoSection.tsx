import { useState, useRef, type ChangeEvent } from "react";
import { Input } from "@material-tailwind/react";
import { useUploadQuery } from "../../../queries/upload.query.ts";
import momentClient from "../../../lib/moment.ts";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob?: string;
  profileImg?: string;
  handleFieldChange: (field: 'firstName' | 'lastName' | 'phoneNumber' | 'dob' | 'profileImg', value: string) => void;
  handleRemoveProfilePicture: () => void;
}

const inputStyle = {
  borderRadius: "14px",
};

const ProfilePersonalInfoSection = ({
  firstName, lastName, email, phoneNumber, dob,
  profileImg, handleFieldChange, handleRemoveProfilePicture,
}: PersonalInfoSectionProps) => {
  const { uploadProfilePictureMutation } = useUploadQuery();
  const [imagePreview, setImagePreview] = useState<string | null>(profileImg || null);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState(phoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState(dob ?? "");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
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
    <div className="space-y-5">
      <h3 className="text-base font-bold" style={{ color: "#0E0F0C" }}>Personal Info</h3>

      {/* Avatar upload */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: "3px solid #F0F0F0" }} />
              <button type="button" onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#EB5757" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#6DD5FA,#2980B9,#948EEE,#575AE5)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <input ref={fileInputRef} type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold" style={{ color: "#948EEE" }}>
            {imagePreview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-[11px] mt-0.5" style={{ color: "#9A9A9A" }}>JPG, PNG or WebP · max 5 MB</p>
          {imageError && <p className="text-xs mt-1" style={{ color: "#EB5757" }}>{imageError}</p>}
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          value={firstName}
          disabled
          style={inputStyle}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Input
          label="Last name"
          value={lastName}
          disabled
          style={inputStyle}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>

      {/* Email */}
      <Input
        label="Email address"
        type="email"
        value={email}
        disabled
        style={inputStyle}
        crossOrigin={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />

      {/* Phone */}
      <Input
        label="Phone number"
        type="tel"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          handleFieldChange("phoneNumber", e.target.value);
        }}
        style={inputStyle}
        crossOrigin={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />

      {/* Date of birth */}
      <Input
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => {
          const iso = momentClient.toISOStringFromDate(new Date(e.target.value));
          setDateOfBirth(e.target.value);
          handleFieldChange("dob", iso);
        }}
        max={new Date().toISOString().split('T')[0]}
        style={inputStyle}
        crossOrigin={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </div>
  );
};

export default ProfilePersonalInfoSection;
