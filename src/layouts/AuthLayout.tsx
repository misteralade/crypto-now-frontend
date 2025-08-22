import { Link } from "@tanstack/react-router";
import AuthBg from "../assets/backgrounds/auth-bg.webp";
import Logo from "../assets/logo/logo.svg";

export default function AuthLayout({ children }: { children: any }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white relative">
        <div className="w-full max-w-[400px] max-xl:mt-20">
          <Link className="absolute top-8" to="/">
            <img src={Logo} alt="CryptoNow Logo" className="h-8" />
          </Link>

          {/* Form content passed as children */}
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-[53%] xl:w-[55%] flex-shrink-0">
        <div className="h-full w-full relative overflow-hidden p-4">
          <img
            className="w-full h-full object-cover object-center"
            src={AuthBg}
            alt="Server room with blue lighting"
          />
        </div>
      </div>
    </div>
  );
}
