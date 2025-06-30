"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal, Search, Edit, Trash, Eye, X, Save, Filter, Upload, ImageIcon } from "lucide-react"
import CampaignDetails from "../components/CampaignDetails/CampaignDetails"
import { useAuth } from "../contexts/authContext"
import { toast, Toaster } from "sonner"
import { Button } from "./ui/button"
import { initailGivenAmount } from "../config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { baseUrl } from "../utils/Constant";
function Donations() {
  // Get real data from your backend via useAuth hook
  const { campaignData } = useAuth()
  console.log(campaignData);
  
 // Use your real API data instead of dummy data
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Changed to 5 items per page
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editedItem, setEditedItem] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [viewingCampaign, setViewingCampaign] = useState(null)
  const [givenAmountFormdata, setGivenAmountFormdata] = useState(initailGivenAmount)

  // Define all columns from the MongoDB schema including new ones
  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    amount: true,
    donarName: true,
    phone: true,
    fundType: true,
    compaignName: true,
    date: true,
    amount: true,
    
    _id: true,
  })

  // Initialize data with campaignData from your backend
  useEffect(() => {
    if (campaignData && Array.isArray(campaignData)) {
      setData(campaignData.slice().reverse())
      setFilteredData(campaignData)
    }
  }, [campaignData])

  // Filter data based on search term and status filter
  useEffect(() => {
    let filtered = [...data] // Create a copy of the original data

    // Apply status filter first
    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply search filter only if there's a search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return Object.values(value).some((nestedValue) =>
              String(nestedValue).toLowerCase().includes(searchTerm.toLowerCase()),
            )
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, data])

  // Sort data
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    if (sortConfig.key && filteredData.length > 0) {
      const sortableItems = [...filteredData]
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj[key], a)
          : a[sortConfig.key]
        const bValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj[key], b)
          : b[sortConfig.key]

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
      setFilteredData(sortableItems)
    }
  }, [sortConfig])

  // Pagination
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentItems.map((item) => item._id || item.id))
    }
  }

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Reject":
        return "bg-red-100 text-red-800"
      case "Terminate":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-IN")
  }

  // Format goal amount
  const formatGoalAmount = (amount) => {
    if (typeof amount === "number") {
      return `₹${amount.toLocaleString()}`
    }
    if (typeof amount === "string" && amount.startsWith("₹")) {
      return amount
    }
    return `₹${amount}`
  }

  // Handle image upload
  const handleImageUpload = (field, event) => {
  const files = event.target.files;

  if (files.length > 0) {
    const uploadedUrls = Array.from(files).map((file) => URL.createObjectURL(file));

    setEditedItem((prev) => {
      const prevValue = prev[field];

      // Handle multiple-upload fields (arrays)
      if (Array.isArray(prevValue)) {
        return {
          ...prev,
          [field]: [...prevValue, ...uploadedUrls],
        };
      }

      // Handle single-upload fields (strings)
      return {
        ...prev,
        [field]: uploadedUrls[0], // just take the first file
      };
    });

    toast.success(`${files.length} file(s) uploaded successfully`);
  }
};

  // Handle view/edit/delete actions
  const handleViewItem = (item) => {
    setViewingCampaign(item)
    setActionMenuOpen(null)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setEditedItem({ ...item })
    setShowEditModal(true)
    setActionMenuOpen(null)
    setActiveTab("basic")
  }

  const handleDeleteItem = async (id) => {
    try {
      // Mock API call for demo purposes
      // In production, uncomment the fetch call
      
      const response = await fetch(`${baseUrl}/v1/api/delete-campaigns/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete campaign")
      }
      

      // Mock successful deletion
      toast.success("Campaign deleted successfully")
      setData(data.filter((item) => (item._id || item.id) !== id))
      setFilteredData(filteredData.filter((item) => (item._id || item.id) !== id))
      setActionMenuOpen(null)
    } catch (error) {
      toast.error("Failed to delete campaign")
      console.error("Error deleting campaign:", error)
    }
  }

  // Handle input change in edit modal
  const handleInputChange = (field, value) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle nested object input change
  const handleNestedInputChange = (parent, field, value) => {
    setEditedItem((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  // Updated Save edited item function with API call
  const handleSaveEdit = async () => {
    try {
      const campaignId = editedItem._id || editedItem.id

      // Mock API call for demo purposes
      // In production, uncomment the fetch call
      
      const response = await fetch(`${baseUrl}/v1/api/update-campaigns/${campaignId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedItem,
          status: editedItem.status, // Explicitly include status
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update campaign")
      }
      const updatedCampaign = await response.json()
      console.log("Response from server:", updatedCampaign)

      // Check if the response has the expected structure
      const updatedData = updatedCampaign.data || updatedCampaign
      

      
      

      // Update local state with the response from server
      setData(
        data.map((item) => {
          if ((item._id || item.id) === campaignId) {
            console.log("Updating item with new status:", updatedData.status)
            return updatedData
          }
          return item
        }),
      )

      // Update filtered data as well
      setFilteredData(
        filteredData.map((item) => {
          if ((item._id || item.id) === campaignId) {
            return updatedData
          }
          return item
        }),
      )

      // Close modal and reset states
      setShowEditModal(false)
      setSelectedItem(null)
      setEditedItem(null)

      // Show success notification
      toast.success("Campaign updated successfully!")
    } catch (error) {
      toast.error("Failed to update campaign")
      console.error("Error updating campaign:", error)
    }
  }

  // Given Amount
  const handleChangenGivenAmount = async (field, value) => {
    setGivenAmountFormdata((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddGivenAmount = async () => {
    try {
      const campaignId = editedItem._id || editedItem.id

      // Mock API call for demo purposes
      // In production, uncomment the fetch call
      
      const response = await fetch(`${baseUrl}/v1/api/given-amount/${campaignId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(givenAmountFormdata),
      })
      const data = await response.json()
      

      // Mock successful response
      const mockResponse = { success: true }

      if (mockResponse.success) {
        // Add the new given amount to the edited item
        const newGivenAmount = {
          _id: `ga${Date.now()}`, // Generate a temporary ID
          ...givenAmountFormdata,
        }

        setEditedItem((prev) => ({
          ...prev,
          givenAmount: [...(prev.givenAmount || []), newGivenAmount],
        }))

        // Reset form
        setGivenAmountFormdata(initailGivenAmount)

        toast.success("Given Amount added successfully")
      } else {
        toast.error("Given Amount addition failed")
      }
    } catch (error) {
      toast.error("Given Amount addition failed")
      console.error("Error adding given amount:", error)
    }
  }

  const handleDeleteGivenAmount = async (id, given) => {
    try {
      // Mock API call for demo purposes
      // In production, uncomment the fetch call
      
      const response = await fetch(`${baseUrl}/v1/api/delete-given-amount/${id}/${given}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      

      // Mock successful response
      const mockResponse = { success: true }

      if (mockResponse.success) {
        // Remove the given amount from the edited item
        setEditedItem((prev) => ({
          ...prev,
          givenAmount: prev.givenAmount.filter((item) => item._id !== given),
        }))

        toast.success("Given Amount deleted successfully")
      } else {
        toast.error("Given Amount deletion failed")
      }
    } catch (error) {
      toast.error("Given Amount deletion failed")
      console.error("Error deleting given amount:", error)
    }
  }

  // Add a function to strip HTML tags for table display
  const stripHtmlTags = (html) => {
    if (!html) return ""
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  // Add a function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Update the story field handling in the edit modal
  const handleStoryChange = (value) => {
    setEditedItem((prev) => ({
      ...prev,
      story: value,
    }))
  }

  // If viewing a campaign, show the details page
  if (viewingCampaign) {
    return <CampaignDetails campaign={viewingCampaign} onBack={() => setViewingCampaign(null)} />
  }

  // Show loading state if campaignData is not yet loaded
  if (!campaignData) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading campaign data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-auto flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* Status Filter */}
            <div className="relative">
              <button
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 w-32"
                onClick={() => setShowStatusFilter(!showStatusFilter)}
              >
                <span className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter}
                </span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>

              {showStatusFilter && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {["All", "Pending", "Active", "Reject", "Terminate"].map((status) => (
                      <button
                        key={status}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setStatusFilter(status)
                          setShowStatusFilter(false)
                        }}
                      >
                        {status !== "All" && (
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${
                              status === "Active"
                                ? "bg-green-500"
                                : status === "Pending"
                                  ? "bg-yellow-500"
                                  : status === "Reject"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                          ></span>
                        )}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Columns Filter */}
            <div className="relative">
              <button
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 w-40"
                onClick={() => setColumnsOpen(!columnsOpen)}
              >
                <span>Columns</span>
                <ChevronDown className="h-5 w-5 ml-2" />
              </button>

              {columnsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {Object.keys(visibleColumns).map((column) => (
                      <div key={column} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          id={`column-${column}`}
                          checked={visibleColumns[column]}
                          onChange={() => toggleColumn(column)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor={`column-${column}`} className="ml-2 capitalize">
                          {column.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                {/* <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                  />
                </th> */}
                {visibleColumns.status && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" ? (
                        sortConfig.direction === "ascending" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1 text-gray-300" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.amount && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    
                  >
                    <div className="flex items-center">
                     Amount 
                    
                    </div>
                  </th>
                )}
                {visibleColumns.donarName && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    
                  >
                    <div className="flex items-center">
                      Doner Name
                     
                    </div>
                  </th>
                )}
                {visibleColumns.phone && <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>}
               
              
                {visibleColumns.fundType && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Fund Type</th>
                )}
                {visibleColumns.compaignName && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Campaign Name </th>
                )}
                {/* {visibleColumns.zakatVerified && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Zakat Verified</th>
                )} */}
                {visibleColumns.date && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    
                  >
                    <div className="flex items-center">
                       Date
                     
                    </div>
                  </th>
                )}
                {/* All other columns */}
                
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id || item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedRows.includes(item._id || item.id)}
                        onChange={() => handleSelectRow(item._id || item.id)}
                      />
                    </td> */}
                    {visibleColumns.status && (
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.amount && (
                      <td className="px-4 py-4 text-sm text-gray-900">{item.amount}</td>
                    )}
                    {visibleColumns.donarName && <td className="px-4 py-4 text-sm text-gray-900">{item.donarName}</td>}
                    {visibleColumns.phone && <td className="px-4 py-4 text-sm text-gray-900">{item.phone}</td>}
                    
                   
                    {visibleColumns.fundType && <td className="px-4 py-4 text-sm text-gray-900">{item.fundType}</td>}
                    {visibleColumns.fundType && <td className="px-4 py-4 text-sm text-gray-900">{item.fundType}</td>}
                   
                
                    {visibleColumns.date && (
                      <td className="px-4 py-4 text-sm text-gray-900">{formatDate(item.date)}</td>
                    )}
                    {/* All other columns */}
                 
                    <td className="px-4 py-4 text-right relative">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setActionMenuOpen(actionMenuOpen === (item._id || item.id) ? null : item._id || item.id)
                        }
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {actionMenuOpen === (item._id || item.id) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleViewItem(item)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            {/* <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button> */}
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleDeleteItem(item._id || item.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}{" "}
            entries
            {selectedRows.length > 0 && ` (${selectedRows.length} selected)`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm rounded-md border ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed border-gray-200 bg-gray-50"
                    : "text-gray-700 hover:bg-gray-100 border-gray-300 bg-white"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === "number" && setCurrentPage(pageNumber)}
                  disabled={pageNumber === "..."}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : pageNumber === "..."
                        ? "text-gray-400 cursor-default border-gray-200 bg-gray-50"
                        : "text-gray-700 hover:bg-gray-100 border-gray-300 bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm rounded-md border ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed border-gray-200 bg-gray-50"
                    : "text-gray-700 hover:bg-gray-100 border-gray-300 bg-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

  
    </div>
  )
}

export default Donations
