import Logo from "../../../assets/logo/logo.svg";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useUserQuery } from "../../../queries/user.query.ts";
import LogoutIcon from "../../../assets/icons/logout.svg";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";

const ProfileNav = () => {
  const navigate = useNavigate();
  const { userProfileData, loadingUserProfile } = useUserQuery();
  
  const [openLogoutDropdown, setOpenLogoutDropdown] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.HOMEPAGE })
  }

  return (
    <div className={`flex items-center xl:gap-7`}>
      <div className={`gap-3 items-center flex`}>
        <h2 className={`text-lg text-accent1 font-semibold hidden xl:block`}>
          Hello,{" "}
          {!loadingUserProfile &&
            userProfileData?.profile?.firstName &&
            userProfileData?.profile.firstName}
        </h2>
        <div className={`w-9 h-9 rounded-full`}>
          <img 
            src={userProfileData?.profile?.profileImg || Logo} 
            alt="Profile" 
            className={`w-full h-full object-cover rounded-full`}
            onError={(e) => {
              // Fallback to default image if profile image fails to load
              const target = e.target as HTMLImageElement;
              if (target.src !== Logo) {
                target.src = Logo;
              }
            }}
          />
        </div>

        <div className={`relative`}>
          {openLogoutDropdown ? (
            <ChevronUp
              className={`w-5 h-5`}
              onClick={() => setOpenLogoutDropdown(false)}
            />
          ) : (
            <ChevronDown
              className={`w-5 h-5`}
              onClick={() => setOpenLogoutDropdown(true)}
            />
          )}

          {openLogoutDropdown && (
            <div
              className={`bg-greyBg rounded-xl text-lg font-medium absolute top-10 
                            shadow-xl right-0 space-y-3 py-5 px-4 min-w-[200px] z-50`}
            >
              <div>
                <a href={ROUTES.PROFILE}>Profile</a>
              </div>

              <div className={`flex items-center gap-2`} onClick={handleLogout}>
                <img src={LogoutIcon} className={`w-5 h-5`} />
                <button type={`button`} className={`cursor-pointer text-red`}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileNav;
