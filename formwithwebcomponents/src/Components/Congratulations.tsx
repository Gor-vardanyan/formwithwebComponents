const Congratulations = ({ owner }: { owner?: string}) => {
    return <div className="container mx-auto flex items-center justify-center">
        <div className="relative">
            <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-3">Congratulations! {owner ?? ''}</h1>
                <p className="text-lg text-gray-600 mb-2">Your accommodation has been successfully registered</p>
                <p className="text-sm text-gray-500 mb-8">Thank you for providing all the necessary information</p>

                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="cursor-pointer w-full hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                    Restart
                </button>
            </div>
        </div>
    </div>
}

export default Congratulations;