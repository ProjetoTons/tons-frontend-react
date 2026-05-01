function DestaqueBanner() {

    return (
        <section className='flex justify-center mt-[50px]'>
            <div className="relative w-full h-[420px] overflow-hidden font-sans">

                <img src="/logo-tons/ex-banner-ecobag.jpeg" alt="industrial" className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.75)_30%,rgba(0,0,0,0.3)_60%,transparent_100%)]"></div>

                <div className="absolute top-1/2 left-[60px] -translate-y-1/2 text-white max-w-[500px]">
                    <span className="inline-block bg-[#f5c400] text-black text-xs font-bold px-[10px] py-[6px] mb-[15px] tracking-[1px]">ECO BAG</span>

                    <h1 className="text-5xl leading-[1.05] mb-[15px] font-extrabold">
                        PRODUTOS <br />
                        DESTAQUE <br />
                        DO MÊS
                    </h1>

                    <p className="text-sm text-[#ccc] mb-[25px] leading-[1.5]">
                        A seleção curada de acabamentos premium que estão
                        definindo o padrão visual desta temporada.
                    </p>

                    <button className="font-[family-name:var(--fonte-space)] bg-white text-black border-none py-3 px-[22px] font-bold cursor-pointer inline-flex items-center gap-[10px] transition-colors duration-300 hover:bg-[#eaeaea]">
                        VER COLEÇÃO <span className="text-lg">→</span>
                    </button>
                </div>
            </div>
        </section>

    )
}

export default DestaqueBanner