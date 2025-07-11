import { createContext, useContext, useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { toast } from 'sonner';
import { initialInspiringInstitutes, initialRecommendedCauses, initialUpdateButton } from '../config';
import  {updatebutton, getButtons } from '../server/buttons';
import {createInspiringInstitutes,deleteInspiringInstitutes,getAllInspiringInstitutes, updateInspiringInstitutes} from '../server/inspiringInstitutes';
import { uploadFile } from '../server/uploadImg';
import { createRecommendedCauses, deleteRecommendedCauses, getAllRecommendedCauses } from '../server/recommendedCauses';
import { deleteFundRequest, getAllFundRequests } from '../server/fundRequest';
// import getCampaignData from '../server/capmaign';
 import { baseUrl } from "../utils/Constant";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [allUserData, setAllUserData]=useState([]) 
    const [campaignData, setCampaignData]=useState([])
    const [buttonData, setButtonData]=useState({})
    // const [allButtonData, setAllButtonData]=useState({})
    const [institutesFormData, setInstitutesFormData]=useState(initialInspiringInstitutes)
    const [allInstituesData, setAllInstituesData]=useState([])
    const [recommendedCausesFormData, setRecommendedCausesFormData]=useState(initialRecommendedCauses)
    const [allCausesData, setAllCausesData]=useState([])
    const [uploadingHero, setUploadingHero] = useState(false)
    const [fundRequsetData, setFundRequestData]=useState([])

const deleteUser = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/auth/delete-user/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json(); // ✅ assumes server returns valid JSON

    if (data.success) {
      toast.success(data.message);
       getData()// ✅ reloads page after success
    }

  } catch (err) {
    console.log(err); // ✅ catches any fetch errors
  }
};
   


const getRecommendedCauses=async()=>{
         const data=await getAllRecommendedCauses()
         if(data){
           setAllCausesData(data.data)
           
         }else{
           console.log(data)
         }
       }


// Student Registration data

   const geInstitutes=async()=>{
         const data=await getAllInspiringInstitutes()
         if(data){
           setAllInstituesData(data.data)
         }else{
           console.log(data)
         }
       }


       // fund request

const getFundRequests=async()=>{
  try {
    
  const res=await getAllFundRequests();
if(res){
  setFundRequestData(res.data)
  
}
  
  
  } catch (error) {
      console.log(error);
   }
}
async function getButtonsData() {
    const data = await getButtons();
    if (data) setButtonData(data);
  }

     async function getData(){
         try{
           const response=await fetch(`${baseUrl}/auth/get-user-data`)
           const data=await response.json()
          
           setAllUserData(data.data)
         }catch(err){
           console.log(err)
         }
        }
    useEffect(()=>{
     
        getData()
       
        const getCampaignData=async()=>{
    try {
      
        const res=await fetch(`${baseUrl}/v1/api/get-all-campaigns`);
    const data=await res.json();
    
    setCampaignData(data.data)
    } catch (error) {
        console.log(error);
     }
        }
        getCampaignData()


    
       geInstitutes()

       
       getRecommendedCauses()
      getFundRequests()
      getButtonsData()
        },[])


// button data
// console.log(allCausesData);


const handleChange = (e) => {
  const { name, value } = e.target;
  setButtonData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};



const updateHandlesubmit = async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const formData = Object.fromEntries(form);
  const data = updatebutton(formData);
  
  if(data){
      toast.success("Link updated successfully");
    getButtonsData()
  }
  else{
      toast.error("Link update failed");
  }
  
 
};
console.log(buttonData);



// Inspiring Institutes
const handleChangeInstitutes =async (e) => {
  const {name, value,files} = e.target;
try {
  setUploadingHero(true)
   if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);

    setInstitutesFormData({
      ...institutesFormData,
      [name]: uploadedUrl,
    });
  } else {
    setInstitutesFormData({
      ...institutesFormData,
      [name]: value,
    });
  }
} catch (error) {
  toast.error("Image upload failed");
}finally{
  setUploadingHero(false)

}
}
const createInstitutesHandlesubmit = async (e) => {
  e.preventDefault();
  const data = createInspiringInstitutes(institutesFormData);
  
try {
    if(data){
      toast.success("Institutes created successfully");
      // window.location.reload()
      geInstitutes()
  }
  else{
      toast.error("Institutes update failed");
  } 
} catch (error) {
  
}finally{
  geInstitutes()
  
}
};
//  update Institues

const handleUpdateInstitutes=async()=>{
  const data= await updateInspiringInstitutes(institutesFormData._id,institutesFormData)
}

const handleDeleteInstitutes=async(id)=>{
  const data=await deleteInspiringInstitutes(id)
  try {
    if(data){
    toast.success("Institutes deleted successfully");
    geInstitutes()
  }
  else{
    toast.error("Institutes delete failed");
  }
    
  } catch (error) {
    
  }finally{
    geInstitutes()
  }
}



// Campaign Update

const updateCampaign =async (id,campaignData) => {
try {
   const data = await fetch(`${baseUrl}/v1/api/update-campaigns/${id}`,{
  method:"PUT",
  headers: {
    'Content-Type': 'application/json',
  },
  body:JSON.stringify(campaignData)
 })
 const response=await data.json();
 if(response.success){
  toast.success("Campaign updated successfully");
  return response
  
 }
 else{
  toast.error("Campaign update failed");
 }
} catch (error) {
  console.log(error);
  
}

 
 
};


// create RecommendedCauses

const handleChangeRecommendedCauses=async(e)=>{
  const {name, value,files} = e.target;

  
  try {
    setUploadingHero(true)
   if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);

    setRecommendedCausesFormData({
      ...recommendedCausesFormData,
      [name]: uploadedUrl,
    });
  } else {
    setRecommendedCausesFormData({
      ...recommendedCausesFormData,
      [name]: value,
    });
  }
  } catch (error) {
    
  }finally{
    setUploadingHero(false)
  }
}
const handleCreateRecommendedCauses=async(e)=>{
  e.preventDefault();
  const data =await createRecommendedCauses(recommendedCausesFormData)
try {
    if(data.success){
    toast.success("RecommendedCauses Created successfully");
    getRecommendedCauses()
  }
  else{
    toast.error("RecommendedCauses update failed");
  }
} catch (error) {
  
}finally{
  getRecommendedCauses()
}
}

// delete RecommendedCauses
const handleDeleteRecommendedCauses=async(id)=>{
  const data=await deleteRecommendedCauses(id)
 try {
   if(data){
    toast.success("RecommendedCauses deleted successfully");
    getRecommendedCauses()
  }
  else{
    toast.error("RecommendedCauses delete failed");
  }
 } catch (error) {
  
 }finally{
  getRecommendedCauses()
 }
}

// fund request
const handleDeleteFundRequest=async(id)=>{
  const data=await deleteFundRequest(id)
try {
  if(data){
    toast.success("Fund request deleted successfully");
    getFundRequests()
  }
  else{
    toast.error("Fund request delete failed");
  }
} catch (error) {
  
}finally{
  getFundRequests()
}
}



    return (
        <AuthContext.Provider value={
            {
                allUserData,
                deleteUser,
                campaignData,
                buttonData,
                handleChange,
                updateHandlesubmit,
                institutesFormData,
                handleChangeInstitutes,
                createInstitutesHandlesubmit,
               updateCampaign,
               allInstituesData,
               handleDeleteInstitutes,
               handleChangeRecommendedCauses,
               recommendedCausesFormData,
               handleCreateRecommendedCauses,
               allCausesData,
               handleDeleteRecommendedCauses,
               setUploadingHero,
               uploadingHero,
               fundRequsetData,
               handleDeleteFundRequest
                }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

