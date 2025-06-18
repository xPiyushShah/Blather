import React from 'react'

function Footer() {
    return (
        <div className='flex flex-row  p-12 space-x-1 w-full h-6   text-[12px] bg-transparent'>
            <div className='flex flex-row  p-12 space-x-1 w-full h-6  justify-between text-[12px] bg-transparent align-end items-end'>
                <div className='text-white '>Copyright @2025</div>
                <div>
                    <ul className='flex flex-row space-x-4 text-white justify-evenly align-bottom items-end
             list-none gap-2.5 *:hover:underline *:hover:text-blue-400 *:hover:cursor-pointer   *:hover:transition-all *:hover:duration-300 '>
                        <li>About Us</li>
                        <li>Contact</li>
                        <li>Privacy Policy</li>
                        <li className=" hover:text-white">Developed By <a href="https://github.com/your-profile" className="text-blue-400" >Piyush</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer