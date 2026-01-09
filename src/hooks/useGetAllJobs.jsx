import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constants'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery || ""}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    console.error("Failed to fetch jobs:", res.data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        }
        fetchAllJobs();
    },[searchedQuery])
}

export default useGetAllJobs

