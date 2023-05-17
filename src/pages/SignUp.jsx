import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Icons
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  eyes,
} from "@heroicons/react/20/solid";

// Firebase Authentication
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";

import {
  setDoc,
  doc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";

// React Toastify
import { toast } from "react-toastify";
import { async } from "@firebase/util";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const checkIfCoach = async (email) => {
    try {
      const eRef = collection(db, "coaches");
      const q = query(eRef, where("email", "==", email));
      const querySnap = await getDocs(q);
      const cchs = [];
      querySnap.forEach((doc) => {
        var cch = doc.data();
        cch.uid = doc.id;
        cchs.push(cch);
      });
      return cchs.length === 1 ? cchs[0] : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const checkIfStudent = async (email) => {
    try {
      const eRef = collection(db, "students");
      const q = query(eRef, where("email", "==", email));
      const querySnap = await getDocs(q);
      const stds = [];
      querySnap.forEach((doc) => {
        var std = doc.data();
        std.uid = doc.id;
        stds.push(std);
      });
      return stds.length === 1 ? stds[0] : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const updateUserRecord = async (user, role, name, timestamp) => {
    try {
      const eRef = collection(db, "users");
      const q = query(eRef, where("email", "==", user.email));
      const querySnap = await getDocs(q);
      const usrs = [];
      querySnap.forEach((doc) => {
        return usrs.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      if (usrs.length > 0) {
        var usr = usrs[0].data;
        usr.uid = user.uid;
        usr.email = user.email;
        usr.role = role;
        usr.name = name;
        usr.timestamp = timestamp;
        await setDoc(doc(db, "users", usrs[0].id), usr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    var role = 0;
    var name = "";
    var student = null;
    const coach = await checkIfCoach(email);
    if (coach === null) {
      student = await checkIfStudent(email);
      if (student !== null) {
        role = 3;
        name = student.firstName + " " + student.lastName;
      }
    } else {
      role = 2;
      name = coach.firstName + " " + coach.lastName;
    }

    // if (role !== 0) {
      try {
        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        updateUserRecord(user, role, name, serverTimestamp());

        updateProfile(auth.currentUser, {
          displayName: name,
        });

        const formDataCopy = { ...formData };

        delete formDataCopy.password;

        formDataCopy.timestamp = serverTimestamp();

        // setDoc what updates to users collections
        // doc holds the configuration - user.uid the key
        // second parameter is the object to be saved
        await setDoc(doc(db, "users", user.uid), formDataCopy);
        toast.success("Signed up successfully");
        if (role === 2) {
          coach.userId = user.uid;
          await setDoc(doc(db, "coaches", coach.uid), coach);
          navigate("/coach", { state: coach.userId });
        } else if (role === 3) {
          student.userId = user.uid;
          await setDoc(doc(db, "students", student.uid), student);
          navigate("/student", { state: student.userId });
        }
      } catch (error) {
        toast.error("Error signing up\n" + error.message);
      }
    // } else {
    //   toast.error("Error signing up.\nPlease contact supports@peranasports.com.");
    // }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader mt-10 text-xl">Sign up</p>
        </header>

        <main>
          <form className=" max-w-md" onSubmit={onSubmit}>
            {/* <input
              type="text"
              id="name"
              className='w-full mt-10 pr-40 bg-gray-200 input text-xl input-md text-black'
              placeholder="Name"
              value={name}
              onChange={onChange}
            /> */}

            <input
              type="email"
              id="email"
              className="w-full mt-10 pr-40 bg-gray-200 input text-xl input-md text-black"
              placeholder="Email"
              value={email}
              onChange={onChange}
            />

            <div className="passwordInputDiv relative my-10">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pr-40 bg-gray-200 input text-xl input-md text-black"
                // className="passwordInput"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
              {/* <button
                type='submit'
                className='absolute mt-10 top-0 right-0 rounded-l-none w-36 btn btn-lg'>
                Go
              </button> */}

              {showPassword ? (
                <EyeSlashIcon
                  className="showPassword absolute top-0 right-0 rounded-l-none w-16 btn btn-md text-gray-400"
                  aria-hidden="true"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <EyeIcon
                  className="showPassword absolute top-0 right-0 rounded-l-none w-16 btn btn-md text-gray-400"
                  aria-hidden="true"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}

              {/* <img
                src={showPassword ? EyeSlashIcon : EyeIcon}
                className="showPassword absolute top-0 bg-slate-600 right-0 rounded-l-none w-24 btn btn-md"
                alt="Show Password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              /> */}
            </div>

            <div className="signUpBar">
              <button className="signUpButton mt-10 top-0 right-0 rounded-l-none w-36 btn btn-lg">
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-10">
            <Link
              to="/sign-in"
              className="registerLink link link-success text-xl"
            >
              Sign In Instead
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

export default SignUp;
