// import React, { use } from 'react'
// import { Badge } from './ui/badge'
// import { Button } from './ui/button'
// import { useParams } from 'react-router-dom'
// import useGetSingleJobs from './hooks/useGetSingleJob';
// import { JOB_API_END_POINT } from '@/utils/constants';
// import axios from 'axios';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setSingleJob } from '@/redux/jobSlice';


// const JobDescription = () => {
//     const isApplied = true;
//     const params = useParams();
//     const jobId = params.id;
//     const {singleJob} = useSelector((store) => store.job);
//     const dispatch = useDispatch();

//     useEffect(()=>{
//         const fetchSingleJob = async () => {
//             try {
//                 const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials:true});
//                 console.log(res.data);
//                 if(res.data.success){
//                     dispatch(setSingleJob(res.data.jobs));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchSingleJob();
//     },[jobId, dispatch, user?._id]);

//     return (
//         <div className='max-w-7xl mx-auto my-10 '>
//             <div className='flex items-center justify-between'>
//                 <div>
//                     <h1 className='max-w-7xl mx-auto my-10'>{singleJob?.title}</h1>
//                     <div className='flex items-center gap-2 mt-3'>
//                         <Badge className={'text-blue-700 font-bold'} variant="ghost">12 Positions</Badge>
//                         <Badge className={'text-[#F83002] font-bold'} variant="ghost">Part Time</Badge>
//                         <Badge className={'text-[#7209b7] font-bold'} variant="ghost">24LPA</Badge>
//                     </div>
//                 </div>
//                 <Button disabled={isApplied} className={`rounded-lg ${isApplied ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
//                 {isApplied ? 'Already Applied' : 'Apply Now'}</Button>
//             </div>
//             <h1 className='bordr-b-2 border-gray-300 font-medium py-4'>
//                 Job Description
//             </h1>
//             <div className='my-4'>
//                 <h1 className='font-bold my-1'>Role:<span className='pl-4 font-normal text-gray-800'>Frontend developer</span></h1>
//                 <h1 className='font-bold my-1'>Location:<span className='pl-4 font-normal text-gray-800'>Hyderabad</span></h1>
//                 <h1 className='font-bold my-1'>Description:<span className='pl-4 font-normal text-gray-800'>Lorem ipsum dolor sit amet consectetur.</span></h1>
//                 <h1 className='font-bold my-1'>Experience:<span className='pl-4 font-normal text-gray-800'>2 yrs</span></h1>
//                 <h1 className='font-bold my-1'>Total Applicants:<span className='pl-4 font-normal text-gray-800'>4</span></h1>
//                 <h1 className='font-bold my-1'>Posted Date:<span className='pl-4 font-normal text-gray-800'>17-07-2025</span></h1>
//             </div>
//         </div>
//     )
// }

// export default JobDescription
import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  JOB_API_END_POINT } from '@/utils/constants';
import { APPLICATION_API_END_POINT } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';


const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.application?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                if(singleJob && singleJob.application) {
                    const updatedSingleJob = {...singleJob, application:[...singleJob.application,{applicant:user?._id}]}
                    dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                }
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply for job. Please try again.");
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                console.log(res);
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job?.application?.some(application=>application.applicant === user?._id) || false) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    if (!singleJob) {
        return (
            <div>
                <Navbar />
                <div className='max-w-7xl mx-auto my-10'>
                    <p className='text-center text-gray-500'>Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed text-white' : 'bg-black text-white hover:bg-gray-900'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.application?.length || 0}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt ? singleJob.createdAt.split("T")[0] : 'N/A'}</span></h1>
            </div>
        </div>
        </div>
    )
}

export default JobDescription