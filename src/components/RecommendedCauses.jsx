import { useAuth } from '../contexts/authContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Delete, DeleteIcon, Loader2, Trash } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

  const donations = [
    {
      id: 1,
      fundraiser: "Education for Children",
      amount: "₹100",
      date: "May 15, 2025",
      status: "Completed",
    },
    {
      id: 2,
      fundraiser: "Clean Water Initiative",
      amount: "₹50",
      date: "May 10, 2025",
      status: "Completed",
    },
    {
      id: 3,
      fundraiser: "Medical Supplies Drive",
      amount: "₹75",
      date: "May 5, 2025",
      status: "Completed",
    },
  ]
// List of categories
const categories = [
  "Ulama",
  "Madrasa",
  "Education",
  "Poor",
  "Orphans",
  "Medical relief",
  "Masjid"
]
const RecommendedCauses = () => {
    const {handleChangeRecommendedCauses,handleCreateRecommendedCauses,recommendedCausesFormData,allCausesData,handleDeleteRecommendedCauses,uploadingHero}=useAuth()
  return (
    <div>

      <section className="my-4">
                <Toaster position="top-center" />
             
                <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm" >
                    <div className="flex items-center justify-between gap-2 border-b pb-3">
                        
                        <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">
                            Recommended Causes
                        </h2>
                     
                    </div>

                    
                    <form className='space-y-3 my-4 flex flex-wrap justify-between items-center'  onSubmit={handleCreateRecommendedCauses}>
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Headline </label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter Headline" name="headline"
                            value={recommendedCausesFormData.headline}
                            onChange={handleChangeRecommendedCauses}
                             />
                        </div>
                        
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Category</label>
                           

                        <select className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Select a category" name="category"
                            value={recommendedCausesFormData.category}
                            onChange={handleChangeRecommendedCauses}
                             >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                       
                        </div>

                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 "> Page Headline </label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter Headline" name="pageHeadline"
                            value={recommendedCausesFormData.pageHeadline}
                            onChange={handleChangeRecommendedCauses}
                             />
                        </div>

                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Page Sub Headline </label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter Headline" name="pageSubHeadline"
                            value={recommendedCausesFormData.pageSubHeadline}
                            onChange={handleChangeRecommendedCauses}
                             />
                        </div>

                         <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Enter the URL</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter the URL" name="pageCta"
                            value={recommendedCausesFormData.pageCta}
                            onChange={handleChangeRecommendedCauses}
                        />
                        </div>
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Upload Image</label>


                           {uploadingHero ? (
                             <>
                               <Loader2 className="w-8 h-8 mb-4 text-blue-500 animate-spin" />
                                  <p className="mb-2 text-sm text-blue-600 font-semibold">Uploading ...</p>
                             </>
                           ) : (
                             <>
                               <input type="file" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter the URL" name="pageImage"
                              onChange={handleChangeRecommendedCauses}
                             />
                             </>
                           )
                           }
                        </div>
                       
                        <div className='mt-4'>
                        <button type="submit" className='bg-[#f7a500] py-3 cta  hover:shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-yellow-500  text-white p-2 px-5 rounded-lg font-semibold text-sm' >
                            Create 
                        </button>
                    </div>
                        
                    </form>
                 
                    
                </div>


                 <div className='customContainer mt-10'>
                    <Card className=" overflow-hidden w-full">
                                <CardHeader>
                                  <CardTitle> Recommended Causes History</CardTitle>
                                </CardHeader>
                                <CardContent className="overflow-auto w-[500px] md:w-full" >
                                  <div className="rounded-md border ">
                                    <div className="flex justify-around bg-muted p-4 font-medium ">
                                      <div>Headline</div>
                                      
                                      <div>Category</div>
                                     <div className=''>
                                      Page Headline
                                     </div>
                                     <div className=''>
                                      Page Sub Headline
                                     </div>
                                      <div>Delete</div>
                                    </div>
                                    {allCausesData.length > 0 ? (
                                      allCausesData.map((institues) => (
                                        <div key={institues._id} className="flex justify-between gap-10 p-4 border-t">
                                          <div className='w-[25%] text-center overflow-auto'>{institues.headline}</div>
                                          
                                          <div className='w-[25%] text-center overflow-auto'>{institues.category}</div>
                                          <div className='w-[25%] h-[70px]  text-center overflow-auto'>{institues.pageHeadline}</div>
                                          <div className='w-[25%] h-[70px] text-center overflow-auto'>{institues.pageSubHeadline}</div>
                                        
                                          <div className='w-[25%] text-center overflow-auto'>
                                            <button className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 " onClick={() => handleDeleteRecommendedCauses(institues._id)} >
                                              <Trash  className="mr-1 font-[8px]" />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-4 text-center text-muted-foreground">No allCausesData found</div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                 </div>
            </section>
    </div>
  )
}

export default RecommendedCauses
