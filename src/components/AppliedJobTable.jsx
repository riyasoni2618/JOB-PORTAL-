// import React from 'react'
// // import { Table } from 'lucide-react'
// import { Table,TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
// import { Badge } from './ui/badge'
// const AppliedJobsTable = () => {
//   return (
//     <div>
//         <Table>
//             <TableCaption>A List of Your applied Jobs</TableCaption>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>Job Title</TableHead>
//                     <TableHead>Company</TableHead>
//                     <TableHead>Date Applied</TableHead>
//                     <TableHead className="text-right">Status</TableHead>
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//               {
//                 [1,2].map((item,index)=>(
//                   <TableRow key={index}>
//                     <TableCell>Software Engineer</TableCell>
//                     <TableCell>Tech Corp</TableCell>
//                     <TableCell>2024-06-15</TableCell>
//                     <TableCell className="text-right"><Badge>Selected</Badge></TableCell>
//                   </TableRow>
//                 ))
//               }
//             </TableBody>
//         </Table>
//     </div>
//   )
// }

// export default AppliedJobsTable
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    const appliedJobsArray = allAppliedJobs || [];
    
    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        appliedJobsArray.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    <span>You haven't applied any job yet.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            appliedJobsArray.map((appliedJob) => (
                                <TableRow key={appliedJob._id}>
                                    <TableCell>{appliedJob?.createdAt?.split("T")[0] || 'N/A'}</TableCell>
                                    <TableCell>{appliedJob?.job?.title || 'N/A'}</TableCell>
                                    <TableCell>{appliedJob?.job?.company?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob?.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                            {appliedJob?.status?.toUpperCase() || 'PENDING'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable