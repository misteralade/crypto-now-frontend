import { Link } from "@tanstack/react-router";
import AuthBg from "../assets/backgrounds/auth-bg.webp";
import Logo from "../assets/logo/logo.svg";
import { motion } from "framer-motion";

const AuthLayout = ({ children, layoutType }: { children: any; layoutType: number; }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Logo - Global position at top left of the screen */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-8 left-8 md:left-12 xl:left-16 z-50 pointer-events-auto"
      >
        <Link to="/">
          <img src={Logo} alt="CryptoNow Logo" className="h-8 w-auto" />
        </Link>
      </motion.div>

      {layoutType === 1 ? (
        <div className="w-full min-h-screen flex items-center justify-center p-8 bg-white">
          <div className="max-w-[1200px] w-full mx-auto relative mt-16 lg:mt-0">
            {/* Centered content area */}
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
          <div className="flex-1 flex flex-col justify-center items-center px-8 py-20 bg-white relative">
            <div className="w-full max-w-[400px] mt-12 lg:mt-0">
              {/* Form content passed as children */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
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
