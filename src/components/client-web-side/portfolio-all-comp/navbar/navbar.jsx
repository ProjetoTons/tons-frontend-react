import './navbar.css'

function Navbar() {

    return (
        <nav className='navtop'>
            <nav className="active">
                <p className='level1'>
                    <a href="">PORTFÓLIO</a>
                </p>
                <p className='level2'>
                    <a href="">LISTA DE INTERESSE</a>
                </p>
                <p className='level3'>
                    <a href="">ITENS SALVOS</a>
                </p>
                <p className='level4'>
                    <a href="">MEUS PEDIDOS</a>
                </p>
            </nav>
        </nav>
    )
}

export default Navbar