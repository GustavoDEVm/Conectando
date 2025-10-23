# 🎉 Conectando - Sistema Completo de Serviços Comunitários

## ✅ Sistema Totalmente Funcional!

O sistema Conectando está 100% implementado com frontend React + backend FastAPI + MongoDB.

---

## 🔐 Credenciais de Teste

### Usuário Regular
- **Email:** tomoli9706@ampdial.com
- **Senha:** 12345678

### Organizador
- **Email:** kaxafec531@datoinf.com  
- **Senha:** 09876543

---

## 🚀 Como Usar

### Acessar o Sistema
1. Abra o navegador e acesse: `http://localhost:3000`
2. Faça login com uma das credenciais acima
3. Explore as funcionalidades!

### Criar Nova Conta
1. Na página de login, clique em "Sign up"
2. Preencha os dados
3. Escolha o tipo: **Usuário** ou **Organizador**
4. Clique em "Criar Conta"

---

## 📱 Funcionalidades Implementadas

### 🔹 Autenticação (100% Funcional)
- ✅ Login com JWT
- ✅ Cadastro de novos usuários
- ✅ Logout
- ✅ Proteção de rotas
- ✅ Diferenciação Usuário/Organizador

### 🔹 Usuário
1. **Início** - Dashboard com estatísticas
2. **Serviços** - Listar e agendar serviços disponíveis
3. **Meus Agendamentos** - Ver agendamentos com filtros
4. **Histórico** - Histórico completo com métricas
5. **Perfil** - Editar informações pessoais

### 🔹 Organizador  
1. **Início** - Dashboard com estatísticas
2. **Meus Serviços** - Gerenciar serviços criados
3. **Novo Serviço** - Criar novos serviços
4. **Agendamentos** - Ver todos os agendamentos dos seus serviços
5. **Perfil** - Editar informações pessoais

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework UI
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes
- **Lucide React** - Ícones

### Backend
- **FastAPI** - Framework Python
- **MongoDB** - Banco de dados
- **Motor** - Driver async MongoDB
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Pydantic** - Validação de dados

---

## 📂 Estrutura do Projeto

```
/app
├── backend/
│   ├── server.py          # Servidor principal com todas as rotas
│   ├── models.py          # Modelos de dados (Pydantic)
│   ├── auth.py            # Funções de autenticação e JWT
│   ├── seed.py            # Script para popular banco
│   └── requirements.txt   # Dependências Python
│
└── frontend/
    ├── src/
    │   ├── components/    # Componentes reutilizáveis
    │   ├── pages/         # Páginas da aplicação
    │   ├── context/       # Context API (AuthContext)
    │   ├── services/      # Cliente API (api.js)
    │   └── mock/          # Dados mockados (não mais usado)
    └── package.json       # Dependências Node.js
```

---

## 🔄 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login

### Usuários
- `GET /api/users/me` - Obter perfil
- `PUT /api/users/me` - Atualizar perfil

### Serviços
- `GET /api/services` - Listar serviços
- `GET /api/services/{id}` - Obter serviço
- `POST /api/services` - Criar serviço (organizador)
- `PUT /api/services/{id}` - Atualizar serviço
- `DELETE /api/services/{id}` - Deletar serviço
- `GET /api/services/organizer/my-services` - Meus serviços

### Agendamentos
- `POST /api/bookings` - Criar agendamento
- `GET /api/bookings/my-bookings` - Meus agendamentos
- `GET /api/bookings/organizer/all` - Agendamentos (organizador)
- `PUT /api/bookings/{id}` - Atualizar agendamento
- `DELETE /api/bookings/{id}` - Cancelar agendamento

---

## 🎨 Design

### Cores Principais
- **Roxo:** #a855f7
- **Rosa:** #ec4899
- **Background:** Gradiente rosa/roxo claro
- **Cards:** Branco com sombra

### Componentes UI
- Todos os componentes usam **Shadcn UI**
- Design moderno e responsivo
- Animações suaves
- Toast notifications

---

## 💾 Banco de Dados

### Collections MongoDB
1. **users** - Usuários do sistema
2. **services** - Serviços oferecidos
3. **bookings** - Agendamentos

### Popular o Banco
```bash
cd /app/backend
python seed.py
```

Isso irá criar:
- 2 usuários (1 regular + 1 organizador)
- 6 serviços de exemplo

---

## 🔧 Comandos Úteis

### Reiniciar Serviços
```bash
sudo supervisorctl restart all      # Reinicia tudo
sudo supervisorctl restart backend  # Só backend
sudo supervisorctl restart frontend # Só frontend
```

### Ver Logs
```bash
tail -f /var/log/supervisor/backend.err.log   # Logs backend
tail -f /var/log/supervisor/frontend.out.log  # Logs frontend
```

### Testar API
```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tomoli9706@ampdial.com","password":"12345678"}'

# Listar serviços
curl http://localhost:8001/api/services
```

---

## ✨ Destaques do Código

### 1. AuthContext (Frontend)
- Gerencia autenticação no frontend
- Salva token JWT no localStorage
- Provê métodos: login, signup, logout, updateProfile

### 2. API Client (Frontend)
- Centraliza chamadas à API
- Adiciona token automaticamente
- Organizado por módulos: servicesAPI, bookingsAPI, usersAPI

### 3. Backend
- **Código comentado** e bem organizado
- **Validação** com Pydantic
- **Segurança** com JWT e bcrypt
- **Async/await** para performance

---

## 📝 Notas Importantes

1. **Dados Reais:** Todos os dados agora vêm do MongoDB (não mais mockados)
2. **Segurança:** Senhas são hasheadas com bcrypt
3. **Tokens:** JWT válido por 7 dias
4. **CORS:** Configurado para aceitar requisições do frontend

---

## 🎯 Próximos Passos Possíveis

- [ ] Upload de imagens para serviços
- [ ] Sistema de notificações
- [ ] Chat entre usuário e organizador
- [ ] Google OAuth real
- [ ] Sistema de avaliações mais completo
- [ ] Filtros avançados de serviços
- [ ] Exportar relatórios

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar logs
tail -n 50 /var/log/supervisor/backend.err.log

# Verificar se MongoDB está rodando
ps aux | grep mongod

# Reiniciar
sudo supervisorctl restart backend
```

### Frontend com erro
```bash
# Verificar logs
tail -n 50 /var/log/supervisor/frontend.err.log

# Limpar cache e reinstalar
cd /app/frontend
rm -rf node_modules package-lock.json
yarn install
sudo supervisorctl restart frontend
```

---

## 📞 Suporte

Acesse a documentação interativa da API:
- http://localhost:8001/docs (Swagger UI)
- http://localhost:8001/redoc (ReDoc)

---

**Status:** ✅ Totalmente Funcional  
**Versão:** 1.0.0  
**Última Atualização:** 23/10/2025
