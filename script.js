    // ------------------------- DATOS PREDETERMINADOS -------------------------
    // Tecnologías (6-8 items) con nombre y nivel
    const DEFAULT_SKILLS = [
        { name: "JavaScript / TypeScript", progress: 88 },
        { name: "React & Next.js", progress: 82 },
        { name: "Python (FastAPI/Django)", progress: 79 },
        { name: "Node.js / Express", progress: 85 },
        { name: "SQL (PostgreSQL, MySQL)", progress: 80 },
        { name: "Git & GitHub Actions", progress: 78 },
        { name: "Cloud (AWS/Azure)", progress: 72 },
        { name: "Metodologías Ágiles", progress: 88 }
    ];

    // 8 idiomas para el perfil profesional (nombres y niveles)
    const DEFAULT_LANGUAGES = [
        { name: "Español (nativo)", progress: 100 },
        { name: "Inglés", progress: 92 },
        { name: "Francés", progress: 68 },
        { name: "Alemán", progress: 54 },
        { name: "Portugués", progress: 71 },
        { name: "Italiano", progress: 47 },
        { name: "Mandarín", progress: 33 },
        { name: "Ruso", progress: 28 }
    ];

    // Posts iniciales (bitácora profesional)
    const DEFAULT_POSTS = [
        { id: "blog1", title: "🚀 Lanzamiento de plataforma interna", content: "Implementé un dashboard full-stack con React + FastAPI, reduciendo tiempos de reportes en un 35%. Mejoré la experiencia del equipo de datos.", date: "15 mar 2026" },
        { id: "blog2", title: "📘 Certificación en Arquitectura Cloud", content: "Aprobé la certificación AWS Solutions Architect. Diseñé una arquitectura serverless para el proyecto interno de analytics.", date: "2 feb 2026" },
        { id: "blog3", title: "🗣️ Mentoría técnica + liderazgo", content: "Coordiné un grupo de 4 juniors en la migración de microservicios. Incorporamos pruebas automáticas y mejoramos coverage al 78%.", date: "10 ene 2026" }
    ];

    // ---------- ESTADO ----------
    let skills = [];          // array de {name, progress}
    let languages = [];      // array de {name, progress}
    let blogPosts = [];      // array de {id, title, content, date}

    // Elementos DOM
    const skillsGrid = document.getElementById("skillsGrid");
    const languagesGridEl = document.getElementById("languagesGrid");
    const blogContainer = document.getElementById("blogContainer");
    const publishBtn = document.getElementById("publishBlogBtn");
    const blogTitleInput = document.getElementById("blogTitle");
    const blogContentInput = document.getElementById("blogContent");

    // ---------- helpers ----------
    function saveSkillsToLocal() {
        localStorage.setItem("prof_skills", JSON.stringify(skills));
    }
    function saveLanguagesToLocal() {
        localStorage.setItem("prof_languages", JSON.stringify(languages));
    }
    function saveBlogToLocal() {
        localStorage.setItem("prof_blog", JSON.stringify(blogPosts));
    }

    // carga inicial con localStorage
    function loadInitialData() {
        // Cargar skills
        const storedSkills = localStorage.getItem("prof_skills");
        if (storedSkills) {
            try {
                const parsed = JSON.parse(storedSkills);
                if (Array.isArray(parsed) && parsed.length === DEFAULT_SKILLS.length) {
                    skills = parsed;
                } else {
                    skills = JSON.parse(JSON.stringify(DEFAULT_SKILLS));
                }
            } catch(e) { skills = JSON.parse(JSON.stringify(DEFAULT_SKILLS)); }
        } else {
            skills = JSON.parse(JSON.stringify(DEFAULT_SKILLS));
        }
        
        // Cargar idiomas (debe tener exactamente 8)
        const storedLangs = localStorage.getItem("prof_languages");
        if (storedLangs) {
            try {
                const parsedLangs = JSON.parse(storedLangs);
                if (Array.isArray(parsedLangs) && parsedLangs.length === 8) {
                    languages = parsedLangs;
                } else {
                    languages = JSON.parse(JSON.stringify(DEFAULT_LANGUAGES));
                }
            } catch(e) { languages = JSON.parse(JSON.stringify(DEFAULT_LANGUAGES)); }
        } else {
            languages = JSON.parse(JSON.stringify(DEFAULT_LANGUAGES));
        }

        // cargar blog
        const storedBlog = localStorage.getItem("prof_blog");
        if (storedBlog) {
            try {
                const parsedBlog = JSON.parse(storedBlog);
                if (Array.isArray(parsedBlog)) {
                    blogPosts = parsedBlog;
                } else {
                    blogPosts = [...DEFAULT_POSTS];
                }
            } catch(e) { blogPosts = [...DEFAULT_POSTS]; }
        } else {
            blogPosts = [...DEFAULT_POSTS];
        }
        // asegurar IDs válidos
        blogPosts = blogPosts.map((post, idx) => {
            if (!post.id) return { ...post, id: Date.now() + idx + Math.random() };
            return post;
        });
    }

    // Render competencias técnicas (con barras, slider y edición de nombre)
    function renderSkills() {
        if (!skillsGrid) return;
        skillsGrid.innerHTML = "";
        skills.forEach((skill, idx) => {
            const percent = Math.min(100, Math.max(0, skill.progress));
            const card = document.createElement("div");
            card.className = "skill-card";
            card.dataset.index = idx;
            
            // header nombre + botón editar
            const headerDiv = document.createElement("div");
            headerDiv.className = "item-header";
            const nameDiv = document.createElement("div");
            nameDiv.className = "item-name";
            nameDiv.innerHTML = `
                <span class="skill-name-text">${escapeHtml(skill.name)}</span>
                <button class="edit-btn edit-skill-name" data-idx="${idx}" title="Editar nombre técnico">✏️</button>
            `;
            const percentSpan = document.createElement("div");
            percentSpan.className = "percent-badge";
            percentSpan.innerText = `${percent}%`;
            headerDiv.appendChild(nameDiv);
            headerDiv.appendChild(percentSpan);
            
            // barra horizontal
            const barContainer = document.createElement("div");
            barContainer.className = "progress-bar-container";
            const fill = document.createElement("div");
            fill.className = "progress-fill";
            fill.style.width = `${percent}%`;
            barContainer.appendChild(fill);
            
            // slider
            const sliderDiv = document.createElement("div");
            sliderDiv.className = "slider-container";
            const range = document.createElement("input");
            range.type = "range";
            range.min = 0;
            range.max = 100;
            range.value = percent;
            const valueSpan = document.createElement("span");
            valueSpan.className = "slider-value";
            valueSpan.innerText = `${percent}%`;
            range.addEventListener("input", (e) => {
                const newVal = parseInt(e.target.value, 10);
                valueSpan.innerText = `${newVal}%`;
                fill.style.width = `${newVal}%`;
                skills[idx].progress = newVal;
                percentSpan.innerText = `${newVal}%`;
                saveSkillsToLocal();
                showToastGuardado();
            });
            sliderDiv.appendChild(range);
            sliderDiv.appendChild(valueSpan);
            
            card.appendChild(headerDiv);
            card.appendChild(barContainer);
            card.appendChild(sliderDiv);
            skillsGrid.appendChild(card);
        });
        
        // agregar eventos editar nombre
        document.querySelectorAll(".edit-skill-name").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = btn.getAttribute("data-idx");
                const currentName = skills[idx].name;
                const newName = prompt("Editar nombre de la tecnología / habilidad:", currentName);
                if (newName && newName.trim() !== "") {
                    skills[idx].name = newName.trim().substring(0, 45);
                    const nameSpan = btn.closest(".skill-card")?.querySelector(".skill-name-text");
                    if (nameSpan) nameSpan.innerText = skills[idx].name;
                    saveSkillsToLocal();
                    showToastGuardado();
                }
            });
        });
    }

    // Renderizar 8 idiomas (exactamente 8 barras horizontales)
    function renderLanguages() {
        if (!languagesGridEl) return;
        languagesGridEl.innerHTML = "";
        languages.forEach((lang, idx) => {
            const percent = Math.min(100, Math.max(0, lang.progress));
            const card = document.createElement("div");
            card.className = "lang-card";
            
            const headerDiv = document.createElement("div");
            headerDiv.className = "item-header";
            const nameDiv = document.createElement("div");
            nameDiv.className = "item-name";
            nameDiv.innerHTML = `
                <span class="lang-name-text">${escapeHtml(lang.name)}</span>
                <button class="edit-btn edit-lang-name" data-idx="${idx}" title="Editar idioma">✏️</button>
            `;
            const percentSpan = document.createElement("div");
            percentSpan.className = "percent-badge";
            percentSpan.innerText = `${percent}%`;
            headerDiv.appendChild(nameDiv);
            headerDiv.appendChild(percentSpan);
            
            const barContainer = document.createElement("div");
            barContainer.className = "progress-bar-container";
            const fill = document.createElement("div");
            fill.className = "progress-fill";
            fill.style.width = `${percent}%`;
            barContainer.appendChild(fill);
            
            const sliderDiv = document.createElement("div");
            sliderDiv.className = "slider-container";
            const range = document.createElement("input");
            range.type = "range";
            range.min = 0;
            range.max = 100;
            range.value = percent;
            const valueSpan = document.createElement("span");
            valueSpan.className = "slider-value";
            valueSpan.innerText = `${percent}%`;
            range.addEventListener("input", (e) => {
                const newVal = parseInt(e.target.value, 10);
                valueSpan.innerText = `${newVal}%`;
                fill.style.width = `${newVal}%`;
                languages[idx].progress = newVal;
                percentSpan.innerText = `${newVal}%`;
                saveLanguagesToLocal();
                showToastGuardado();
            });
            sliderDiv.appendChild(range);
            sliderDiv.appendChild(valueSpan);
            
            card.appendChild(headerDiv);
            card.appendChild(barContainer);
            card.appendChild(sliderDiv);
            languagesGridEl.appendChild(card);
        });
        
        // eventos editar nombre idioma
        document.querySelectorAll(".edit-lang-name").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = btn.getAttribute("data-idx");
                const current = languages[idx].name;
                const newName = prompt("Editar nombre del idioma:", current);
                if (newName && newName.trim() !== "") {
                    languages[idx].name = newName.trim().substring(0, 30);
                    const textSpan = btn.closest(".lang-card")?.querySelector(".lang-name-text");
                    if (textSpan) textSpan.innerText = languages[idx].name;
                    saveLanguagesToLocal();
                    showToastGuardado();
                }
            });
        });
    }

    // Bitácora profesional: mostrar posts
    function renderBlog() {
        if (!blogContainer) return;
        if (!blogPosts.length) {
            blogContainer.innerHTML = `<div class="empty-message">📌 Aún no hay entradas. Publica tu primer hito profesional.</div>`;
            return;
        }
        blogContainer.innerHTML = "";
        // ordenar más reciente primero (por fecha descendente)
        const sorted = [...blogPosts].sort((a,b) => new Date(b.date) - new Date(a.date));
        sorted.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post-card";
            postDiv.dataset.id = post.id;
            const titleDiv = document.createElement("div");
            titleDiv.className = "post-title";
            titleDiv.innerHTML = `
                <span>📌 ${escapeHtml(post.title)}</span>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <span class="post-date">${escapeHtml(post.date)}</span>
                    <button class="delete-post" data-id="${post.id}" title="Eliminar entrada">🗑️</button>
                </div>
            `;
            const contentDiv = document.createElement("div");
            contentDiv.className = "post-content";
            contentDiv.innerText = post.content;
            postDiv.appendChild(titleDiv);
            postDiv.appendChild(contentDiv);
            blogContainer.appendChild(postDiv);
        });
        
        // eventos eliminar
        document.querySelectorAll(".delete-post").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = btn.getAttribute("data-id");
                deleteBlogPost(id);
            });
        });
    }
    
    function deleteBlogPost(id) {
        blogPosts = blogPosts.filter(p => p.id !== id);
        saveBlogToLocal();
        renderBlog();
        showToastGuardado();
    }
    
    function addBlogPost(title, content) {
        if (!title.trim() || !content.trim()) {
            alert("❌ Por favor, escribe título y contenido para tu bitácora profesional.");
            return false;
        }
        const today = new Date();
        const formattedDate = today.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
        const newPost = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
            title: title.trim().substring(0, 100),
            content: content.trim().substring(0, 1000),
            date: formattedDate
        };
        blogPosts.unshift(newPost);
        saveBlogToLocal();
        renderBlog();
        return true;
    }
    
    function showToastGuardado() {
        const toast = document.getElementById("saveToast");
        if (toast) {
            toast.innerText = "✓ guardado";
            setTimeout(() => { if(toast) toast.innerText = ""; }, 1500);
        }
    }
    
    // escucha cambios externos (multiple pestañas)
    function bindStorageEvents() {
        window.addEventListener("storage", (e) => {
            if (e.key === "prof_skills") {
                const fresh = localStorage.getItem("prof_skills");
                if (fresh) { skills = JSON.parse(fresh); renderSkills(); }
            }
            if (e.key === "prof_languages") {
                const freshLang = localStorage.getItem("prof_languages");
                if (freshLang) { languages = JSON.parse(freshLang); renderLanguages(); }
            }
            if (e.key === "prof_blog") {
                const freshBlog = localStorage.getItem("prof_blog");
                if (freshBlog) { blogPosts = JSON.parse(freshBlog); renderBlog(); }
            }
        });
    }
    
    function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // inicializar toda la aplicación
    function init() {
        loadInitialData();
        renderSkills();
        renderLanguages();
        renderBlog();
        bindStorageEvents();
        
        if (publishBtn) {
            publishBtn.addEventListener("click", () => {
                const title = blogTitleInput.value;
                const content = blogContentInput.value;
                if (addBlogPost(title, content)) {
                    blogTitleInput.value = "";
                    blogContentInput.value = "";
                    showToastGuardado();
                }
            });
        }
        // atajo ctrl+enter en textarea blog
        if (blogContentInput) {
            blogContentInput.addEventListener("keydown", (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    publishBtn.click();
                }
            });
        }
        // auto guardado periódico opcional (ya se guarda en cada cambio)
        setInterval(() => {
            saveSkillsToLocal();
            saveLanguagesToLocal();
            saveBlogToLocal();
        }, 30000);
    }
    
    init();
