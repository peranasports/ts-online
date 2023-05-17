import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PeranaSportsLogo from "../../assets/PeranaSports_square.png";
import TennisStatsLogo from "../../assets/logo512.png";
import { Link } from "react-router-dom";
import PropsType from "prop-types";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { getAuth } from "firebase/auth";

function Navbar({ title }) {
  const { loggedIn, currentUser, checkingStatus } = useAuthStatus();
  const navigate = useNavigate();

  const doLogout = () => {
    var auth = getAuth();
    auth.signOut();
    navigate("/sign-in");
  };

  const getID = () => {
    return currentUser.email;
  };

  useEffect(() => {}, [loggedIn]);

  return (
    <nav className="navbar shadow-lg bg-neutral text-neutral-content">
      <div className="container mx-auto max-h-10">
        <div className="flex px-2 mx-2 space-x-4">
          <img className="pt-1 h-10 w-10" alt="" src={TennisStatsLogo} />
          <Link to="/" className="text-2xl pt-1 font-bold align-middle">
            {title}
          </Link>
        </div>
        <div className="flex-1 px2 mt-6">
          <div className="flex justify-end">
            <Link to="/" className="btn btn-ghost btn-sm rounded-btn">
              Home
            </Link>
            <Link to="/about" className="btn btn-ghost btn-sm rounded-btn">
              About
            </Link>
          </div>
          {currentUser === null ? (
            <></>
          ) : (
            <div className="flex justify-end">
              <p className="mr-4 mt-1 text-md font-medium">{getID()}</p>
              <button
                className="logoutButton mb-8 btn btn-sm"
                onClick={doLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  title: "TennisStats",
};

Navbar.PropsType = {
  title: PropsType.string,
};
export default Navbar;
