import { Badge } from "@/components/ui/badge"
export default function FocusAreasCard({provider}) {
  console.log("Recieved props :::",provider)
  return (
    <div className="space-y-6">

      {/* Focus Areas */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Focus Areas
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          {provider?.focusArea || "Focus area is not added till now"}
        </p>
      </div>

      {/* Industries */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Industries
        </h3>

        {
          (provider?.industries || []).length!==0 ? 
          (
            <div className="flex flex-row gap-2 flex-wrap">
              {
              provider?.industries.map((item)=>(
                <div>
                  <Badge  className="text-[12px] leading-[1.6] bg-[#F54A0C] min-w-[60px] h-[20px]">{item}</Badge>
                </div>
              ))

              }
            </div>
              
            
          ) :<p className="text-[12px] leading-[1.6] text-gray-600">Not working on any industries</p>
        }
      </div>

            {/* Clients */}
      
    { provider?.clients?.length >0 && (<div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Clients
        </h3>
          <div className="flex flex-wrap gap-2">
            {provider?.clients?.map((client, index) => (
              <Badge
                key={index}
                className="text-[12px] leading-[1.6] bg-[#F54A0C] min-w-[60px] h-[20px]"
              >
                {client}
              </Badge>
            ))}
         </div>
      </div>)}

    </div>
  )
}
