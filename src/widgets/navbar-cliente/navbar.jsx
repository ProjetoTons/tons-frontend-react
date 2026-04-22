function Navbar({ onOpenDrawer }) {

    return (
        <nav className='w-full font-[var(--fonte-inter)] flex justify-center'>
            <nav className="flex w-1/2 flex-row items-center justify-start p-[1.5%]">
                <img className='w-[150px] cursor-pointer' src="/logo-tons/Logo Hefestos Nome.png" alt="" />
            </nav>
            <nav className="group/nav flex w-1/2 flex-row items-center justify-evenly p-[1.5%]">
                <p>
                    <a className='text-[var(--cinza-escuro)] no-underline text-[small] relative inline-block pb-1 hover:text-[var(--preto-neutro)] hover:font-bold transition-colors duration-250 before:content-[""] before:absolute before:bg-[var(--amarelo-base)] before:right-0 before:bottom-0 before:w-0 before:h-[2px] before:transition-[width] before:duration-250 before:ease-out hover:before:w-full' href="">LISTA DE INTERESSE</a>
                    <img className='w-[25px] ml-[10px] inline' src="/icons/clipboard.png" alt="" />
                </p>
                <p>
                    <a className='text-[var(--cinza-escuro)] no-underline text-[small] relative inline-block pb-1 hover:text-[var(--preto-neutro)] hover:font-bold transition-colors duration-250 before:content-[""] before:absolute before:bg-[var(--amarelo-base)] before:right-0 before:bottom-0 before:w-0 before:h-[2px] before:transition-[width] before:duration-250 before:ease-out hover:before:w-full' href="">MEUS PEDIDOS</a>
                    <img className='w-[25px] ml-[10px] inline' src="/icons/parcel.png" alt="" />
                </p>
            </nav>
            <nav className="flex w-1/2 flex-row items-center justify-end p-[1.5%]">
                <img
                    className="w-[35px] cursor-pointer"
                    src="/icons/bookmark.png"
                    alt="Abrir itens salvos"
                    onClick={onOpenDrawer}
                />
            </nav>
        </nav>
    )
}

export default Navbar