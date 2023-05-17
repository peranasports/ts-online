import React from "react";
import { useAuthStatus } from "../components/hooks/useAuthStatus";
import SignIn from "./SignIn";
import ImportPSTS from "./ImportPSTS";

function Home() {
  const { loggedIn, currentUser, checkingStatus } = useAuthStatus();

  return <>{currentUser === null ? <SignIn /> : <ImportPSTS />}</>;
}

export default Home;
