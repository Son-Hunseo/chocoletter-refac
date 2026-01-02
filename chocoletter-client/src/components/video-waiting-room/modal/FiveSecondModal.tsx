interface FiveSecondProps {
    leftTime: number,
}

export const FiveSecondModal = ({leftTime}: FiveSecondProps) => {

    return (
        <div className="w-full min-h-screen z-[9999] flex justify-center items-center bg-black bg-opacity-95">
            <p className="text-chocoletterPurpleBold font-bold text-2xl">{leftTime - 90}</p>
        </div>
    )
}