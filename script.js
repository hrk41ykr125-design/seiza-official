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
                // Uncomment to only animate once
                // observer.unobserve(entry.target);
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

    // Load iframes dynamically when the tab pane becomes active
    const loadPaneIframes = (pane) => {
        const iframes = pane.querySelectorAll('iframe[data-src]');
        iframes.forEach(iframe => {
            addInstagramFallbackLink(iframe);
            if (iframe.src === 'about:blank' || iframe.src === '') {
                iframe.src = iframe.getAttribute('data-src');
            }
        });
        // Re-process Instagram embed script if it is loaded
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    };

    // Initialize the default active pane (Mitsuki)
    const initialActivePane = document.querySelector('.member-pane.active');
    if (initialActivePane) {
        loadPaneIframes(initialActivePane);
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const member = btn.getAttribute('data-member');
            
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            const targetPane = document.getElementById(`pane-${member}`);
            if (targetPane) {
                targetPane.classList.add('active');
                // Load iframes for the newly active pane
                loadPaneIframes(targetPane);
            }
        });
    });
});
