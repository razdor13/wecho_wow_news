import Image from "next/image";
import wechoSvg from "@/public/wecho.svg";
export default function Header() {
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
                        <button className=" hover:bg-gray-100 bg-red-2 text-white  rounded-lg px-4 py-2 ">
                            Регістрація
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
