const baseAPI = "https://give-v59n.onrender.com";

const updatebutton = async (data) => {
    
    try {
        const response = await fetch(`${baseAPI}/v1/api/buttons/update-all-buttons`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const buttonData=await response.json();
        console.log(buttonData);
        return buttonData

    } catch (error) {
        console.log(error);
    }
}

export default updatebutton