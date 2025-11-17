import { CustomInput } from "../../global/CustomInput.tsx";
import {useState, useRef, type ChangeEvent} from "react";
import {useUploadQuery} from "../../../queries/upload.query.ts";
import momentClient from "../../../lib/moment.ts";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob?: string;
  profileImg?: string;
  handleFieldChange: (field: 'firstName' | 'lastName' | 'phoneNumber' | 'dob' | 'profileImg', value: string) => void;
}

export default function ProfilePersonalInfoSection({ firstName, lastName, email, phoneNumber, dob, profileImg, handleFieldChange }: PersonalInfoSectionProps) {
  const { uploadProfilePictureMutation } = useUploadQuery();
  const [imagePreview, setImagePreview] = useState<string | null>(profileImg || null);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }
    
    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return;
    }
    
    // Upload the profile image
    const formData = new FormData();
    formData.append("file", file);
    
    const url = await uploadProfilePictureMutation.mutateAsync(formData);
    handleFieldChange("profileImg", url);
    
    // Create preview and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError("");
    handleFieldChange("profileImg", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Personal Info</h3>
      
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-100">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-[#03034D] text-sm font-semibold transition-opacity hover:opacity-80 hover:cursor-pointer"
          >
            {imagePreview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
          {imageError && (
            <p className="text-sm text-red-500 mt-2">{imageError}</p>
          )}
        </div>
      </div>
      
      {/* Name Fields */}
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
      
      {/* Email and Phone */}
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
      
      {/* Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CustomInput
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => {
            const isoString = momentClient.toISOStringFromDate(new Date(e.target.value));
            handleFieldChange("dob", isoString);
          }}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
}