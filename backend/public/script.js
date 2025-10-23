document.addEventListener('DOMContentLoaded', () => {

    const baseUrl = '/api';
    const keywordsApiUrl = `${baseUrl}/publico/keywords`;
    const knowledgesApiUrl = `${baseUrl}/publico/knowledges`;
    const alunosApiUrl = `${baseUrl}/publico/alunos`;
    const loginApiUrl = `${baseUrl}/auth/login`;
    const projetosCrudApiUrl = `${baseUrl}/projetos`;
    const projetoApiUrl = `${baseUrl}/publico/projetos`;
    const studentKnowledgesApiUrl = `${baseUrl}/projetos/student/knowledges`;
    const adminApiUrl = `${baseUrl}/admin`;

    const container = document.getElementById('projetos-container');
    const loginBtn = document.getElementById('login-btn');
    const addProjectBtn = document.getElementById('add-project-btn');
    const myKnowledgeBtn = document.getElementById('my-knowledge-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const loginModal = document.getElementById('login-modal');
    const addProjectModal = document.getElementById('add-project-modal');
    const editProjectModal = document.getElementById('edit-project-modal');
    const knowledgeModal = document.getElementById('knowledge-modal');
    const adminModal = document.getElementById('admin-modal');
    const loginForm = document.getElementById('login-form');
    const addProjectForm = document.getElementById('add-project-form');
    const editProjectForm = document.getElementById('edit-project-form');
    const knowledgeForm = document.getElementById('knowledge-form');
    const createStudentForm = document.getElementById('create-student-form');
    const createKeywordForm = document.getElementById('create-keyword-form');
    const createKnowledgeForm = document.getElementById('create-knowledge-form');
    const studentListContainer = document.getElementById('student-list-container');
    const keywordListContainer = document.getElementById('keyword-list-container');
    const knowledgeAdminListContainer = document.getElementById('knowledge-admin-list-container');

    const atualizarUI = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            loginBtn.classList.add('hidden');
            addProjectBtn.classList.remove('hidden');
            myKnowledgeBtn.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            userInfo.textContent = `Logado como: ${user.nome}`;
            if (user.perfil === 'admin') {
                adminPanelBtn.classList.remove('hidden');
            } else {
                adminPanelBtn.classList.add('hidden');
            }
        } else {
            loginBtn.classList.remove('hidden');
            addProjectBtn.classList.add('hidden');
            myKnowledgeBtn.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            userInfo.textContent = '';
            adminPanelBtn.classList.add('hidden');
        }
        atualizarBotoesCard();
    };
    
    const atualizarBotoesCard = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        document.querySelectorAll('.card').forEach(card => {
            const actionsContainer = card.querySelector('.card-actions');
            if (!actionsContainer) return; 
            actionsContainer.innerHTML = ''; 
            const projectId = card.dataset.projectId; 
            try {
                const devIds = JSON.parse(card.dataset.devIds || '[]'); 
                const isAdmin = user && user.perfil === 'admin';
                const isOwner = user && devIds.includes(user._id);
                if (isAdmin || isOwner) { 
                    actionsContainer.innerHTML = `
                        <button class="edit-btn" data-id="${projectId}">Editar</button>
                        <button class="delete-btn" data-id="${projectId}">Excluir</button>
                    `;
                }
            } catch (e) { console.error("Erro ao processar IDs de desenvolvedores no card:", e); }
        });
    };

    const popularCheckboxes = async (url, containerElement, checkedIds = []) => {
        containerElement.innerHTML = '<p>Carregando...</p>';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar dados para checkboxes');
            const items = await response.json();
            containerElement.innerHTML = '';
            items.forEach(item => {
                const itemId = item.id || item._id; 
                const isChecked = checkedIds.includes(itemId) ? 'checked' : '';
                const div = document.createElement('div');
                div.className = 'keyword-option'; 
                div.innerHTML = `
                    <input type="checkbox" id="chk-${itemId}-${containerElement.id}" value="${itemId}" name="keywords" ${isChecked}>
                    <label for="chk-${itemId}-${containerElement.id}">${item.nome}</label>
                `;
                containerElement.appendChild(div);
            });
             if (containerElement.innerHTML === '') {
                containerElement.innerHTML = '<p>Nenhuma opção cadastrada.</p>';
            }
        } catch (error) {
            console.error(error);
            containerElement.innerHTML = '<p class="error">Não foi possível carregar as opções.</p>';
        }
    };

    const popularCheckboxesAlunos = async (containerElement, checkedIds = []) => {
        containerElement.innerHTML = '<p>Carregando...</p>';
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserId = user ? user._id : null;
        try {
            const response = await fetch(alunosApiUrl);
            if (!response.ok) throw new Error('Erro ao buscar alunos');
            const alunos = await response.json();
            containerElement.innerHTML = '';
            let count = 0;
            alunos.forEach(aluno => {
                if (aluno._id !== currentUserId) {
                    count++;
                    const isChecked = checkedIds.includes(aluno._id) ? 'checked' : '';
                    const div = document.createElement('div');
                    div.className = 'developer-option';
                    div.innerHTML = `
                        <input type="checkbox" id="dev-${aluno._id}-${containerElement.id}" value="${aluno._id}" name="developers" ${isChecked}>
                        <label for="dev-${aluno._id}-${containerElement.id}">${aluno.nome}</label>
                    `;
                    containerElement.appendChild(div);
                }
            });
            if (count === 0) {
                containerElement.innerHTML = '<p>Nenhum outro aluno cadastrado.</p>';
            }
        } catch (error) {
            console.error(error);
            containerElement.innerHTML = '<p class="error">Não foi possível carregar os alunos.</p>';
        }
    };
    
    const carregarListaDeAlunos = async () => {
        studentListContainer.innerHTML = '<p>Carregando...</p>';
        const token = localStorage.getItem('token');
        if (!token) {
             studentListContainer.innerHTML = '<p class="error">Erro: Token de administrador não encontrado.</p>';
             return;
        }
        try {
            const response = await fetch(`${adminApiUrl}/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) throw new Error('Não autorizado (token inválido?).');
            if (!response.ok) throw new Error(`Falha ao buscar alunos (${response.status})`);
            const alunos = await response.json();
            studentListContainer.innerHTML = '';
            if (alunos.length === 0) {
                studentListContainer.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
            } else {
                alunos.forEach(aluno => {
                    const item = document.createElement('div');
                    item.className = 'student-list-item';
                    item.innerHTML = `
                        <span>${aluno.nome} (${aluno.email})</span>
                        <button class="student-delete-btn" data-id="${aluno._id}">Excluir</button>
                    `;
                    studentListContainer.appendChild(item);
                });
            }
        } catch (error) {
            console.error(error);
            studentListContainer.innerHTML = `<p class="error">Não foi possível carregar a lista de alunos. ${error.message}</p>`;
        }
    };

    const carregarListaDePalavrasChave = async () => {
        keywordListContainer.innerHTML = '<p>Carregando...</p>';
        try {
            const response = await fetch(keywordsApiUrl);
            if (!response.ok) throw new Error('Falha ao buscar palavras-chave.');
            const keywords = await response.json();
            keywordListContainer.innerHTML = '';
            if (keywords.length === 0) {
                keywordListContainer.innerHTML = '<p>Nenhuma palavra-chave cadastrada.</p>';
            } else {
                keywords.forEach(kw => {
                    const item = document.createElement('div');
                    item.className = 'keyword-list-item';
                    item.innerHTML = `
                        <span>${kw.nome}</span>
                        <button class="keyword-delete-btn" data-id="${kw._id}">Excluir</button>
                    `;
                    keywordListContainer.appendChild(item);
                });
            }
        } catch (error) {
            console.error(error);
            keywordListContainer.innerHTML = '<p class="error">Não foi possível carregar a lista.</p>';
        }
    };

    const carregarListaDeConhecimentosAdmin = async () => {
        knowledgeAdminListContainer.innerHTML = '<p>Carregando...</p>';
        try {
            const response = await fetch(knowledgesApiUrl);
            if (!response.ok) throw new Error('Falha ao buscar conhecimentos.');
            const knowledges = await response.json();
            knowledgeAdminListContainer.innerHTML = '';
            if (knowledges.length === 0) {
                knowledgeAdminListContainer.innerHTML = '<p>Nenhum conhecimento cadastrado.</p>';
            } else {
                knowledges.forEach(kn => {
                    const item = document.createElement('div');
                    item.className = 'knowledge-list-item-admin';
                    item.innerHTML = `
                        <span>${kn.nome}</span>
                        <button class="knowledge-delete-btn" data-id="${kn.id}">Excluir</button>
                    `;
                    knowledgeAdminListContainer.appendChild(item);
                });
            }
        } catch (error) {
            console.error(error);
            knowledgeAdminListContainer.innerHTML = '<p class="error">Não foi possível carregar a lista.</p>';
        }
    };
    
    searchForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        const termo = searchInput.value.trim();
        window.location.href = `/?search=${encodeURIComponent(termo)}`;
    });
    searchInput.addEventListener('input', (e) => { 
        if (e.target.value === '') { 
            window.location.href = `/`; 
        } 
    });

    loginBtn.addEventListener('click', () => { loginModal.classList.remove('hidden'); });
    logoutBtn.addEventListener('click', () => { 
        localStorage.clear(); 
        atualizarUI(); 
    });
    addProjectBtn.addEventListener('click', () => { 
        const keywordsContainer = document.getElementById('proj-keywords-container');
        const devsContainer = document.getElementById('proj-devs-container');
        addProjectForm.reset();
        popularCheckboxes(keywordsApiUrl, keywordsContainer);
        popularCheckboxesAlunos(devsContainer);
        addProjectModal.classList.remove('hidden');
    });
    myKnowledgeBtn.addEventListener('click', async () => { 
        const listContainer = document.getElementById('knowledge-list-container');
        listContainer.innerHTML = '<p>Carregando...</p>';
        knowledgeModal.classList.remove('hidden');
        const token = localStorage.getItem('token');
        try {
            const allKnowledgesResponse = await fetch(knowledgesApiUrl);
            if (!allKnowledgesResponse.ok) throw new Error('Erro ao buscar lista de conhecimentos');
            const allKnowledges = await allKnowledgesResponse.json();
            const studentKnowledgesResponse = await fetch(studentKnowledgesApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!studentKnowledgesResponse.ok) throw new Error('Erro ao buscar seus conhecimentos salvos');
            const studentKnowledges = await studentKnowledgesResponse.json();
            const studentLevelsMap = new Map();
            studentKnowledges.forEach(sk => {
                if (sk.conhecimento) {
                    studentLevelsMap.set(sk.conhecimento._id, sk.level);
                }
            });
            listContainer.innerHTML = '';
            allKnowledges.forEach(k => {
                const savedLevel = studentLevelsMap.get(k.id) || 0;
                const item = document.createElement('div');
                item.className = 'knowledge-item';
                item.innerHTML = `
                    <label for="kn-${k.id}">${k.nome}</label>
                    <input type="range" id="kn-${k.id}" data-id="${k.id}" min="0" max="10" value="${savedLevel}" oninput="this.nextElementSibling.textContent = this.value">
                    <span>${savedLevel}</span>
                `;
                listContainer.appendChild(item);
            });
        } catch (error) { 
            console.error(error);
            listContainer.innerHTML = '<p class="error">Não foi possível carregar seus conhecimentos.</p>'; 
        }
    });
    adminPanelBtn.addEventListener('click', () => {
        adminModal.classList.remove('hidden');
        carregarListaDeAlunos(); 
        carregarListaDePalavrasChave();
        carregarListaDeConhecimentosAdmin();
    });

    loginForm.addEventListener('submit', async (e) => { 
        e.preventDefault();
        try {
            const response = await fetch(loginApiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    senha: document.getElementById('senha').value,
                })
            });
            if (!response.ok) throw new Error('Credenciais inválidas');
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify({ _id: data._id, nome: data.nome, email: data.email, perfil: data.perfil }));
            localStorage.setItem('token', data.token);
            loginModal.classList.add('hidden');
            loginForm.reset();
            atualizarUI(); 
        } catch (error) {
            alert('Falha ao tentar fazer login. Verifique suas credenciais.');
        }
    });
    
    addProjectForm.addEventListener('submit', async (e) => { 
        e.preventDefault();
        const token = localStorage.getItem('token');
        const palavrasChaveSelecionadas = Array.from(document.querySelectorAll('#proj-keywords-container input:checked')).map(cb => cb.value);
        const devsSelecionados = Array.from(document.querySelectorAll('#proj-devs-container input:checked')).map(cb => cb.value);
        const projeto = {
            nome: document.getElementById('proj-nome').value,
            resumo: document.getElementById('proj-resumo').value,
            link: document.getElementById('proj-link').value,
            palavrasChave: palavrasChaveSelecionadas,
            outrosDevsIds: devsSelecionados 
        };
        try {
            const response = await fetch(projetosCrudApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(projeto),
            });
            if (!response.ok) throw new Error('Falha ao adicionar projeto');
            addProjectModal.classList.add('hidden');
            window.location.reload(); 
        } catch (error) { 
            console.error(error);
            alert('Erro ao adicionar o projeto.'); 
        }
    });
    
    editProjectForm.addEventListener('submit', async (e) => { 
        e.preventDefault();
        const token = localStorage.getItem('token');
        const projectId = document.getElementById('edit-proj-id').value;
        const palavrasChaveSelecionadas = Array.from(document.querySelectorAll('#edit-proj-keywords-container input:checked')).map(cb => cb.value);
        const devsSelecionados = Array.from(document.querySelectorAll('#edit-proj-devs-container input:checked')).map(cb => cb.value);
        const projetoAtualizado = {
            name: document.getElementById('edit-proj-nome').value,
            summary: document.getElementById('edit-proj-resumo').value,
            link: document.getElementById('edit-proj-link').value,
            keywords: palavrasChaveSelecionadas,
            outrosDevsIds: devsSelecionados
        };
        try {
            const response = await fetch(`${projetosCrudApiUrl}/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(projetoAtualizado)
            });
            if (!response.ok) throw new Error('Falha na atualização');
            editProjectModal.classList.add('hidden');
            window.location.reload(); 
        } catch (error) { 
            console.error(error);
            alert('Não foi possível salvar as alterações.'); 
        }
    });

    knowledgeForm.addEventListener('submit', async (e) => { 
        e.preventDefault();
        const token = localStorage.getItem('token');
        const knowledgesParaEnviar = [];
        document.querySelectorAll('#knowledge-list-container input[type="range"]').forEach(slider => {
            knowledgesParaEnviar.push({
                knowledge: parseInt(slider.dataset.id, 10),
                level: parseInt(slider.value, 10)
            });
        });
        try {
            const response = await fetch(studentKnowledgesApiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ knowledges: knowledgesParaEnviar })
            });
            if (!response.ok) throw new Error('Falha ao salvar conhecimentos');
            knowledgeModal.classList.add('hidden');
            alert('Conhecimentos salvos com sucesso!');
        } catch (error) { 
            console.error(error);
            alert('Não foi possível salvar seus conhecimentos.'); 
        }
    });

    container.addEventListener('click', async (e) => { 
        const token = localStorage.getItem('token');
        if (e.target.classList.contains('delete-btn')) {
            const projectId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este projeto?')) {
                try {
                    const response = await fetch(`${projetosCrudApiUrl}/${projectId}`, { 
                        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } 
                    });
                     if (!response.ok) throw new Error('Falha ao excluir');
                    window.location.reload(); 
                } catch (error) { alert('Não foi possível excluir o projeto.'); }
            }
        }
        if (e.target.classList.contains('edit-btn')) {
            const projectId = e.target.dataset.id;
            try {
                const response = await fetch(`${projetoApiUrl}/${projectId}`); 
                if (!response.ok) throw new Error('Projeto não encontrado');
                const projeto = await response.json();
                
                document.getElementById('edit-proj-id').value = projeto._id;
                document.getElementById('edit-proj-nome').value = projeto.nome;
                document.getElementById('edit-proj-resumo').value = projeto.resumo;
                document.getElementById('edit-proj-link').value = projeto.link;
                
                const keywordsContainer = document.getElementById('edit-proj-keywords-container');
                const checkedKeywordIds = projeto.palavrasChave.map(kw => kw._id);
                await popularCheckboxes(keywordsApiUrl, keywordsContainer, checkedKeywordIds);

                const devsContainer = document.getElementById('edit-proj-devs-container');
                const checkedDevIds = projeto.desenvolvedores.map(dev => dev._id); 
                await popularCheckboxesAlunos(devsContainer, checkedDevIds);
                
                editProjectModal.classList.remove('hidden');
            } catch (error) { 
                console.error("Erro ao carregar dados para edição:", error);
                alert('Não foi possível carregar os dados para edição.'); 
            }
        }
    });

    createStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const studentData = {
            nome: document.getElementById('student-nome').value,
            email: document.getElementById('student-email').value,
            senha: document.getElementById('student-senha').value,
        };
        try {
            const response = await fetch(`${adminApiUrl}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(studentData),
            });
            if (!response.ok) throw new Error('Falha ao criar aluno.');
            alert('Aluno criado com sucesso!');
            createStudentForm.reset();
            carregarListaDeAlunos();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar aluno. Verifique o console.');
        }
    });

    createKeywordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const keywordData = { nome: document.getElementById('keyword-nome').value };
        try {
            const response = await fetch(`${adminApiUrl}/keywords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(keywordData),
            });
            if (!response.ok) throw new Error('Falha ao criar palavra-chave.');
            alert('Palavra-chave criada com sucesso!');
            createKeywordForm.reset();
            carregarListaDePalavrasChave(); 
        } catch (error) {
            console.error(error);
            alert('Erro ao criar palavra-chave. Verifique o console.');
        }
    });

    createKnowledgeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const knowledgeData = { nome: document.getElementById('knowledge-nome').value };
        try {
            const response = await fetch(`${adminApiUrl}/knowledges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(knowledgeData),
            });
            if (!response.ok) throw new Error('Falha ao criar conhecimento.');
            alert('Conhecimento criado com sucesso!');
            createKnowledgeForm.reset();
            carregarListaDeConhecimentosAdmin(); 
        } catch (error) {
            console.error(error);
            alert('Erro ao criar conhecimento. Verifique o console.');
        }
    });

    studentListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('student-delete-btn')) {
            const studentId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`${adminApiUrl}/students/${studentId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Falha ao excluir o aluno.');
                    alert('Aluno excluído com sucesso!');
                    carregarListaDeAlunos();
                } catch (error) {
                    console.error(error);
                    alert('Erro ao excluir o aluno.');
                }
            }
        }
    });
    
    keywordListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('keyword-delete-btn')) {
            const keywordId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir esta palavra-chave?')) {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`${adminApiUrl}/keywords/${keywordId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Falha ao excluir a palavra-chave.');
                    alert('Palavra-chave excluída com sucesso!');
                    carregarListaDePalavrasChave();
                } catch (error) {
                    console.error(error);
                    alert('Erro ao excluir a palavra-chave.');
                }
            }
        }
    });

    knowledgeAdminListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('knowledge-delete-btn')) {
            const knowledgeId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este conhecimento?')) {
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch(`${adminApiUrl}/knowledges/${knowledgeId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Falha ao excluir o conhecimento.');
                    alert('Conhecimento excluído com sucesso!');
                    carregarListaDeConhecimentosAdmin();
                } catch (error) {
                    console.error(error);
                    alert('Erro ao excluir o conhecimento.');
                }
            }
        }
    });

    document.querySelectorAll('.modal .close-btn').forEach(btn => { 
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
     });
    document.addEventListener('click', (e) => { 
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
     });

    atualizarUI(); 

});