import { createContext, useContext, useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { toast } from 'sonner';
import { initialInspiringInstitutes, initialRecommendedCauses, initialUpdateButton } from '../config';
import updatebutton from '../server/buttons';
import {createInspiringInstitutes,deleteInspiringInstitutes,getAllInspiringInstitutes, updateInspiringInstitutes} from '../server/inspiringInstitutes';
import { uploadFile } from '../server/uploadImg';
import { createRecommendedCauses, deleteRecommendedCauses, getAllRecommendedCauses } from '../server/recommendedCauses';
// import getCampaignData from '../server/capmaign';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [allUserData, setAllUserData]=useState([]) 
    const [campaignData, setCampaignData]=useState([])
    const [buttonData, setButtonData]=useState(initialUpdateButton)
    const [institutesFormData, setInstitutesFormData]=useState(initialInspiringInstitutes)
    const [allInstituesData, setAllInstituesData]=useState([])
    const [recommendedCausesFormData, setRecommendedCausesFormData]=useState(initialRecommendedCauses)
    const [allCausesData, setAllCausesData]=useState([])
    const [uploadingHero, setUploadingHero] = useState(false)

 const baseAPI = "https://give-v59n.onrender.com";
const deleteUser = async (id) => {
  try {
    const res = await fetch(`https://give-v59n.onrender.com/auth/delete-user/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json(); // ✅ assumes server returns valid JSON

    if (data.success) {
      toast.success(data.message);
      window.location.reload(); // ✅ reloads page after success
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
    useEffect(()=>{
        async function getData(){
         try{
           const response=await fetch(`${baseAPI}/auth/get-user-data`)
           const data=await response.json()
          
           setAllUserData(data.data)
         }catch(err){
           console.log(err)
         }
        }
        getData()
       
        const getCampaignData=async()=>{
    try {
      
        const res=await fetch(`${baseAPI}/v1/api/get-all-campaigns`);
    const data=await res.json();
    
    setCampaignData(data.data)
    } catch (error) {
        console.log(error);
     }
        }
        getCampaignData()


    
       geInstitutes()

       
       getRecommendedCauses()

        },[ ])


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
  const data = updatebutton(buttonData);
  
  if(data){
      toast.success("Link updated successfully");
  }
  else{
      toast.error("Link update failed");
  }
  
 
};


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
  
  if(data){
      toast.success("Institutes updated successfully");
      window.location.reload()
  }
  else{
      toast.error("Institutes update failed");
  }
  
 
};
//  update Institues

const handleUpdateInstitutes=async()=>{
  const data= await updateInspiringInstitutes(institutesFormData._id,institutesFormData)
}

const handleDeleteInstitutes=async(id)=>{
  const data=await deleteInspiringInstitutes(id)
  if(data){
    toast.success("Institutes deleted successfully");
    window.location.reload()
  }
  else{
    toast.error("Institutes delete failed");
  }
}



// Campaign Update

const updateCampaign =async (id,campaignData) => {
try {
   const data = await fetch(`${baseAPI}/v1/api/update-campaigns/${id}`,{
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
  const {name, value} = e.target;
  setRecommendedCausesFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
}
const handleCreateRecommendedCauses=async(e)=>{
  e.preventDefault();
  const data =await createRecommendedCauses(recommendedCausesFormData)
  if(data.success){
    toast.success("RecommendedCauses Created successfully");
    window.location.reload()
  }
  else{
    toast.error("RecommendedCauses update failed");
  }
}

// delete RecommendedCauses
const handleDeleteRecommendedCauses=async(id)=>{
  const data=await deleteRecommendedCauses(id)
  if(data){
    toast.success("RecommendedCauses deleted successfully");
    window.location.reload()
  }
  else{
    toast.error("RecommendedCauses delete failed");
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
               uploadingHero
                }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

