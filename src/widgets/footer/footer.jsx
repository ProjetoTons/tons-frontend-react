function Footer() {

    return (
        <footer className="bg-[var(--preto-neutro)] text-[var(--branco)] pt-[60px] px-[80px] pb-5 font-[var(--fonte-inter)] max-md:px-5 max-md:pt-10">
            <section className="flex justify-between items-start flex-wrap gap-10 mb-10 max-md:flex-col">
                <section className="flex-1 min-w-[250px]">
                    <h1 className="font-[var(--fonte-space)] text-[40px] font-bold uppercase mb-[15px]">Ton's personalizados</h1>
                    <p className="text-[var(--cinza-base)] text-sm leading-relaxed max-w-[250px]">Ideias que ganham <span>forma.</span></p>
                </section>

                <section className="flex-1 flex flex-col gap-[30px]">
                    <div>
                        <h2 className="text-[var(--amarelo-base)] text-sm tracking-[1px] mb-5">CONTATO</h2>
                        <div className="flex items-center gap-3 mb-3">
                            <img className='w-[18px] h-[18px]' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/phone-call.png" alt="" />
                            <p className="text-sm text-[var(--branco)]">(11) 9999-9999</p>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <img className='w-[18px] h-[18px]' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/email.png" alt="" />
                            <p className="text-sm text-[var(--branco)]">email@email.com</p>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <img className='w-[18px] h-[18px]' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/illed-point.png" alt="" />
                            <p className="text-sm text-[var(--branco)]">endereco</p>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <img className='w-[18px] h-[18px]' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/time.png" alt="" />
                            <p className="text-sm text-[var(--branco)]">Seg. a Sex das 08h às 18h</p>
                        </div>

                    </div>
                    <div className="flex gap-[10px]">
                        <button className="w-[50px] h-[50px] rounded-lg border border-[var(--cinza-escuro)] bg-transparent text-[var(--branco)] cursor-pointer transition-colors duration-300 flex justify-center items-center hover:bg-[var(--preto-neutro)] hover:border-[var(--amarelo-base)]">
                            <img className='w-[25px]' src="/icons/instagram.png" alt="" />
                        </button>
                        <button className="w-[50px] h-[50px] rounded-lg border border-[var(--cinza-escuro)] bg-transparent text-[var(--branco)] cursor-pointer transition-colors duration-300 flex justify-center items-center hover:bg-[var(--preto-neutro)] hover:border-[var(--amarelo-base)]">
                            <img className='w-[25px]' src="/icons/facebook.png" alt="" />
                        </button>
                        <button className="w-[50px] h-[50px] rounded-lg border border-[var(--cinza-escuro)] bg-transparent text-[var(--branco)] cursor-pointer transition-colors duration-300 flex justify-center items-center hover:bg-[var(--preto-neutro)] hover:border-[var(--amarelo-base)]">
                            T
                        </button>
                    </div>
                </section>
            </section>

            <section className="flex flex-wrap justify-between items-center pt-[30px] border-t border-white/10 max-md:flex-col max-md:gap-5 max-md:text-center">
                <div></div>
                <p className="text-xs text-[var(--cinza-escuro)] uppercase tracking-[1px]">
                    © 2026 Nome da Sua Gráfica - Todos os direitos reservados.
                </p>
                <p className="text-xs text-[var(--cinza-escuro)] uppercase tracking-[1px] font-bold">SÃO PAULO</p>
            </section>

        </footer>
    )
}

export default Footer
