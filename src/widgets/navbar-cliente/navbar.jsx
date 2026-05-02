function Navbar({ onOpenDrawer }) {

    return (
       <nav className="w-full font-inter flex items-center justify-between px-10 py-4 bg-white">
            {/* Lado Esquerdo: Logo e Links */}
            <div className="flex items-center gap-8">
                <img 
                className="w-[150px] cursor-pointer" 
                src="/logo-tons/Logo Hefestos Nome.png" 
                alt="Logo Ton's" 
                />
    
            <div className="flex items-center gap-6">
                {/* Link Lista de Interesse */}
            <div className="flex items-center group cursor-pointer">
                <a className="text-gray-500 text-sm font-medium transition-colors group-hover:text-black relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-yellow-400 after:transition-all group-hover:after:w-full" href="#">
                LISTA DE INTERESSE
                </a>
        <img className="w-5 h-5 ml-2" src="/icons/clipboard.png" alt="" />
            </div>

            {/* Link Meus Pedidos */}
            <div className="flex items-center group cursor-pointer">
                <a className="text-gray-500 text-sm font-medium transition-colors group-hover:text-black relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-yellow-400 after:transition-all group-hover:after:w-full" href="#">
                MEUS PEDIDOS
                </a>
                <img className="w-5 h-5 ml-2" src="/icons/parcel.png" alt="" />
            </div>
            </div>
        </div>

        {/* Lado Direito: Busca e Bookmark */}
        <div className="flex items-center gap-3"> {/* gap-3 deixa o input colado no ícone */}
            {/* Container do Input de Busca */}
            <div className="relative flex items-center">
            <input 
                type="text" 
                placeholder="Buscar..."
                className="bg-white border border-black rounded-md px-3 py-1 pr-10 w-[200px] focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            <img 
                src="/icons/search.png" 
                alt="Buscar" 
                className="absolute right-3 w-4 h-4 opacity-70"
            />
            </div>

            {/* Ícone Bookmark */}
            <img
            className="w-8 cursor-pointer hover:scale-110 transition-transform"
            src="/icons/bookmark.png"
            alt="Abrir itens salvos"
            onClick={onOpenDrawer}
            />
        </div>
        </nav>
    )
}

export default Navbar


    //   <nav className='w-full font-[var(--fonte-inter)] flex justify-evenly '>

    //         <nav className="flex w-1/2 flex-row items-center justify-start p-[1.5%]">
    //             <img className='w-[150px] cursor-pointer' src="/logo-tons/Logo Hefestos Nome.png" alt="" />
    //         </nav>
    //         <nav className="group/nav flex w-1/2 flex-row items-center justify-evenly p-[1.5%]">
    //             <p>
    //                 <a className='text-[var(--cinza-escuro)] no-underline text-[small] relative inline-block pb-1 hover:text-[var(--preto-neutro)] hover:font-bold transition-colors duration-250 before:content-[""] before:absolute before:bg-[var(--amarelo-base)] before:right-0 before:bottom-0 before:w-0 before:h-[2px] before:transition-[width] before:duration-250 before:ease-out hover:before:w-full'
    //                  href="">LISTA DE INTERESSE</a>
    //                 <img className='w-[25px] ml-[10px] inline' src="/icons/clipboard.png" alt="" />
    //             </p>
    //             <p>
    //                 <a className='text-[var(--cinza-escuro)] no-underline text-[small] relative inline-block pb-1 hover:text-[var(--preto-neutro)] hover:font-bold transition-colors duration-250 before:content-[""] before:absolute before:bg-[var(--amarelo-base)] before:right-0 before:bottom-0 before:w-0 before:h-[2px] before:transition-[width] before:duration-250 before:ease-out hover:before:w-full' 
    //                 href="">MEUS PEDIDOS</a>
    //                 <img className='w-[25px] ml-[10px] inline' src="/icons/parcel.png" alt="" />
    //             </p>
    //         </nav>
    //         <nav className="group/nav flex w-1/2 flex-row items-center flex justify-evenly">
    //             <div>
    //                 <input type="text" name="" id="" className="bg-red-500"/>
    //                 <img src="" alt="" />
    //             </div>
    //         </nav>
    //         <nav className="flex w-1/2 flex-row items-center justify-end p-[1.5%]">
    //             <img
    //                 className="w-[35px] cursor-pointer"
    //                 src="/icons/bookmark.png"
    //                 alt="Abrir itens salvos"
    //                 onClick={onOpenDrawer}
    //             />
    //         </nav>
    //     </nav>