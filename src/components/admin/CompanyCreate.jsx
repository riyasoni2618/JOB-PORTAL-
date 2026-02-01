import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constants'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
     const dispatch = useDispatch();
    const registerNewCompany = async () => {
        if (!companyName || companyName.trim() === "") {
            toast.error("Please enter a company name");
            return;
        }
        
        try {
            console.log("🚀 Registering company:", companyName);
            console.log("🔗 API Endpoint:", `${COMPANY_API_END_POINT}/register`);
            
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json',
                },
                withCredentials:true
            });
            
            console.log("✅ Response:", res.data);
            
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            } else {
                toast.error(res.data.message || "Failed to create company");
            }
        } catch (error) {
            console.error("❌ Company Registration Error:", error);
            console.error("❌ Error Response:", error.response?.data);
            console.error("❌ Error Status:", error.response?.status);
            
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message === "Network Error") {
                toast.error("Cannot connect to server. Please check if the backend is running.");
            } else {
                toast.error("Failed to create company. Please try again.");
            }
        }
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                     onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany} className="bg-black text-white hover:bg-gray-900">Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate