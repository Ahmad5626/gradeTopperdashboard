import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import Loader from "./Loader/Loader";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

function FundRequest() {
  const { fundRequsetData,handleDeleteFundRequest } = useAuth();
  
  
  // const [role, setRole] = useState(null);

  return (
    <>
      <main>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "10px",
              padding: "15px",
            },
          }}
        />
        <section className="my-4">
          <div className="customContainer bg-gradient-to-r from-[#000000] to-[#f8bb26] text-white p-5 rounded-lg mx-auto">
            <h2 className="text-2xl font-bold">Welcome,</h2>
           
          </div>
        </section>
        <section className="my-4">
          <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm">
            <p className="text-lg font-semibold mb-3 col-span-2">
              Recently Request for Fund
            </p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
              {fundRequsetData.map((item, index) => {
                return (
                  <>
                    <div className="bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200">
                      <div className="flex justify-between items-center border-b pb-1">
                        <div>
                          <p className="text-xl font-semibold">{item.campaignType
                          }</p>
                          {/* <p className="text-xs font-semibold text-gray-500">raza</p> */}
                        </div>
                        
                      </div>
                      <div className="flex flex-col gap-2 py-3 mb-2 border-b">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                            Name
                          </p>
                          <p className="font-medium text-sm text-gray-700 capitalize">
                            {item.name}
                          </p>
                        </div>
                          <div className="flex items-center gap-2">
                           <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                            Amount
                          </p>
                          <p className="font-medium text-sm text-gray-700">
                            {item.amount}
                          </p>
                        </div>

                         <div className="flex items-center gap-2">
                         <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                            Bank Name
                          </p>
                          <p className="font-medium text-sm text-gray-700">
                            {item.bankName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                         <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                            Account Number
                          </p>
                          <p className="font-medium text-sm text-gray-700">
                            {item.accountNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                            IFSC Code
                          </p>
                          <p className="font-medium text-sm text-gray-700">
                            {item.ifsc}
                          </p>
                        </div>

                      
                     
                      </div>
                      <div>
                
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-700">
                          <button
                            className="text-xs text-red-500 font-semibold border rounded-full p-1 py-2 hover:text-red-700"
                            onClick={() => handleDeleteFundRequest(item._id)}
                          >
                            Delete{" "}
                          </button>
                          {/* <span className="capitalize">0892734089</span>
                                                <span>on    </span> */}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default FundRequest;
