document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Member Interactive Tabs
    const tabButtons = document.querySelectorAll('.member-tab-btn');
    const panes = document.querySelectorAll('.member-pane');

    const createInstagramPostUrl = (embedUrl) => {
        try {
            const url = new URL(embedUrl);
            url.pathname = url.pathname.replace(/\/embed\/?$/, '/');
            url.search = '';
            url.hash = '';
            return url.toString();
        } catch (error) {
            return embedUrl.replace(/\/embed\/?$/, '/');
        }
    };

    const addInstagramFallbackLink = (iframe) => {
        const embedUrl = iframe.getAttribute('data-src') || iframe.getAttribute('src') || '';
        if (!embedUrl.includes('instagram.com') || iframe.parentElement.querySelector('.instagram-open-link')) {
            return;
        }

        const link = document.createElement('a');
        link.className = 'instagram-open-link';
        link.href = createInstagramPostUrl(embedUrl);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open on Instagram';
        iframe.insertAdjacentElement('afterend', link);
    };

    // Load iframes dynamically when the tab pane becomes active or scrolled to
    const loadPaneIframes = (pane) => {
        if (!pane) return;
        const iframes = pane.querySelectorAll('iframe[data-src]');
        iframes.forEach(iframe => {
            addInstagramFallbackLink(iframe);
            if (iframe.src === 'about:blank' || iframe.src === '') {
                iframe.src = iframe.getAttribute('data-src');
            }
        });
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    };

    // Unload iframes when the tab pane becomes inactive
    const unloadPaneIframes = (pane) => {
        if (!pane) return;
        const iframes = pane.querySelectorAll('iframe[data-src]');
        iframes.forEach(iframe => {
            iframe.src = 'about:blank';
        });
    };

    // Lazy load default active pane (Mitsuki) only when Biography section comes near viewport
    const bioSection = document.getElementById('biography');
    if (bioSection) {
        let loadedInitialPane = false;
        const bioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loadedInitialPane) {
                    loadedInitialPane = true;
                    const initialActivePane = document.querySelector('.member-pane.active');
                    if (initialActivePane) {
                        loadPaneIframes(initialActivePane);
                    }
                    bioObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });
        bioObserver.observe(bioSection);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const member = btn.getAttribute('data-member');
            
            const currentActivePane = document.querySelector('.member-pane.active');
            if (currentActivePane) {
                unloadPaneIframes(currentActivePane);
            }
            
            tabButtons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(`pane-${member}`);
            if (targetPane) {
                targetPane.classList.add('active');
                loadPaneIframes(targetPane);
            }
        });
    });
});
