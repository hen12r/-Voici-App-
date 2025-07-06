import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Set the browser tab title
document.title = "Voici App";

// Mock API delay helper
const delay = ms => new Promise(res => setTimeout(res, ms));

// --- Contexts ---
const AuthContext = createContext();
const LanguageContext = createContext();

// --- Simple translations ---
const translations = {
  en: {
    appName: 'Voici App',
    login: 'Login',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    bio: 'Bio',
    theme: 'Theme',
    post: 'Post',
    enhanceWithAI: 'Enhance with AI',
    submitPost: 'Submit Post',
    logout: 'Logout',
    home: 'Home',
    profile: 'Profile',
    posts: 'Posts',
    followers: 'Followers',
    like: 'Like',
    comments: 'Comments',
    views: 'Views',
    language: 'Language',
    english: 'English',
    french: 'French',
    aiAssistant: 'AI Assistant',
    save: 'Save',
    writePost: 'Write your post here...',
    enhancing: 'Enhancing...',
    postContentRequired: 'Post content required',
    postCreated: 'Post created!',
    userNotFound: 'User not found',
    invalidCredentials: 'Invalid credentials',
    emailRegistered: 'Email already registered'
  },
  fr: {
    appName: 'Voici App',
    login: 'Connexion',
    register: "S'inscrire",
    username: "Nom d'utilisateur",
    email: 'Email',
    password: 'Mot de passe',
    bio: 'Bio',
    theme: 'Thème',
    post: 'Publier',
    enhanceWithAI: "Améliorer avec l'IA",
    submitPost: 'Soumettre le post',
    logout: 'Déconnexion',
    home: 'Accueil',
    profile: 'Profil',
    posts: 'Publications',
    followers: 'Abonnés',
    like: 'J’aime',
    comments: 'Commentaires',
    views: 'Vues',
    language: 'Langue',
    english: 'Anglais',
    french: 'Français',
    aiAssistant: "Assistant IA",
    save: 'Enregistrer',
    writePost: 'Écrivez votre publication ici...',
    enhancing: 'Amélioration...',
    postContentRequired: 'Le contenu du post est requis',
    postCreated: 'Publication créée !',
    userNotFound: "Utilisateur non trouvé",
    invalidCredentials: 'Identifiants invalides',
    emailRegistered: 'Email déjà enregistré'
  }
};

// --- Translation hook ---
function useTranslate() {
  const { lang } = useContext(LanguageContext);
  return key => translations[lang][key] || key;
}

// --- Mock Backend Data ---
let mockUsers = [
  { id: '1', username: 'alice', email: 'alice@example.com', password: '123', bio: 'Hello! I am Alice.', followers: ['2'], theme: 'light' },
  { id: '2', username: 'bob', email: 'bob@example.com', password: '123', bio: 'Bob here.', followers: [], theme: 'dark' }
];

let mockPosts = [
  { id: 'p1', userId: '1', content: 'This is my first post!', likes: ['2'], comments: [], views: 10 },
  { id: 'p2', userId: '2', content: 'Hey everyone!', likes: ['1'], comments: [], views: 5 }
];

// --- Auth Provider ---
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // login simulation
  const login = async (email, password) => {
    await delay(500);
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  // register simulation
  const register = async (username, email, password) => {
    await delay(500);
    if (mockUsers.some(u => u.email === email)) return false;
    const newUser = { id: Date.now().toString(), username, email, password, bio: '', followers: [], theme: 'light' };
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

// --- Simple AI Assistant Component ---
function AIAssistant({ open, onClose }) {
  const t = useTranslate();
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hello! I'm your AI assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState('');

  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    // Mock AI reply
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: 'ai', text: "I'm just a demo AI. You said: " + input }
      ]);
    }, 800);
    setInput('');
  }

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 300, background: '#fff',
      border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px #0002', zIndex: 1000
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
        {t('aiAssistant')}
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'ai' ? 'left' : 'right', margin: '4px 0' }}>
            <span style={{
              background: m.from === 'ai' ? '#f0f0f0' : '#d0eaff',
              padding: '4px 8px', borderRadius: 6, display: 'inline-block'
            }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: '1px solid #eee' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ width: '75%' }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>{t('submitPost')}</button>
      </div>
    </div>
  );
}

// --- Login Page ---
function Login() {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await auth.login(email, password);
    if (ok) nav('/');
    else setError(t('invalidCredentials'));
  }

  return (
    <div>
      <h2>{t('login')}</h2>
      <form onSubmit={onSubmit}>
        <input placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">{t('login')}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p><Link to="/register">{t('register')}</Link></p>
    </div>
  );
}

// --- Register Page ---
function Register() {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await auth.register(username, email, password);
    if (ok) nav('/');
    else setError(t('emailRegistered'));
  }

  return (
    <div>
      <h2>{t('register')}</h2>
      <form onSubmit={onSubmit}>
        <input placeholder={t('username')} value={username} onChange={e => setUsername(e.target.value)} /><br/>
        <input placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">{t('register')}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p><Link to="/login">{t('login')}</Link></p>
    </div>
  );
}

// --- Home Page (Feed) ---
function Home() {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // load posts
    setPosts(mockPosts);
  }, []);

  function userById(id) {
    return mockUsers.find(u => u.id === id) || {};
  }

  return (
    <div>
      <h2>{t('home')}</h2>
      {auth.user ? (
        <>
          <Link to="/create">{t('post')}</Link> | <Link to={`/profile/${auth.user.username}`}>{t('profile')}</Link>
          <ul>
            {posts.map(post => (
              <li key={post.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                <b>{userById(post.userId).username}</b>: {post.content}<br/>
                {t('like')}: {post.likes.length} | {t('comments')}: {post.comments.length} | {t('views')}: {post.views}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p><Link to="/login">{t('login')}</Link> / <Link to="/register">{t('register')}</Link></p>
        </>
      )}
    </div>
  );
}

// --- Post Create Page with AI assistant ---
function PostCreate() {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  if (!auth.user) {
    nav('/login');
    return null;
  }

  async function enhanceWithAI() {
    setLoadingAI(true);
    await delay(1500);
    // Mock AI fixing grammar and adding hashtags
    setContent(content + ' #AIEnhanced #VoiciApp');
    setLoadingAI(false);
  }

  async function submitPost() {
    if (!content.trim()) {
      alert(t('postContentRequired'));
      return;
    }
    // Mock adding post to backend
    mockPosts.unshift({
      id: 'p' + Date.now(),
      userId: auth.user.id,
      content,
      likes: [],
      comments: [],
      views: 0
    });
    alert(t('postCreated'));
    setContent('');
    nav('/');
  }

  return (
    <div>
      <h2>{t('post')}</h2>
      <textarea
        rows={6}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={t('writePost')}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={enhanceWithAI} disabled={loadingAI}>{loadingAI ? t('enhancing') : t('enhanceWithAI')}</button>
      <button onClick={submitPost} style={{ marginLeft: 10 }}>{t('submitPost')}</button>
    </div>
  );
}

// --- Profile Page ---
function Profile() {
  const t = useTranslate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const found = mockUsers.find(u => u.username === username);
    if (found) {
      setUser(found);
      setBio(found.bio);
      setTheme(found.theme || 'light');
    }
  }, [username]);

  if (!user) return <p>{t('userNotFound')}</p>;

  function saveProfile() {
    user.bio = bio;
    user.theme = theme;
    alert(t('save'));
  }

  return (
    <div>
      <h2>{user.username} - {t('profile')}</h2>
      <div>
        <label>{t('bio')}:</label><br />
        <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} style={{ width: '100%' }} />
      </div>
      <div>
        <label>{t('theme')}:</label><br />
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">White</option>
          <option value="dark">Black</option>
          <option value="blue">Blue</option>
        </select>
      </div>
      <button onClick={saveProfile}>{t('save')}</button>
    </div>
  );
}

// --- Language Selector ---
function LanguageSelector() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = useTranslate();
  return (
    <div style={{ marginBottom: 20 }}>
      {t('language')}:
      <select value={lang} onChange={e => setLang(e.target.value)} style={{ marginLeft: 5 }}>
        <option value="en">{t('english')}</option>
        <option value="fr">{t('french')}</option>
      </select>
    </div>
  );
}

// --- Navigation Bar ---
function Navbar() {
  const auth = useContext(AuthContext);
  const t = useTranslate();
  const nav = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <nav style={{ marginBottom: 20 }}>
      <Link to="/">{t('home')}</Link> |{' '}
      {auth.user ? (
        <>
          <Link to={`/profile/${auth.user.username}`}>{t('profile')}</Link> |{' '}
          <button onClick={() => { auth.logout(); nav('/'); }}>{t('logout')}</button> |{' '}
        </>
      ) : (
        <>
          <Link to="/login">{t('login')}</Link> |{' '}
          <Link to="/register">{t('register')}</Link> |{' '}
        </>
      )}
      <button onClick={() => setAiOpen(true)}>{t('aiAssistant')}</button>
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </nav>
  );
}

// --- App Wrapper ---
function App() {
  const [lang, setLang] = useState('en');
  const t = useTranslate();
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <AuthProvider>
        <Router>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, margin: 20 }}>
            {translations[lang].appName}
          </div>
          <LanguageSelector />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<PostCreate />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageContext.Provider>
  );
}

export default App;