 const baseAPI = "https://give-v59n.onrender.com";

export const createFundRequest = async (formData) => {
  try {
    const response = await fetch(`${baseAPI}/v1/api/fundRequest/create-fund-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success) {
      console.log("Fund request created successfully:", data.data.fundRequest);
      return data; // return campaign data
    } else {
      console.warn("Fund request creation failed");
      return data.err;
    }
  } catch (error) {
    return error;
  }
};

export const getAllFundRequests = async () => {
  try {
    const response = await fetch(`${baseAPI}/v1/api/fundRequest/get-fund-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
export const  deleteFundRequest = async (id) => {
  try {
    const response = await fetch(`${baseAPI}/v1/api/fundRequest/delete-fund-request/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
