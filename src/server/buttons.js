import { baseUrl } from "../utils/Constant";

 export const updatebutton = async (data) => {
    
    try {
        const response = await fetch(`${baseUrl}/v1/api/buttons/update-all-buttons`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const buttonData=await response.json();
        // console.log(buttonData);
        return buttonData

    } catch (error) {
        console.log(error);
    }
}

 export const getButtons = async () => {
    try {
        const res = await fetch(`${baseUrl}/v1/api/buttons/get-all-buttons`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.log(err);
    }
};

