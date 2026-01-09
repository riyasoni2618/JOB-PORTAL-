// import React from 'react'
// import Navbar from './shared/Navbar'
// import { Avatar, AvatarImage } from './ui/avatar'
// import { Button } from './ui/button'
// import { Contact, Pen } from 'lucide-react'
// import { Mail } from 'lucide-react'
// import { Badge } from './ui/badge'
// import { Label } from './ui/label'
// import AppliedJobsTable from './AppliedJobsTable'
// import { useState } from 'react'
// import UpdateProfileDialog from './UpdateprofileDialog'

// import App from '@/App'
// import { useSelector } from 'react-redux'

// const isResume = true;
// // const skills = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'];
// const Profile = () => {
//   const [open, setOpen] = useState(false);
//   const {user} = useSelector(store => store.auth); 
   
//   return (
//     <div>
//       <Navbar />
//       <div className='max-w-4xl mx-auto bg-white  border border-gray-200 rounded-2xl my-5 p-8'>
//         <div className='flex justify-between'>
//           <div className='flex items-center gap-4'>
//             <Avatar className="h-24 w-24">
//               <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="" />
//             </Avatar>
//             <div>
//               <h1>{user?.fullname}</h1>
//               <p>{user?.profile?.bio}</p>
//             </div>
//           </div>
//           <Button onClick={() => setOpen(true)} className="text-right" variant='outline'><Pen /></Button>
//         </div>
//         <div>
//           <div className='flex items-center gap-3 my-2'>
//             <Mail />
//             <span>{user?.email}</span>
//           </div>
//           <div className='flex items-center gap-3 my-2'>
//             <Contact />
//             <span>{user?.phoneNumber}</span>
//           </div>
//         </div>
//         <div className='my-5'>
//           <h1>Skills</h1>
//           <div className='flex items-center gap-1 '>
//             {
//               user?.profile?.skills.length!== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>Not applicable</span>
//             }
//           </div>
//         </div>
//         <div className="grid w-full max-w-sm items-center gap-1.5">
//           <Label className="text-md font-bold">Resume</Label>
//           {
//             isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>No resume uploaded</span>
//           }
//         </div>
//       </div>
//       <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
//         <h1>Applied Jobs</h1>
//         <AppliedJobsTable />
//       </div>
//       <UpdateProfileDialog open ={open} setOpen={setOpen}/>
//     </div>

//   )
// }

// export default Profile
import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'


const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    // Check if user exists
    if (!user) {
        return (
            <div>
                <Navbar />
                <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                    <p>Please login to view your profile.</p>
                </div>
            </div>
        );
    }

    // Check if resume exists - handle both string and array formats
    const resumeUrl = Array.isArray(user?.profile?.resume) 
        ? user.profile.resume[0] 
        : user?.profile?.resume;
    const hasResume = resumeUrl && resumeUrl.length > 0;
    const hasSkills = user?.profile?.skills && Array.isArray(user.profile.skills) && user.profile.skills.length > 0;

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto || ''} alt="profile" />
                            <AvatarFallback>
                                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname || 'User'}</h1>
                            <p>{user?.profile?.bio || 'No bio available'}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right border-black text-black hover:bg-black hover:text-white" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email || 'N/A'}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber || 'N/A'}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='font-bold text-lg mb-2'>Skills</h1>
                    <div className='flex items-center gap-1 flex-wrap'>
                        {
                            hasSkills ? (
                                user.profile.skills.map((item, index) => (
                                    <Badge key={index}>{item}</Badge>
                                ))
                            ) : (
                                <span className='text-gray-500'>No skills added yet</span>
                            )
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        hasResume ? (
                            <a 
                                target='_blank' 
                                rel='noopener noreferrer'
                                href={resumeUrl} 
                                className='text-blue-500 w-full hover:underline cursor-pointer'
                            >
                                {user?.profile?.resumeOriginalName || 'View Resume'}
                            </a>
                        ) : (
                            <span className='text-gray-500'>No resume uploaded</span>
                        )
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile