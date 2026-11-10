(() => {
    const EXT_ID = 'st-helper-panel';
    const PANEL_ID = 'st-helper-panel-root';
    const TOGGLE_ID = 'st-helper-panel-toggle';
    const STORAGE_KEY = `${EXT_ID}-open`;

    function getSavedOpenState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === null ? true : saved === 'true';
        } catch (error) {
            return true;
        }
    }

    function setPanelOpenState(open) {
        const panel = document.getElementById(PANEL_ID);
        const toggle = document.getElementById(TOGGLE_ID);
        if (panel) {
            panel.dataset.open = String(open);
            panel.setAttribute('aria-hidden', String(!open));
            panel.style.display = open ? 'flex' : 'none';
        }

        if (toggle) {
            toggle.setAttribute('aria-pressed', String(open));
            toggle.title = open ? 'Hide ST Helper Panel' : 'Show ST Helper Panel';
        }

        try {
            localStorage.setItem(STORAGE_KEY, String(open));
        } catch (error) {
            // Ignore localStorage issues.
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.className = 'st-helper-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'ST Helper Panel');
        panel.innerHTML = `
            <div class="st-helper-panel-header">
                <span>ST Helper Panel</span>
                <button type="button" class="st-helper-close" aria-label="Close helper panel">×</button>
            </div>
            <div class="st-helper-panel-body">
                <button type="button" class="st-helper-action" data-action="quick-refresh">Refresh page</button>
                <button type="button" class="st-helper-action" data-action="toggle-theme">Toggle theme</button>
                <button type="button" class="st-helper-action" data-action="scroll-top">Scroll to top</button>
            </div>
        `;

        const closeButton = panel.querySelector('.st-helper-close');
        closeButton?.addEventListener('click', () => setPanelOpenState(false));

        panel.querySelectorAll('[data-action]').forEach((button) => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                switch (action) {
                    case 'quick-refresh':
                        window.location.reload();
                        break;
                    case 'toggle-theme':
                        document.body.classList.toggle('st-helper-dark');
                        break;
                    case 'scroll-top':
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    default:
                        break;
                }
            });
        });

        return panel;
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = TOGGLE_ID;
        button.type = 'button';
        button.className = 'st-helper-toggle';
        button.textContent = '🧩';
        button.title = 'Show ST Helper Panel';
        button.setAttribute('aria-label', 'Toggle ST Helper Panel');
        button.setAttribute('aria-pressed', 'true');
        button.addEventListener('click', () => {
            const panel = document.getElementById(PANEL_ID);
            const isOpen = panel ? panel.dataset.open !== 'false' : true;
            setPanelOpenState(!isOpen);
        });
        return button;
    }

    function installUI() {
        if (document.getElementById(TOGGLE_ID)) {
            return;
        }

        const toggleButton = createToggleButton();
        document.body.appendChild(toggleButton);

        let panel = document.getElementById(PANEL_ID);
        if (!panel) {
            panel = createPanel();
            document.body.appendChild(panel);
        }

        const shouldBeOpen = getSavedOpenState();
        setPanelOpenState(shouldBeOpen);
    }

    function bindShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.altKey && event.key.toLowerCase() === 'h') {
                const panel = document.getElementById(PANEL_ID);
                const isOpen = panel ? panel.dataset.open === 'true' : false;
                setPanelOpenState(!isOpen);
            }
        });
    }

    function init() {
        installUI();
        bindShortcuts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
