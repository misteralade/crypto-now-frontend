import { Link } from "@tanstack/react-router";
import AuthBg from "../assets/backgrounds/auth-bg.webp";
import Logo from "../assets/logo/logo.svg";
import { motion } from "framer-motion";

const AuthLayout = ({ children, layoutType }: { children: any; layoutType: number; }) => {
  return (
    <div className="min-h-screen flex">
      {layoutType === 1 ? (
        <div className="w-full max-lg:px-8">
          <div className="max-w-[1200px] mx-auto bg-white relative">
            {/* Logo at top left - positioned same as other layout */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link className="absolute top-8 left-[0px]" to="/">
                <img src={Logo} alt="CryptoNow Logo" className="h-8" />
              </Link>
            </motion.div>
          </div>

          {/* Centered content area */}
          <div className="w-full flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white relative">
            <div className="w-full max-w-[400px] max-xl:mt-20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link className="absolute top-8" to="/">
                  <img src={Logo} alt="CryptoNow Logo" className="h-8" />
                </Link>
              </motion.div>

              {/* Form content passed as children */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:block lg:w-[53%] xl:w-[55%] flex-shrink-0"
          >
            <div className="h-full w-full relative overflow-hidden p-4">
              <img
                className="w-full h-full object-cover object-center rounded-2xl shadow-2xl"
                src={AuthBg}
                alt="Server room with blue lighting"
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default AuthLayout;
