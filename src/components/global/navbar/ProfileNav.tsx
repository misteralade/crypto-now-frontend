import NotificationsIcon from "../../../assets/icons/ri_notification-line.svg";
import AlertIcon from "../../../assets/icons/Ellipse_12.svg";
import TestDP from "../../../assets/icons/male_11.svg"
import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";
import {handleLogout} from "../../../util/utils.ts";
import {useUserQuery} from "../../../queries/user.query.ts";
import LogoutIcon from "../../../assets/icons/logout.svg"

export default function ProfileNav() {
    const {userProfileData, loadingUserProfile} = useUserQuery();

    const notificationsCount: number = 1;
    const [openLogoutDropdown, setOpenLogoutDropdown] = useState(false);

    return (
        <div className={`flex items-center xl:gap-7`}>
            <div
                className={`md:w-11 md:h-11 w-6 h-6 bg-altWhite rounded-full flex items-center justify-center relative -mt-2 xl:mt-0`}>
                <img src={NotificationsIcon} className={`md:w-6 md:h-6 w-4 h-4`}/>

                {notificationsCount > 0 && (
                    <div className={`absolute md:top-3 md:right-3 top-1 right-1`}>
                        <img src={AlertIcon} className={`w-2 h-2`}/>
                    </div>
                )}
            </div>

            <div className={`gap-3 items-center hidden xl:flex`}>
                <h2 className={`text-lg text-accent1 font-semibold`}>Hello, {!loadingUserProfile && userProfileData?.profile?.firstName}</h2>
                <div className={`w-9 h-9 rounded-full`}>
                    <img src={TestDP} className={`w-full h-full`}/>
                </div>

                <div className={`relative`}>
                    {openLogoutDropdown ?
                        <ChevronUp className={`w-5 h-5`} onClick={() => setOpenLogoutDropdown(false)}/>
                        :
                        <ChevronDown className={`w-5 h-5`} onClick={() => setOpenLogoutDropdown(true)}/>
                    }

                    {openLogoutDropdown &&
                        <div
                            className={`bg-greyBg rounded-xl text-lg font-medium absolute top-10 
                            shadow-xl right-0 space-y-3 py-5 px-4 min-w-[200px] z-50`}>
                            <div>
                                <a href={`/dashboard/profile`}>Profile</a>
                            </div>


                            <div className={`flex items-center gap-2`} onClick={handleLogout}>
                                <img src={LogoutIcon} className={`w-5 h-5`}/>
                                <button type={`button`} className={`cursor-pointer text-red`}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}