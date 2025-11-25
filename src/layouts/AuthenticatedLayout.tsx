import {Fragment, type ReactNode} from "react";
import Navbar from "../components/global/navbar/Navbar.tsx";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <Fragment>
      <div className={`space-y-10 md:space-y-20 pb-14`}>
        <Navbar />
        
        {children}
      </div>
    </Fragment>
  )
}

export default AuthenticatedLayout;
