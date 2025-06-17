"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal, Search, Edit, Trash, Eye, X, Save, Filter, Upload, ImageIcon } from "lucide-react"
import CampaignDetails from "../components/CampaignDetails/CampaignDetails"
import { useAuth } from "../contexts/authContext"
import { toast, Toaster } from "sonner"
import { Button } from "./ui/button"
import { initailGivenAmount } from "../config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

function App() {
  // Get real data from your backend via useAuth hook
  const { campaignData } = useAuth()

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
    campaignTitle: true,
    email: true,
    phone: true,
    category: true,
    goalAmount: true,
    fundType: true,
    isUrgent: true,
    endDate: true,
    zakatVerified: true, // Added zakatVerified
    accountHolderName: false,
    accountNumber: false,
    bankName: false,
    ifscCode: false,
    fullNameAsPerAadhar: false,
    firstName: false,
    lastName: false,
    country: false,
    location: false,
    pincode: false,
    aadharImageUrl: false,
    address: false,
    agreeAll: false,
    agreePayment: false,
    agreePrivacy: false,
    agreeTerms: false,
    currency: false,
    dateOfBirth: false,
    emailOfImamSahab: false,
    featureImage: false,
    featureImageUrl: false,
    governmentIdUrl: false,
    isBeneficiaryOrphan: false,
    masjidName: false,
    numberOfBeneficiaries: false,
    numberOfImamSahab: false,
    panImageUrl: false,
    raisingCause: false,
    story: false,
    tagline: false,
    createdBy: false,
    instituteRole: false,
    anticipatedDonations: false,
    spendingPlans: false,
    supportingDocumentsUrl: false, // Added supportingDocumentsUrl
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
      
      const response = await fetch(`https://give-v59n.onrender.com/v1/api/delete-campaigns/${id}`, {
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
      
      const response = await fetch(`https://give-v59n.onrender.com/v1/api/update-campaigns/${campaignId}`, {
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
      
      const response = await fetch(`https://give-v59n.onrender.com/v1/api/given-amount/${campaignId}`, {
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
      
      const response = await fetch(`https://give-v59n.onrender.com/v1/api/delete-given-amount/${id}/${given}`, {
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
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
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
                {visibleColumns.campaignTitle && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("campaignTitle")}
                  >
                    <div className="flex items-center">
                      Campaign Title
                      {sortConfig.key === "campaignTitle" ? (
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
                {visibleColumns.email && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === "email" ? (
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
                {visibleColumns.phone && <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>}
                {visibleColumns.category && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortConfig.key === "category" ? (
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
                {visibleColumns.goalAmount && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("goalAmount")}
                  >
                    <div className="flex items-center">
                      Goal Amount
                      {sortConfig.key === "goalAmount" ? (
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
                {visibleColumns.fundType && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Fund Type</th>
                )}
                {visibleColumns.isUrgent && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Is Urgent</th>
                )}
                {visibleColumns.zakatVerified && (
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Zakat Verified</th>
                )}
                {visibleColumns.endDate && (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    onClick={() => requestSort("endDate")}
                  >
                    <div className="flex items-center">
                      End Date
                      {sortConfig.key === "endDate" ? (
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
                {/* All other columns */}
                {Object.entries(visibleColumns).map(([column, isVisible]) => {
                  if (
                    ![
                      "status",
                      "campaignTitle",
                      "email",
                      "phone",
                      "category",
                      "goalAmount",
                      "fundType",
                      "isUrgent",
                      "zakatVerified",
                      "endDate",
                    ].includes(column) &&
                    isVisible
                  ) {
                    return (
                      <th key={column} className="px-4 py-3 text-left font-medium text-gray-600">
                        {column.replace(/([A-Z])/g, " $1").trim()}
                      </th>
                    )
                  }
                  return null
                })}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id || item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedRows.includes(item._id || item.id)}
                        onChange={() => handleSelectRow(item._id || item.id)}
                      />
                    </td>
                    {visibleColumns.status && (
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.campaignTitle && (
                      <td className="px-4 py-4 text-sm text-gray-900">{item.campaignTitle}</td>
                    )}
                    {visibleColumns.email && <td className="px-4 py-4 text-sm text-gray-900">{item.email}</td>}
                    {visibleColumns.phone && <td className="px-4 py-4 text-sm text-gray-900">{item.phone}</td>}
                    {visibleColumns.category && <td className="px-4 py-4 text-sm text-gray-900">{item.category}</td>}
                    {visibleColumns.goalAmount && (
                      <td className="px-4 py-4 text-sm text-gray-900">{formatGoalAmount(item.goalAmount)}</td>
                    )}
                    {visibleColumns.fundType && <td className="px-4 py-4 text-sm text-gray-900">{item.fundType}</td>}
                    {visibleColumns.isUrgent && (
                      <td className="px-4 py-4 text-sm text-gray-900">{item.isUrgent ? "Yes" : "No"}</td>
                    )}
                    {visibleColumns.zakatVerified && (
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.zakatVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.zakatVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                    )}
                    {visibleColumns.endDate && (
                      <td className="px-4 py-4 text-sm text-gray-900">{formatDate(item.endDate)}</td>
                    )}
                    {/* All other columns */}
                    {Object.entries(visibleColumns).map(([column, isVisible]) => {
                      if (
                        ![
                          "status",
                          "campaignTitle",
                          "email",
                          "phone",
                          "category",
                          "goalAmount",
                          "fundType",
                          "isUrgent",
                          "zakatVerified",
                          "endDate",
                        ].includes(column) &&
                        isVisible
                      ) {
                        let cellContent
                        if (column === "address") {
                          cellContent = item.address
                            ? `${item.address.street}, ${item.address.city}, ${item.address.state}`
                            : ""
                        } else if (column === "dateOfBirth") {
                          cellContent = item.dateOfBirth
                            ? `${item.dateOfBirth.day}/${item.dateOfBirth.month}/${item.dateOfBirth.year}`
                            : ""
                        } else if (column === "story") {
                          // Handle HTML content from TipTap
                          const plainText = stripHtmlTags(item[column])
                          cellContent = truncateText(plainText, 50)
                        } else if (typeof item[column] === "boolean") {
                          cellContent = item[column] ? "Yes" : "No"
                        } else if (column === "anticipatedDonations") {
                          cellContent = formatGoalAmount(item[column])
                        } else if (column.includes("ImageUrl") || column.includes("Url")) {
                          cellContent = item[column] ? "Available" : "Not Available"
                        } else {
                          cellContent = item[column] || ""
                        }

                        return (
                          <td key={column} className="px-4 py-4 text-sm text-gray-900">
                            {column === "story" ? (
                              <div className="max-w-xs">
                                <span title={stripHtmlTags(item[column])}>{cellContent}</span>
                              </div>
                            ) : (
                              cellContent
                            )}
                          </td>
                        )
                      }
                      return null
                    })}
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
                            <button
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
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

      {/* Comprehensive Edit Modal */}
      {showEditModal && editedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Edit Campaign</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "basic" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("basic")}
              >
                Basic Info
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "campaign" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("campaign")}
              >
                Campaign Details
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "personal" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "bank" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("bank")}
              >
                Bank Details
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "address" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("address")}
              >
                Address
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "institute" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("institute")}
              >
                Institute Info
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "images" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("images")}
              >
                Images & Documents
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "given" ? "text-gray-800 border-b-2 border-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("given")}
              >
                Given Amount
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Reject">Reject</option>
                      <option value="Terminate">Terminate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zakat Verified</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.zakatVerified ? "true" : "false"}
                      onChange={(e) => handleInputChange("zakatVerified", e.target.value === "true")}
                    >
                      <option value="true">Verified</option>
                      <option value="false">Not Verified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.ranking}
                      onChange={(e) => handleInputChange("ranking", e.target.value)}
                    >
                      <option value="Select">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.campaignTitle || ""}
                      onChange={(e) => handleInputChange("campaignTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.category || ""}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fund Type</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.fundType || ""}
                      onChange={(e) => handleInputChange("fundType", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Is Urgent</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.isUrgent ? "true" : "false"}
                      onChange={(e) => handleInputChange("isUrgent", e.target.value === "true")}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.endDate ? new Date(editedItem.endDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Campaign Details Tab */}
              {activeTab === "campaign" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={
                        typeof editedItem.goalAmount === "number"
                          ? editedItem.goalAmount
                          : editedItem.goalAmount?.replace(/[₹,]/g, "") || ""
                      }
                      onChange={(e) => handleInputChange("goalAmount", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.tagline || ""}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raising Cause</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.raisingCause || ""}
                      onChange={(e) => handleInputChange("raisingCause", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Story (HTML Content)</label>
                    <textarea
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                      value={editedItem.story || ""}
                      onChange={(e) => handleStoryChange(e.target.value)}
                      placeholder="Enter HTML content from TipTap editor..."
                    />
                    <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: editedItem.story || "" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email of Imam Sahab</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.emailOfImamSahab || ""}
                      onChange={(e) => handleInputChange("emailOfImamSahab", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone of Imam Sahab</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.numberOfImamSahab || ""}
                      onChange={(e) => handleInputChange("numberOfImamSahab", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Masjid Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.masjidName || ""}
                      onChange={(e) => handleInputChange("masjidName", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Bank Details Tab */}
              {activeTab === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.bankName || ""}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.ifscCode || ""}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.accountHolderName || ""}
                      onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.accountNumber || ""}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.address?.street || ""}
                      onChange={(e) => handleNestedInputChange("address", "street", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.address?.city || ""}
                      onChange={(e) => handleNestedInputChange("address", "city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.address?.state || ""}
                      onChange={(e) => handleNestedInputChange("address", "state", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.address?.pincode || editedItem.pincode || ""}
                      onChange={(e) => handleNestedInputChange("address", "pincode", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Institute Info Tab */}
              {activeTab === "institute" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Role</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.instituteRole || ""}
                      onChange={(e) => handleInputChange("instituteRole", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anticipated Donations</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.anticipatedDonations || ""}
                      onChange={(e) => handleInputChange("anticipatedDonations", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spending Plans</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={editedItem.spendingPlans || ""}
                      onChange={(e) => handleInputChange("spendingPlans", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Images & Documents Tab */}
              {activeTab === "images" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Feature Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Feature Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {editedItem.featureImageUrl ? (
                        <div className="space-y-3">
                          <img
                            src={editedItem.featureImageUrl || "/placeholder.svg"}
                            alt="Feature"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("featureImageUrl", e)}
                              className="hidden"
                              id="featureImage"
                            />
                            <label
                              htmlFor="featureImage"
                              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </label>
                            <button
                              onClick={() => handleInputChange("featureImageUrl", "")}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("featureImageUrl", e)}
                              className="hidden"
                              id="featureImage"
                            />
                            <label
                              htmlFor="featureImage"
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Feature Image
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aadhar Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Aadhar Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {editedItem.aadharImageUrl ? (
                        <div className="space-y-3">
                          <img
                            src={editedItem.aadharImageUrl || "/placeholder.svg"}
                            alt="Aadhar"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("aadharImageUrl", e)}
                              className="hidden"
                              id="aadharImage"
                            />
                            <label
                              htmlFor="aadharImage"
                              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </label>
                            <button
                              onClick={() => handleInputChange("aadharImageUrl", "")}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("aadharImageUrl", e)}
                              className="hidden"
                              id="aadharImage"
                            />
                            <label
                              htmlFor="aadharImage"
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Aadhar Document
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PAN Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">PAN Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {editedItem.panImageUrl ? (
                        <div className="space-y-3">
                          <img
                            src={editedItem.panImageUrl || "/placeholder.svg"}
                            alt="PAN"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("panImageUrl", e)}
                              className="hidden"
                              id="panImage"
                            />
                            <label
                              htmlFor="panImage"
                              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </label>
                            <button
                              onClick={() => handleInputChange("panImageUrl", "")}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("panImageUrl", e)}
                              className="hidden"
                              id="panImage"
                            />
                            <label
                              htmlFor="panImage"
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload PAN Document
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Government ID */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Government ID</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {editedItem.governmentIdUrl ? (
                        <div className="space-y-3">
                          <img
                            src={editedItem.governmentIdUrl || "/placeholder.svg"}
                            alt="Government ID"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("governmentIdUrl", e)}
                              className="hidden"
                              id="governmentId"
                            />
                            <label
                              htmlFor="governmentId"
                              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Replace
                            </label>
                            <button
                              onClick={() => handleInputChange("governmentIdUrl", "")}
                              className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload("governmentIdUrl", e)}
                              className="hidden"
                              id="governmentId"
                            />
                            <label
                              htmlFor="governmentId"
                              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Government ID
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  <div className="space-y-3 md:col-span-2">
  <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
    {editedItem.supportingDocumentsUrl?.length > 0 ? (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {editedItem.supportingDocumentsUrl.map((url, index) => (
            <div key={index} className="relative group">
              {url.endsWith(".pdf") ? (
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-md border">
                  <span className="text-sm text-gray-500">PDF File</span>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`Document ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <button
                onClick={() => {
                  setEditedItem((prev) => ({
                    ...prev,
                    supportingDocumentsUrl: prev.supportingDocumentsUrl.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleImageUpload("supportingDocumentsUrl", e)}
          multiple
          className="hidden"
          id="supportingDocs"
        />
        <label
          htmlFor="supportingDocs"
          className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload More
        </label>
      </div>
    ) : (
      <div className="text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-2">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleImageUpload("supportingDocumentsUrl", e)}
            multiple
            className="hidden"
            id="supportingDocs"
          />
          <label
            htmlFor="supportingDocs"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Supporting Documents
          </label>
        </div>
      </div>
    )}
  </div>
</div>
                </div>
              )}

              {/* Given Amount Tab */}
              {activeTab === "given" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={givenAmountFormdata.amount || ""}
                        onChange={(e) => handleChangenGivenAmount("amount", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                      <input
                        type="text"
                        name="headline"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={givenAmountFormdata.headline || ""}
                        onChange={(e) => handleChangenGivenAmount("headline", e.target.value)}
                      />
                    </div>
                 
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 mt-7"></label>
                      <button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleAddGivenAmount}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="customContainer mt-10">
                    <div className="overflow-hidden w-full bg-white border border-gray-200 rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Given Amount</h3>
                      </div>
                      <div className="overflow-auto w-[500px] md:w-full">
                        <div className="rounded-md border">
                          <div className="flex justify-around bg-gray-50 p-4 font-medium">
                            <div>Amount</div>
                            <div>Headline</div>
                           
                            <div>Delete</div>
                          </div>
                          {editedItem.givenAmount && editedItem.givenAmount.length > 0 ? (
                            editedItem.givenAmount.map((givenAmount, index) => (
                              <div key={index} className="flex justify-between gap-10 p-4 border-t">
                                <div className="w-[25%] text-center overflow-auto">{givenAmount.amount}</div>
                                <div className="w-[25%] text-center overflow-auto">{givenAmount.headline}</div>
                                
                                <div className="w-[25%] text-center overflow-auto">
                                  <button
                                    className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 hover:bg-red-200"
                                    onClick={() => handleDeleteGivenAmount(editedItem._id, givenAmount._id)}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">No given amounts found</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
