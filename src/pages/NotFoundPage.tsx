import { Fragment } from "react";
import { useNavigate } from "@tanstack/react-router";
import Navbar from "../components/global/navbar/Navbar.tsx";
import Footer from "../components/global/Footer.tsx";
import CustomButton from "../components/global/Button.tsx";
import { ROUTES } from "../util/constants.util.ts";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Navbar />
      <main className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl md:text-[180px] font-bold text-[#03034D] leading-none mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0E0F0C] mb-4">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-[#454745] font-normal max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <CustomButton
              onClick={() => navigate({ to: ROUTES.HOMEPAGE })}
              buttonText="Go Back Home"
            />
            <CustomButton
              variant="link"
              to={ROUTES.CONTACT}
              buttonText="Contact Support"
            />
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
};

export default NotFoundPage;

