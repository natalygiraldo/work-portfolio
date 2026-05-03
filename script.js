    // ------------------------- DEFAULT DATA (ENGLISH ORIENTED) -------------------------
    // Technical skills (keep names in English, levels as example)
    const DEFAULT_SKILLS = [
        { name: "JavaScript / TypeScript", progress: 88 },
        { name: "React & Next.js", progress: 82 },
        { name: "Python (FastAPI/Django)", progress: 79 },
        { name: "Node.js / Express", progress: 85 },
        { name: "SQL (PostgreSQL, MySQL)", progress: 80 },
        { name: "Git & GitHub Actions", progress: 78 },
        { name: "Cloud (AWS/Azure)", progress: 72 },
        { name: "Agile Methodologies", progress: 88 }
    ];

    // 8 languages (names can be edited, but interface in English)
    const DEFAULT_LANGUAGES = [
        { name: "Spanish (native)", progress: 100 },
        { name: "English", progress: 92 },
        { name: "French", progress: 68 },
        { name: "German", progress: 54 },
        { name: "Portuguese", progress: 71 },
        { name: "Italian", progress: 47 },
        { name: "Mandarin", progress: 33 },
        { name: "Russian", progress: 28 }
    ];

    // Initial blog posts (in English)
    const DEFAULT_POSTS = [
        { id: "blog1", title: "🚀 Launched internal platform", content: "I built a full‑stack dashboard with React + FastAPI, reducing reporting time by 35%. Improved team data experience.", date: "15 Mar 2026" },
        { id: "blog2", title: "📘 AWS Solutions Architect certified", content: "Earned the AWS Solutions Architect cert. Designed a serverless architecture for the internal analytics project.", date: "2 Feb 2026" },
        { id: "blog3", title: "🗣️ Mentorship & technical leadership", content: "Coordinated 4 juniors in migrating microservices. Added automated tests, increased coverage to 78%.", date: "10 Jan 2026" }
    ];

    // ---------- STATE ----------
    let skills = [];          // array of {name, progress}
    let languages = [];      // array of {name, progress}
    let blogPosts = [];      // array of {id, title, content, date}

    // DOM elements
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

    // load initial data from localStorage or defaults
    function loadInitialData() {
        // Load skills
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
        
        // Load languages (must be exactly 8)
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

        // Load blog
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
        // ensure IDs
        blogPosts = blogPosts.map((post, idx) => {
            if (!post.id) return { ...post, id: Date.now() + idx + Math.random() };
            return post;
        });
    }

    // Render technical skills (with bar, slider, editable name)
    function renderSkills() {
        if (!skillsGrid) return;
        skillsGrid.innerHTML = "";
        skills.forEach((skill, idx) => {
            const percent = Math.min(100, Math.max(0, skill.progress));
            const card = document.createElement("div");
            card.className = "skill-card";
            card.dataset.index = idx;
            
            const headerDiv = document.createElement("div");
            headerDiv.className = "item-header";
            const nameDiv = document.createElement("div");
            nameDiv.className = "item-name";
            nameDiv.innerHTML = `
                <span class="skill-name-text">${escapeHtml(skill.name)}</span>
                <button class="edit-btn edit-skill-name" data-idx="${idx}" title="Edit skill name">✏️</button>
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
                skills[idx].progress = newVal;
                percentSpan.innerText = `${newVal}%`;
                saveSkillsToLocal();
                showToastSaved();
            });
            sliderDiv.appendChild(range);
            sliderDiv.appendChild(valueSpan);
            
            card.appendChild(headerDiv);
            card.appendChild(barContainer);
            card.appendChild(sliderDiv);
            skillsGrid.appendChild(card);
        });
        
        // attach edit name events
        document.querySelectorAll(".edit-skill-name").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = btn.getAttribute("data-idx");
                const currentName = skills[idx].name;
                const newName = prompt("Edit skill / technology name:", currentName);
                if (newName && newName.trim() !== "") {
                    skills[idx].name = newName.trim().substring(0, 45);
                    const nameSpan = btn.closest(".skill-card")?.querySelector(".skill-name-text");
                    if (nameSpan) nameSpan.innerText = skills[idx].name;
                    saveSkillsToLocal();
                    showToastSaved();
                }
            });
        });
    }

    // Render 8 languages (exactly 8 horizontal bars)
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
                <button class="edit-btn edit-lang-name" data-idx="${idx}" title="Edit language name">✏️</button>
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
                showToastSaved();
            });
            sliderDiv.appendChild(range);
            sliderDiv.appendChild(valueSpan);
            
            card.appendChild(headerDiv);
            card.appendChild(barContainer);
            card.appendChild(sliderDiv);
            languagesGridEl.appendChild(card);
        });
        
        // edit language name events
        document.querySelectorAll(".edit-lang-name").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = btn.getAttribute("data-idx");
                const current = languages[idx].name;
                const newName = prompt("Edit language name:", current);
                if (newName && newName.trim() !== "") {
                    languages[idx].name = newName.trim().substring(0, 30);
                    const textSpan = btn.closest(".lang-card")?.querySelector(".lang-name-text");
                    if (textSpan) textSpan.innerText = languages[idx].name;
                    saveLanguagesToLocal();
                    showToastSaved();
                }
            });
        });
    }

    // Professional blog render
    function renderBlog() {
        if (!blogContainer) return;
        if (!blogPosts.length) {
            blogContainer.innerHTML = `<div class="empty-message">📌 No entries yet. Publish your first professional milestone.</div>`;
            return;
        }
        blogContainer.innerHTML = "";
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
                    <button class="delete-post" data-id="${post.id}" title="Delete entry">🗑️</button>
                </div>
            `;
            const contentDiv = document.createElement("div");
            contentDiv.className = "post-content";
            contentDiv.innerText = post.content;
            postDiv.appendChild(titleDiv);
            postDiv.appendChild(contentDiv);
            blogContainer.appendChild(postDiv);
        });
        
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
        showToastSaved();
    }
    
    function addBlogPost(title, content) {
        if (!title.trim() || !content.trim()) {
            alert("❌ Please enter both title and content for your professional logbook.");
            return false;
        }
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    
    function showToastSaved() {
        const toast = document.getElementById("saveToast");
        if (toast) {
            toast.innerText = "✓ saved";
            setTimeout(() => { if(toast) toast.innerText = ""; }, 1500);
        }
    }
    
    // cross-tab sync
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

    // initialize app
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
                    showToastSaved();
                }
            });
        }
        // Ctrl+Enter shortcut for blog textarea
        if (blogContentInput) {
            blogContentInput.addEventListener("keydown", (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    publishBtn.click();
                }
            });
        }
        // periodic auto-save (though already saved on each change)
        setInterval(() => {
            saveSkillsToLocal();
            saveLanguagesToLocal();
            saveBlogToLocal();
        }, 30000);
    }
    
    init();
