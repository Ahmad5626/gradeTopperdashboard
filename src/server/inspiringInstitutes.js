const baseAPI= "https://give-v59n.onrender.com";

export const createInspiringInstitutes = async (data) => {
    try {
        const response = await fetch(`${baseAPI}/v1/api/inspiringInstitutes/create-inspiring-institutes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        
        return responseData
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllInspiringInstitutes=async()=>{
 try {
    const res=await fetch(`${baseAPI}/v1/api/inspiringInstitutes/get-inspiring-institutes`,{
     method:"GET",
     headers:{
       "Content-Type": "application/json",
     }
    })
    const data=await res.json();
    
    
    return data

 } catch (error) {
    console.log(error);
    return error
    
 }
  
 
}
export const updateInspiringInstitutes=async(id,data)=>{
    try {
        const res=await fetch(`${baseAPI}/v1/api/inspiringInstitutes/update-inspiring-institutes/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
        })
        const data=await res.json();
        return data
    } catch (error) {
        console.log(error);
        return error
        
    }
}
export const deleteInspiringInstitutes=async(id)=>{
    try {
        const res=await fetch(`${baseAPI}/v1/api/inspiringInstitutes/delete-inspiring-institutes/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
            }
        })
        const data=await res.json();
        return data
    } catch (error) {
        console.log(error);
        return error
        
    }
}
// export default {createInspiringInstitutes,getAllInspiringInstitutes}