import BarChartInteractive from "@/components/custom/charts/barChart"
import LineChartInteractive from "@/components/custom/charts/lineChart"

export default function Overview() {
    return(
        <div className=" grid lg:grid-cols-2  bg-slate-800 w-[100] h-screen gap-4 p-4">    
           { /** Charts sections*/}
           <BarChartInteractive/>
           <LineChartInteractive/>

           {/**Other summary sections data */}
            <div className="bg-orange-300">
                This is where all the summary of the site is
            </div>
            <div className="bg-orange-300">
             Just a mock card 
            </div>
            <div className="bg-orange-300">
                Just a mock card
            </div>
        </div>
    )
}