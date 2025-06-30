import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";
import Loader from "./Loader/Loader";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

function Home() {
  const { allUserData, deleteUser } = useAuth();
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("");

  // Sort users by most recent first (assuming createdAt field exists)
  const sortedUsers = [...allUserData].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Filter users based on selected filter and search term
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesFilter =
      filter === "all" || user.RegisteredType.toLowerCase() === filter;
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) 
    return matchesFilter && matchesSearch;
  });

  // Count users by type
  const userCounts = {
    all: allUserData.length,
    individual: allUserData.filter(user => user.RegisteredType === "individual").length,
    institute: allUserData.filter(user => user.RegisteredType === "institute").length,
  };

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
            <div className="flex flex-wrap justify-between items-center mt-4">
              <div className="flex gap-4 mb-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === "all" ? "bg-white text-black" : "bg-black text-white border border-white"}`}
                >
                  All ({userCounts.all})
                </button>
                <button
                  onClick={() => setFilter("individual")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === "individual" ? "bg-white text-black" : "bg-black text-white border border-white"}`}
                >
                  Individual 
                </button>
                <button
                  onClick={() => setFilter("institute")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === "institute" ? "bg-white text-black" : "bg-black text-white border border-white"}`}
                >
                  Institute 
                </button>
              </div>
              <div className="flex gap-4 items-center">
                {/* <input
                  type="text"
                  placeholder="Search users..."
                  className="px-3 py-1 rounded-full text-sm text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                /> */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
                  >
                    <i className="fa-solid fa-grid"></i>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
                  >
                    <i className="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="my-4">
          <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm">
            <p className="text-lg font-semibold mb-3 col-span-2">
              {filter === "all" ? "All Users" : filter === "individual" ? "Individual Users" : "Institute Users"} ({filteredUsers.length})
            </p>

            {viewMode === "grid" ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                {filteredUsers.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200">
                    <div className="flex justify-between items-center border-b pb-1">
                      <div>
                        <p className="text-xl font-semibold">{item.fullName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 py-3 mb-2 border-b">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[#d6ac52] font-semibold border rounded-full p-1 py-2">
                          Email
                        </p>
                        <p className="font-medium text-sm text-gray-700 capitalize">
                          {item.userEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-user text-[#d6ac52] border p-2 rounded-full"></i>
                        <p className="font-medium text-sm text-gray-700">
                          {item.RegisteredType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-phone text-[#d6ac52] border p-2 rounded-full"></i>
                        <p className="font-medium text-sm text-gray-700">
                          {item.mobileNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-location text-[#d6ac52] border p-2 rounded-full"></i>
                        <p className="font-medium text-sm text-gray-700">
                          {item.Address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-700">
                        <button
                          className="text-xs text-red-500 font-semibold border rounded-full p-1 py-2 hover:text-red-700"
                          onClick={() => deleteUser(item._id)}
                        >
                          Delete
                        </button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">Type</th>
                      <th className="py-2 px-4 border-b">Phone</th>
                      <th className="py-2 px-4 border-b">Address</th>
                      <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{item.fullName}</td>
                        <td className="py-2 px-4 border-b">{item.userEmail}</td>
                        <td className="py-2 px-4 border-b capitalize">{item.RegisteredType}</td>
                        <td className="py-2 px-4 border-b">{item.mobileNumber}</td>
                        <td className="py-2 px-4 border-b">{item.Address}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className="text-xs text-red-500 font-semibold hover:text-red-700"
                            onClick={() => deleteUser(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;