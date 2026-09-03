'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import './globals.css';

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [html, setHtml] = useState<string>('<div style="padding:1rem"></div>');

    // 1) Carregar HTML legado
    useEffect(() => {
        fetch('/legacy/index.html', { cache: 'no-store' })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch legacy HTML');
                return res.text();
            })
            .then((txt) => setHtml(txt))
            .catch((err) => {
                console.error(err);
                setHtml('<div style="padding:2rem;font-family:sans-serif">Falha ao carregar a página legacy.</div>');
            });
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        // helper para carregar scripts um a um
        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.async = false;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error(`Erro a carregar ${src}`));
                document.body.appendChild(s);
            });

        // Guardas que evitam crashes
        (window as any).jQuery = (window as any).jQuery || (window as any).$;

        const run = async () => {
            try {
                // === ORDEM CRÍTICA ===
                await loadScript('/legacy/js/jquery.min.js');
                await loadScript('/legacy/js/jquery-migrate-3.0.1.min.js');

                // Bootstrap deps
                await loadScript('/legacy/js/popper.min.js');
                await loadScript('/legacy/js/bootstrap.min.js');

                // Plugins jQuery
                await loadScript('/legacy/js/jquery.easing.1.3.js');
                await loadScript('/legacy/js/jquery.waypoints.min.js');

                // Patch: se Stellar não existir, criar no-op para evitar branco
                (function () {
                    const w: any = window;
                    if (w.jQuery && (!w.jQuery.fn || typeof w.jQuery.fn.stellar !== 'function')) {
                        w.jQuery.fn = w.jQuery.fn || {};
                        w.jQuery.fn.stellar = function () {
                            return this;
                        };
                    }
                })();

                await loadScript('/legacy/js/jquery.stellar.min.js');
                await loadScript('/legacy/js/owl.carousel.min.js');
                await loadScript('/legacy/js/jquery.magnific-popup.min.js');
                await loadScript('/legacy/js/aos.js');
                await loadScript('/legacy/js/scrollax.min.js');
                await loadScript('/legacy/js/jquery.animateNumber.min.js');

                // Google Maps (opcional; se der erro, comenta as 2 próximas linhas)
                // await loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&sensor=false');
                // await loadScript('/legacy/js/google-map.js');

                // Por fim, o main.js (inicializa tudo)
                await loadScript('/legacy/js/main.js');

                // Animações avançadas DeepVision
                await loadScript('/legacy/js/deepvision-animations.js');
            } catch (e) {
                console.warn('Alguns scripts legacy falharam:', e);
            }
        };

        // Pequeno atraso para garantir que o HTML já foi pintado
        const id = setTimeout(run, 50);
        return () => clearTimeout(id);
    }, [html]);

    return (
        <>
            {/* Garante jQuery no window ANTES de tudo (fallback) */}
            <Script id="jquery-global" strategy="beforeInteractive">
                {`window.jQuery = window.jQuery || window.$;`}
            </Script>

            {/* Injeta HTML legado */}
            <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
}
