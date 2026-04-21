import './navbar.css'

function Navbar({ onOpenDrawer }) {

    return (
        <nav className='navtop'>
            <nav className="active1">
                <img className='logo-inicio' src="/logo-tons/Logo Hefestos Nome.png" alt="" />
            </nav>
            <nav className="active">
                {/* <p className='level1'>
                    <a href="">PORTFÓLIO</a>
                </p> */}
                <p className='level2'>
                    <a href="">LISTA DE INTERESSE</a>
                    <img className='icon' src="/icons/clipboard.png" alt="" />
                </p>
                {/* <p className='level3'>
                    <a href="">ITENS SALVOS</a>
                </p> */}
                <p className='level4'>
                    <a href="">MEUS PEDIDOS</a>
                    <img className='icon' src="/icons/parcel.png" alt="" />

                </p>
            </nav>
            <nav className="active3">
                <img
                    className="lista-salvos"
                    src="/icons/bookmark.png"
                    alt="Abrir itens salvos"
                    onClick={onOpenDrawer} // AQUI ESTÁ O SEGREDO
                    style={{ cursor: 'pointer' }} // Adicione isso para o usuário saber que é clicável
                />
            </nav>
        </nav>
    )
}

export default Navbar