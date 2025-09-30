import { useState, useEffect } from "react"
import {useUserQuery} from "../../queries/user.query.ts";
import {useBankQuery} from "../../queries/bank.query.ts";
import CustomLoader from "../../components/global/Loader.tsx";
import ProfilePersonalInfoSection from "./ProfilePersonalInfoSection.tsx";
import ProfileBankDetailsSection from "./ProfileBankDetailsSection.tsx";
import ProfileAddressDetailsSection from "./ProfileAddressDetailsSection.tsx";

export default function ProfileContent(){
    const {userProfileData,  loadingUserProfile} = useUserQuery();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const { allBanks, loadingAllBanks } = useBankQuery();
    const [selectedBank, setSelectedBank] = useState("")
    const [accountHolderName, setAccountHolderName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")

    const [selectedCoin, setSelectedCoin] = useState("")
    const [walletAddress, setWalletAddress] = useState("")
    const [selectedNetwork, setSelectedNetwork] = useState("")

    const handleAddAddress = () => {
        console.log("Add address clicked")
        // Implement add address logic here
    }

    useEffect(() => {
        if(!loadingUserProfile){
            setFirstName(userProfileData?.profile?.firstName || "")
            setLastName(userProfileData?.profile?.lastName || "")
            setEmail(userProfileData?.email || "")
            setPhoneNumber(userProfileData?.profile?.phoneNumber || "")
        }
    }, [loadingUserProfile]);

    return (
        <div className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto md:-mt-10 px-3 md:px-0 space-y-10 ">
            <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-titleColor">Account settings</h1>

                {loadingUserProfile ? (
                    <div className={`w-full min-h-[60vh] flex items-center justify-center`}>
                        <CustomLoader />
                    </div>) :
                    (
                        <>
                            <ProfilePersonalInfoSection
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                                phoneNumber={phoneNumber}
                                onFirstNameChange={setFirstName}
                                onLastNameChange={setLastName}
                                onEmailChange={setEmail}
                                onPhoneNumberChange={setPhoneNumber}
                            />

                            <ProfileBankDetailsSection
                                selectedBank={selectedBank}
                                accountHolderName={accountHolderName}
                                accountNumber={accountNumber}
                                banks={!loadingAllBanks ? allBanks : []}
                                onBankChange={setSelectedBank}
                                onAccountHolderNameChange={setAccountHolderName}
                                onAccountNumberChange={setAccountNumber}
                            />

                            <ProfileAddressDetailsSection
                                selectedCoin={selectedCoin}
                                walletAddress={walletAddress}
                                selectedNetwork={selectedNetwork}
                                onCoinChange={setSelectedCoin}
                                onWalletAddressChange={setWalletAddress}
                                onNetworkChange={setSelectedNetwork}
                                onAddAddress={handleAddAddress}
                            />
                        </>
                    )}


            </div>
        </div>
    )
}