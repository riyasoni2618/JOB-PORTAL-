import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Input Change Handler
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // ✅ Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Login submitted", input);

    // Validate that role is selected
    if (!input.role) {
      toast.error("Please select a role (Student or Recruiter)");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // important for cookies/session
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed!");
      }

    } catch (error) {
      console.error("Login Error:", error);

      // ✅ Show actual backend message if available
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server connection failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(()=>{
    if(user){
        navigate("/");
    }
},[user, navigate])
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-[1090px] mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="email@gmail.com"
              required
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Your Password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup 
              value={input.role} 
              onValueChange={(value) => setInput({ ...input, role: value })}
              className="flex items-center gap-3 my-5"
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full my-4 bg-black text-white hover:bg-gray-900">
              <Loader2 className="mr-2 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-black text-white hover:bg-gray-900"
            >
              Login
            </Button>
          )}

          <span className="text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
