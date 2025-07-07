import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';

document.title = "Voici App";

const delay = ms => new Promise(res => setTimeout(res, ms));

const AuthContext = createContext();
const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

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
    nonFollowers: 'Non Followers',
    following: 'Following',
    like: 'Like',
    nonLike: 'Unlike',
    retweet: 'Retweet',
    comments: 'Comments',
    views: 'Views',
    language: 'Language',
    english: 'English',
    french: 'French',
    aiAssistant: 'AI Assistant, Chat GPT',
    save: 'Save',
    writePost: 'Write your post here...',
    enhancing: 'Enhancing...',
    postContentRequired: 'Post content required',
    postCreated: 'Post created!',
    userNotFound: 'User not found',
    invalidCredentials: 'Invalid credentials',
    emailRegistered: 'Email already registered',
    avatar: 'Avatar',
    search: 'Search posts or users...',
    addImageOrVideo: 'Add image or video'
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
    nonLike: 'Non abonnés',
    following: 'Abonnements',
    retweet: 'Retweeter',
    comments: 'Commentaires',
    views: 'Vues',    language: 'Langue',
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
    emailRegistered: 'Email déjà enregistré',
    avatar: 'Avatar',
    search: 'Rechercher des posts ou utilisateurs...',
    addImageOrVideo: 'Ajouter une image ou une vidéo'
  }
};

function useTranslate() {
  const { lang } = useContext(LanguageContext);
  return key => translations[lang][key] || key;
}

let mockUsers = [
  { id: '1', username: 'alice', email: 'alice@example.com', password: '123', bio: 'Hello! I am Alice.', followers: ['2'], theme: 'light', avatar: '' },
  { id: '2', username: 'bob', email: 'bob@example.com', password: '123', bio: 'Bob here.', followers: [], theme: 'dark', avatar: '' }
];

let mockPosts = [
  { id: 'p1', userId: '1', content: 'This is my first post! #welcome', likes: ['2'], comments: [], views: 10, createdAt: Date.now() - 100000, media: '' },
  { id: 'p2', userId: '2', content: 'Hey everyone! #hello', likes: ['1'], comments: [], views: 5, createdAt: Date.now() - 50000, media: '' }
];

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function NotificationPopup({ notification, onClose }) {
  if (!notification) return null;
  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      top: 30,
      right: 30,
      background: '#fff',
      border: '1px solid rgb(55, 7, 177)',
      borderRadius: 8,
      boxShadow: '0 2px 8px #0002',
      transform: 'translateX(-50%)',
      padding: '16px 24px',
      zIndex: 2000,
      display: 'flex',
      minWidth: 220
    }}>
      <b style={{ color: '#591df2' }}>Notification</b>
      <div style={{ flex: 1, marginLeft: 10, color: '#333' }}>
        {notification}
      </div>
      <button onClick={onClose} style={{ float: 'right' }}>Close</button>
    </div>
  );
}

function TrendingSidebar({ posts }) {
  const hashtags = {};
  posts.forEach(post => {
    (post.content.match(/#\w+/g) || []).forEach(tag => {
      hashtags[tag] = (hashtags[tag] || 0) + 1;
    });
  });
  const trending = Object.entries(hashtags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 12,
      margin: 16,
      width: 200,
      float: 'right'
    }}>
      <b>Trending</b>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {trending.length > 0 && trending.map(([tag, count]) => (
          <li key={tag} style={{ margin: '6px 0' }}>
            <span style={{ color: '#1da1f2', fontWeight: 'bold' }}>{tag}</span> ({count})
          </li>
        ))}
        {trending.length === 0 && <li style={{ color: '#888' }}>No hashtags yet</li>}
      </ul>
    </div>
  );
}

function DirectMessageModal({ open, onClose, users, onSend }) {
  const [to, setTo] = useState('');
  const [msg, setMsg] = useState('');
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#0008', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 320 }}>
        <b>Send Direct Message</b>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
        <div style={{ margin: '12px 0' }}>
          <select value={to} onChange={e => setTo(e.target.value)} style={{ width: '100%' }}>
            <option value="">Select user</option>
            {users.map(u => (
              <option key={u.id} value={u.username}>{u.username}</option>
            ))}
          </select>
        </div>
        <textarea
          rows={3}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '100%' }}
        />
        <button
          onClick={() => { if (to && msg) { onSend(to, msg); setMsg(''); setTo(''); onClose(); } }}
          style={{ marginTop: 10 }}
        >Send</button>
      </div>
    </div>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    await delay(500);
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const register = async (username, email, password) => {
    await delay(500);
    if (mockUsers.some(u => u.email === email)) return false;
    const newUser = { id: Date.now().toString(), username, email, password, bio: '', followers: [], theme: 'light', avatar: '' };
    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

function AIAssistant({ open, onClose }) {
  const t = useTranslate();
  const [messages, setMessages] = useState([
    { from: 'user', text: "Hi AI, can you help me?" },
    { from: 'ai', text: "Hello! I'm your AI assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) {
      setInput('');
    }
  }, [open]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(msgs => [
      ...msgs,
      { from: 'user', text: input },
      { from: 'ai', text: "I'm just a demo AI. You said: " + input }
    ]);
    setInput('');
    setLoading(true);
  }

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 300, background: '#fff',
      border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px #0002', zIndex: 1000
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
        {t('aiAssistant')}
        {loading && <span style={{ marginLeft: 10, color: '#888' }}>Loading...</span>}
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
          type="text"
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
      <p><Link to="/">{t('home')}</Link></p>
    </div>
  );
}

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
      <p>{t('registerDescription')}</p>
      <form onSubmit={onSubmit}>
        <input placeholder={t('username')} value={username} onChange={e => setUsername(e.target.value)} /><br/>
        <input placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">{t('register')}</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <p><Link to="/">{t('home')}</Link></p>
      <p><Link to="/login">{t('login')}</Link></p>
    </div>
  );
}

function Home({ showNotification }) {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [search, setSearch] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    setPosts([...mockPosts]);
  }, []);

  function userById(id) {
    return mockUsers.find(u => u.id === id) || {};
  }

  function handleLike(postId) {
    if (!auth.user) return;
    const idx = mockPosts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      const likes = mockPosts[idx].likes;
      const userIdx = likes.indexOf(auth.user.id);
      if (userIdx === -1) {
        likes.push(auth.user.id);
        showNotification && showNotification('Someone liked your post!');
      } else {
        likes.splice(userIdx, 1);
      }
      setPosts([...mockPosts]);
    }
  }

  function handleRetweet(content) {
    if (!auth.user) {
      nav('/login');
      return;
    }
    showNotification && showNotification('Someone retweeted your post!');
    nav('/create', { state: { content } });
  }

  function handleComment(postId) {
    if (!auth.user) {
      nav('/login');
      return;
    }
    const idx = mockPosts.findIndex(p => p.id === postId);
    if (idx !== -1 && commentInputs[postId]?.trim()) {
      mockPosts[idx].comments.push({
        user: auth.user.username,
        text: commentInputs[postId],
        date: new Date().toLocaleString()
      });
      setPosts([...mockPosts]);
      setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
      showNotification && showNotification('New comment added!');
    }
  }

  return (
    <div>
      <h2>{t('home')}</h2>
      {auth.user ? (
        <>
          <Link to="/create">{t('post')}</Link> | <Link to={`/profile/${auth.user.username}`}>{t('profile')}</Link>
          <div>
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '60%', margin: '10px 0', padding: 6 }}
            />
          </div>
          <ul>
            {posts
              .filter(post => {
                const user = userById(post.userId);
                return (
                  post.content.toLowerCase().includes(search.toLowerCase()) ||
                  user.username.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map(post => {
                const user = userById(post.userId);
                return (
                  <li key={post.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', borderRadius: 8, background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                      ) : (
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: '#e0e7ff', color: '#333',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: 8
                        }}>
                          {user.username ? user.username[0].toUpperCase() : '?'}
                        </div>
                      )}
                      <b>{user.username}</b>
                      <span style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>{post.createdAt ? formatDate(post.createdAt) : ''}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>{post.content}</div>
                    {post.media && (
                      <div style={{ margin: '10px 0' }}>
                        {post.media.startsWith('data:image') ? (
                          <img src={post.media} alt="post" style={{ maxWidth: 200 }} />
                        ) : (
                          <video src={post.media} controls style={{ maxWidth: 200 }} />
                        )}
                      </div>
                    )}
                    <button onClick={() => handleLike(post.id)}>
                      {t('like')} ({post.likes.length})
                    </button>
                    <button onClick={() => handleRetweet(post.content)} style={{ marginLeft: 8 }}>
                      {t('retweet')}
                    </button>
                    <span style={{ marginLeft: 8 }}>
                      👁️ {t('views')}: {post.views}
                    </span>
                    <div style={{ marginTop: 10 }}>
                      <b>{t('comments')} ({post.comments.length})</b>
                      <ul style={{ paddingLeft: 16 }}>
                        {post.comments.map((c, i) => (
                          <li key={i} style={{ fontSize: 13 }}>
                            <b>{c.user}:</b> {c.text} <span style={{ color: '#888', fontSize: 11 }}>({c.date})</span>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(inputs => ({ ...inputs, [post.id]: e.target.value }))}
                        style={{ width: '70%' }}
                      />
                      <button onClick={() => handleComment(post.id)} style={{ marginLeft: 5 }}>Send</button>
                    </div>
                  </li>
                );
              })}
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

function PostCreate() {
  const t = useTranslate();
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [media, setMedia] = useState('');

  useEffect(() => {
    if (window.history.state && window.history.state.usr && window.history.state.usr.content) {
      setContent(window.history.state.usr.content);
    }
  }, []);

  if (!auth.user) {
    nav('/login');
    return null;
  }

  function handleMediaChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        setMedia(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function enhanceWithAI() {
    setLoadingAI(true);
    await delay(1500);
    setContent(content + ' #AIEnhanced #VoiciApp');
    setLoadingAI(false);
  }

  async function submitPost() {
    if (!content.trim()) {
      alert(t('postContentRequired'));
      return;
    }
    mockPosts.unshift({
      id: 'p' + Date.now(),
      userId: auth.user.id,
      content,
      likes: [],
      comments: [],
      views: 0,
      createdAt: Date.now(),
      media
    });
    alert(t('postCreated'));
    setContent('');
    setMedia('');
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
      <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
      {media && (
        <div style={{ margin: '10px 0' }}>
          {media.startsWith('data:image') ? (
            <img src={media} alt="media" style={{ maxWidth: 200 }} />
          ) : (
            <video src={media} controls style={{ maxWidth: 200 }} />
          )}
        </div>
      )}
      <button onClick={enhanceWithAI} disabled={loadingAI}>{loadingAI ? t('enhancing') : t('enhanceWithAI')}</button>
      <button onClick={submitPost} style={{ marginLeft: 10 }}>{t('submitPost')}</button>
    </div>
  );
}

function Profile({ showNotification }) {
  const t = useTranslate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('light');
  const [isFollowing, setIsFollowing] = useState(false);
  const [avatar, setAvatar] = useState('');
  const auth = useContext(AuthContext);
  const nav = useNavigate();
  useEffect(() => {
    const found = mockUsers.find(u => u.username === username);
    if (found) {
      setUser(found);
      setBio(found.bio);
      setTheme(found.theme || 'light');
      setIsFollowing(found.followers.includes(auth.user?.id));
      setAvatar(found.avatar || '');
    }
  }, [username, auth.user]);

  if (!user) return <p>{t('userNotFound')}</p>;

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        setAvatar(ev.target.result);
        user.avatar = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function saveProfile() {
    user.bio = bio;
    user.theme = theme;
    user.avatar = avatar;
    alert(t('save'));
  }

  function handleFollow() {
    if (!auth.user) return;
    if (isFollowing) {
      user.followers = user.followers.filter(id => id !== auth.user.id);
    } else {
      user.followers.push(auth.user.id);
      showNotification && showNotification('You have a new follower!');
    }
    setIsFollowing(!isFollowing);
  }

  return (
    <div>
      <h2>
        {user.username} - {t('profile')}
        <span style={{ marginLeft: 16, fontSize: 16, color: '#888' }}>
          ({t('followers')}: {user.followers.length})
        </span>
      </h2>
      <div>
        <label>{t('avatar')}:</label><br />
        {avatar && <img src={avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>
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
      {auth.user && auth.user.username !== user.username && (
        <button onClick={handleFollow} style={{ marginLeft: 10 }}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}

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

function App() {
  const [lang, setLang] = useState('en');
  const [notification, setNotification] = useState(null);
  const [dmOpen, setDmOpen] = useState(false);
  const [dmList, setDmList] = useState([]);

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  function handleSendDM(to, msg) {
    setDmList(list => [...list, { to, from: 'me', msg }]);
    alert('Message sent to ' + to);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <AuthProvider>
        <Router>
          <div
            style={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fff0 100%)',
              paddingBottom: 40
            }}
          >
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, margin: 20 }}>
              {translations[lang].appName}
            </div>
            <LanguageSelector />
            <Navbar />
            <button onClick={() => setDmOpen(true)} style={{ position: 'fixed', top: 20, right: 240, zIndex: 100 }}>
              📩 Direct Message
            </button>
            <TrendingSidebar posts={mockPosts} />
            <DirectMessageModal
              open={dmOpen}
              onClose={() => setDmOpen(false)}
              users={mockUsers}
              onSend={handleSendDM}
            />
            <NotificationPopup notification={notification} onClose={() => setNotification(null)} />
            <Routes>
              <Route path="/" element={<Home showNotification={showNotification} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<PostCreate />} />
              <Route path="/profile/:username" element={<Profile showNotification={showNotification} />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageContext.Provider>
  );
}

export default App;
