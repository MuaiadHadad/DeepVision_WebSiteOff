'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function BiovisionPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [html, setHtml] = useState<string>('<div style="padding:1rem"></div>');

    useEffect(() => {
        fetch('/legacy/biovision.html', { cache: 'no-store' })
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

        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.async = false;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error(`Erro a carregar ${src}`));
                document.body.appendChild(s);
            });

        (window as any).jQuery = (window as any).jQuery || (window as any).$;

        const run = async () => {
            try {
                await loadScript('/legacy/js/jquery.min.js');
                await loadScript('/legacy/js/jquery-migrate-3.0.1.min.js');
                await loadScript('/legacy/js/popper.min.js');
                await loadScript('/legacy/js/bootstrap.min.js');
                await loadScript('/legacy/js/jquery.easing.1.3.js');
                await loadScript('/legacy/js/jquery.waypoints.min.js');

                (function () {
                    const w: any = window;
                    if (w.jQuery && (!w.jQuery.fn || typeof w.jQuery.fn.stellar !== 'function')) {
                        w.jQuery.fn = w.jQuery.fn || {};
                        w.jQuery.fn.stellar = function () { return this; };
                    }
                })();

                await loadScript('/legacy/js/jquery.stellar.min.js');
                await loadScript('/legacy/js/owl.carousel.min.js');
                await loadScript('/legacy/js/jquery.magnific-popup.min.js');
                await loadScript('/legacy/js/aos.js');
                await loadScript('/legacy/js/scrollax.min.js');
                await loadScript('/legacy/js/jquery.animateNumber.min.js');
                await loadScript('/legacy/js/main.js');
                await loadScript('/legacy/js/deepvision-animations.js');
            } catch (e) {
                console.warn('Alguns scripts legacy falharam:', e);
            }
        };

        const id = setTimeout(run, 50);
        return () => clearTimeout(id);
    }, [html]);

    return (
        <>
            <Script id="jquery-global" strategy="beforeInteractive">
                {`window.jQuery = window.jQuery || window.$;`}
            </Script>
            <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
}
