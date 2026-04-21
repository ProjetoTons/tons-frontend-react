import './footer.css'

function Footer() {

    return (
        <footer className="footer">
            <section className="sec">
                <section className="qua-1">
                    <h1>Ton’s personalizados</h1>
                    <p>Ideias que ganham <span>forma.</span></p>
                </section>

                <section className="qua-2">
                    <div className="qua-div-2">
                        <h2>CONTATO</h2>
                        <div>
                            <img className='icon' src="/icons/phone-call.png" alt="" />
                            <p>(11) 9999-9999</p>
                        </div>
                        <div>
                            <img className='icon' src="/icons/email.png" alt="" />
                            <p>email@email.com</p>
                        </div>
                        <div>
                            <img className='icon' src="/icons/illed-point.png" alt="" />
                            <p>endereco</p>
                        </div>
                        <div>
                            <img className='icon' src="/icons/time.png" alt="" />
                            <p>Seg. a Sex das 08h às 18h</p>
                        </div>

                    </div>
                    <div className="qua-div-3">
                        <button>
                            <img className='icon-bu' src="/icons/instagram.png" alt="" />
                        </button>
                        <button>
                            <img className='icon-bu' src="/icons/facebook.png" alt="" />
                        </button>
                        <button>
                            T
                        </button>
                    </div>
                </section>
            </section>

            <section className="sec-2">
                <div className="linha">

                </div>
                <p>
                    © 2026 Nome da Sua Gráfica - Todos os direitos reservados.
                </p>
                <p>SÃO PAULO</p>
            </section>

        </footer>
    )
}

export default Footer