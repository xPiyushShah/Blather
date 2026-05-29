import React from 'react'

const LeftBox = React.lazy(() => import('../containers/LeftBox.jsx'));
const SideBox = React.lazy(() => import('../containers/SideBox.jsx'));
const ThirdBox = React.lazy(() => import('../containers/ThirdBox.jsx'));
function MainScreen() {
    return (
        <div className="flex flex-col sm:flex-row w-full min-h-screen text-white overflow-hidden backdrop-blur-md bg-white/[0.06]">

            <div className="w-full sm:basis-[65%] sm:flex-none min-w-0 bg-transparent border-r-[1px]  border-r-[#dddddd35]">
                <LeftBox />
            </div>

            <div className="w-full sm:basis-[32%] sm:flex-none min-w-0 bg-transparent">
                <SideBox />
            </div>

            <div className="w-full sm:basis-[3%] sm:flex-none min-w-0 bg-transparent border-l-[1px]  border-l-[#dddddd35]">
                <ThirdBox />
            </div>

        </div>
    )
}

export default MainScreen