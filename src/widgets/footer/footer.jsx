function Footer() {

    return (
        <footer className="bg-[var(--preto-neutro)] text-[var(--branco)] pt-10 px-4 pb-5 font-[var(--fonte-inter)] sm:px-6 md:pt-[60px] md:px-10 lg:px-20">
            <section className="flex justify-between items-start flex-wrap gap-8 mb-8 md:gap-10 md:mb-10 max-md:flex-col">
                <section className="flex-1 min-w-0 md:min-w-[250px]">
                    <h1 className="font-[var(--fonte-space)] text-3xl sm:text-4xl md:text-[40px] font-bold uppercase leading-tight mb-3 md:mb-[15px] break-words">Ton's personalizados</h1>
                    <p className="text-[var(--cinza-base)] text-sm leading-relaxed max-w-[250px]">Ideias que ganham <span>forma.</span></p>
                </section>

                <section className="flex-1 min-w-0 flex flex-col gap-6 md:gap-[30px]">
                    <div>
                        <h2 className="text-[var(--amarelo-base)] text-sm tracking-[1px] mb-4 md:mb-5">CONTATO</h2>
                        <div className="flex items-start gap-3 mb-3">
                            <img className='w-[18px] h-[18px] shrink-0' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/phone-call.png" alt="" />
                            <p className="min-w-0 text-sm text-[var(--branco)] break-words">(11) 95385-8339</p>
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                            <img className='w-[18px] h-[18px] shrink-0' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/email.png" alt="" />
                            <p className="min-w-0 text-sm text-[var(--branco)] break-all">tonspersonalizados@gmail.com</p>
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                            <img className='w-[18px] h-[18px] shrink-0' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/illed-point.png" alt="" />
                            <p className="min-w-0 text-sm text-[var(--branco)] break-words">Rua Adolfo Appia, 177 - Jardim Cibele, São Paulo - SP, 08260-210</p>
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                            <img className='w-[18px] h-[18px] shrink-0' style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(61%) saturate(2331%) hue-rotate(354deg) brightness(103%) contrast(94%)' }} src="/icons/time.png" alt="" />
                            <p className="min-w-0 text-sm text-[var(--branco)] break-words">Seg. a Sex das 09:00 às 17:30.</p>
                        </div>

                    </div>
                    <div className="flex gap-[10px]">
                        <a href="https://www.instagram.com/tonspersonalizados/" target="_blank" rel="noopener noreferrer" className="w-[50px] h-[50px] rounded-lg border border-[var(--cinza-escuro)] bg-transparent text-[var(--branco)] cursor-pointer transition-colors duration-300 flex justify-center items-center hover:bg-[var(--preto-neutro)] hover:border-[var(--amarelo-base)]">
                            <img className='w-[25px]' src="/icons/instagram.png" alt="Instagram" />
                        </a>
                        <a href="https://www.facebook.com/TonsPersonalizados/" target="_blank" rel="noopener noreferrer" className="w-[50px] h-[50px] rounded-lg border border-[var(--cinza-escuro)] bg-transparent text-[var(--branco)] cursor-pointer transition-colors duration-300 flex justify-center items-center hover:bg-[var(--preto-neutro)] hover:border-[var(--amarelo-base)]">
                            <img className='w-[25px]' src="/icons/facebook.png" alt="Facebook" />
                        </a>
                    </div>
                </section>
            </section>

            <section className="flex flex-wrap justify-between items-center gap-3 pt-5 border-t border-white/10 text-center max-md:flex-col max-md:gap-4 md:pt-[30px]">
                <div className="hidden md:block"></div>
                <p className="text-[10px] text-[var(--cinza-escuro)] uppercase tracking-wide sm:text-xs sm:tracking-[1px]">
                    © 2026 Ton's Personalizados - Todos os direitos reservados.
                </p>
                <p className="text-[10px] text-[var(--cinza-escuro)] uppercase tracking-wide font-bold sm:text-xs sm:tracking-[1px] md:text-right">SÃO PAULO</p>
            </section>

        </footer>
    )
}

export default Footer
