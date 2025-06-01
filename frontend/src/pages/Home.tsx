


export default function Home(){

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="xsm:px-[20px] flex flex-col justify-center md:flex-row items-center md:gap-5">
                <img src="/chessBoard.png" className="w-[240px] xsm:w-full md:w-[350px]" />
                <div className="flex flex-col justify-center px-[20px] gap-5 w-[300px] h-[200px]">
                    <a href="/signin" className="w-full h-[60px] px-[20px] py-[5px] bg-[#8CA2AD] rounded-xl">
                        <div className="text-xl">Play Online</div>
                        <div className="text-sm">Play with a rating system</div>
                    </a>
                    <a href="/play" className="w-full h-[60px] bg-[#739552] flex justify-center items-center text-3xl rounded-xl">Play as Guest</a>
                </div>
            </div>
        </div>
    )
}