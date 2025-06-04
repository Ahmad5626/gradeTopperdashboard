import { useAuth } from '../contexts/authContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Delete, DeleteIcon, Trash } from 'lucide-react'

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

const InspiringInstitutes = () => {
    const {institutesFormData, handleChangeInstitutes,createInstitutesHandlesubmit,allInstituesData,handleDeleteInstitutes}=useAuth()
  return (
    <div>

      <section className="my-4">
                <Toaster position="top-center" />
             
                <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm" >
                    <div className="flex items-center justify-between gap-2 border-b pb-3">
                        
                        <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">
                            Inspiring Institutes 
                        </h2>
                      
                    </div>

                    
                    <form className='space-y-3 my-4 flex flex-wrap justify-between items-center'  onSubmit={createInstitutesHandlesubmit}>
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Headline </label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter Headline" name="headline"
                            value={institutesFormData.headline}
                            onChange={handleChangeInstitutes}
                             />
                        </div>
                        <div className="w-full md:w-[48%] flex flex-col gap-2 !mt-0">
                            <label className="font-semibold text-xs text-gray-500 ">Sub Headline</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter Sub Headline" name="subHeadline"
                            value={institutesFormData.subHeadline}
                            onChange={handleChangeInstitutes}
                             />
                        </div>
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Enter the URL</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter the URL" name="url"
                            value={institutesFormData.url}
                            onChange={handleChangeInstitutes}
                        />
                        </div>
                        <div className="w-full md:w-[48%] flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Upload Image</label>
                            <input type="file" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Enter the URL" name="instituteImage"
                            
                            onChange={handleChangeInstitutes}
                        />
                        </div>
                        <div className='mt-4'>
                        <button type="submit" className='px-8 py-3 cta text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-yellow-500  text-white p-2 px-5 rounded-lg font-semibold text-sm' >
                            Submit
                        </button>
                    </div>
                        
                    </form>
                 
                    
                </div>


                 <div className='customContainer mt-10'>
                    <Card className=" overflow-hidden w-full">
                                <CardHeader>
                                  <CardTitle>Inspiring Institutes History</CardTitle>
                                </CardHeader>
                                <CardContent className="overflow-auto w-[500px] md:w-full" >
                                  <div className="rounded-md border ">
                                    <div className="flex justify-around bg-muted p-4 font-medium ">
                                      <div>Headline</div>
                                      <div>SubHeadline</div>
                                      <div>Url</div>
                                      <div>InstituteImage</div>
                                      <div>Delete</div>
                                    </div>
                                    {allInstituesData.length > 0 ? (
                                      allInstituesData.map((institues) => (
                                        <div key={institues._id} className="flex justify-between gap-10 p-4 border-t">
                                          <div className='w-[25%] text-center overflow-auto'>#{institues.headline}</div>
                                          <div className='w-[25%] text-center overflow-auto'>{institues.subHeadline}</div>
                                          <div className='w-[25%] text-center overflow-auto'>{institues.url}</div>
                                          <div className='w-[25%] text-center overflow-auto'>{institues.instituteImage}</div>
                                          <div className='w-[25%] text-center overflow-auto'>
                                            <button className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800" onClick={() => handleDeleteInstitutes(institues._id)} >
                                              <Trash  className="mr-1" />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-4 text-center text-muted-foreground">No allInstituesData found</div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                 </div>
            </section>
    </div>
  )
}

export default InspiringInstitutes
