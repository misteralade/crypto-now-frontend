import Logo from "../../../assets/logo/favicon.svg";
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
        <div className={`w-10 h-10 flex items-center justify-center rounded-full p-1 bg-[#15165A]`}>
          <img 
            src={userProfileData?.profile?.profileImg || Logo} 
            alt="Profile" 
            className={`w-full h-full rounded-full`}
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
              className={`bg-greyBg rounded-xl text-lg font-medium absolute top-10 shadow-xl right-0 space-y-3 py-5 px-4 min-w-[200px] z-50 gap-3`}
            >
              <div onClick={() => navigate({ to: ROUTES.PROFILE })} className="hover:cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                <button type={`button`} className={`cursor-pointer text-lg font-medium`}>
                  Profile
                </button>
              </div>

              <div className={`flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100 rounded-lg p-2`} onClick={handleLogout}>
                <img src={LogoutIcon} className={`w-5 h-5`} />
                <button type={`button`} className={`text-red`}>
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
