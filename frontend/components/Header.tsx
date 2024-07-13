"use client"
import Image from "next/image";
import wechoSvg from "@/public/wecho.svg";
import GoogleAuthButton from "./buttons/authGoogleBtn";
import { useEffect, useState } from "react";
export default function Header() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const handleMessage = (event :any) => {
          try {
            if (event.origin !== 'http://localhost:3333') {
                console.log('gg')
                return
            };
            localStorage.setItem('token', event.data.token);
              window.removeEventListener('message', handleMessage);
          } catch (error) {
            console.error('Error processing auth message:', error);
          }
        };
      
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }, []);
    return (
        <header className="sticky top-0 mx-2 md:mx-10 py-5 z-20 text-[16px]">
            <nav className=" overflow-hidden backdrop-blur-lg backdrop-brightness-150 rounded-lg  pr-10 w-full flex justify-between h-[72px]">
                <div className="flex w-[100%] justify-between" >
                    <div className="pl-[32px] pr-[32px] py-3 backdrop-blur-lg backdrop-brightness-200 bg-brown-2">
                        <Image
                            src="/wecho.svg"
                            alt={wechoSvg}
                            className="text-blizz-color w-[11rem] h-[3.2rem] inline"
                            width={120}
                            height={50}
                            priority
                        />
                    </div>

                    <div className="flex flex-row gap-2 pl-8 items-center">
                        <div className="font-sans text-gray-300 font-medium w-auto hidden xl:inline">
                            <ul className="flex flex-row gap-2">
                                <li className="hover:bg-white hover:bg-opacity-5 rounded-lg">
                                    <button className="text-white rounded-lg px-4 py-2">
                                        Ігрові новини
                                    </button>
                                </li>
                                <li className="hover:bg-white hover:bg-opacity-5 rounded-lg">
                                    <button className="text-white rounded-lg px-4 py-2">
                                        СтрімиUA
                                    </button>
                                </li>
                                <li className="hover:bg-white hover:bg-opacity-5 rounded-lg">
                                    <button className="text-white  rounded-lg px-4 py-2">
                                        WOW Гільдії
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 pl-8 items-center">
                        <button className="hover:bg-white hover:bg-opacity-5 text-gray-300 rounded-lg px-4 py-2">
                            Вхід
                        </button>
                        <GoogleAuthButton/>
                        <button className=" hover:bg-gray-100 bg-red-2 text-white  rounded-lg px-4 py-2 ">
                            Регістрація
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
