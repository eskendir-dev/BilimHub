import React, { useEffect, useMemo, useState } from 'react';
import { bilimClassAPI, mockData } from './mockServer';

const DB_KEY = 'bilimhub_full_hackathon_v4';
const THEME_KEY = 'bilimhub_theme_v1';
const clsArr = ['9А', '9Б', '9В', '10А', '10Б', '11А', '11Б'];

const roleTxt = {
  student: 'Ученик',
  parent: 'Родитель',
  teacher: 'Учитель',
  admin: 'Администрация',
  kiosk: 'Киоск',
};

const mk = () => Math.random().toString(36).slice(2, 10);

function makeDb() {
  return {
    users: [
      { id: 'u_st_001', email: 'student9a@school.kz', password: '123456', role: 'student', name: 'Алихан Сейтов', className: '9А', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
      { id: 'u_st_002', email: 'student9b@school.kz', password: '123456', role: 'student', name: 'Айгерим Нурова', className: '9Б', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
      { id: 'u_st_003', email: 'student10a@school.kz', password: '123456', role: 'student', name: 'Дамир Жанов', className: '10А', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
      { id: 'u_st_004', email: 'student11a@school.kz', password: '123456', role: 'student', name: 'Камила Омар', className: '11А', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
      { id: 'u_pr_001', email: 'parent9a@school.kz', password: '123456', role: 'parent', name: 'Гульнара Сейтова', className: '', avatar: '', linkedStudentEmail: 'student9a@school.kz', teachesClasses: [] },
      { id: 'u_pr_002', email: 'parent11a@school.kz', password: '123456', role: 'parent', name: 'Берик Омаров', className: '', avatar: '', linkedStudentEmail: 'student11a@school.kz', teachesClasses: [] },
      { id: 'u_te_001', email: 'teacher.math@school.kz', password: '123456', role: 'teacher', name: 'Мария Иванова', className: '', avatar: '', linkedStudentEmail: '', teachesClasses: ['9А', '9Б', '10А'] },
      { id: 'u_te_002', email: 'teacher.phys@school.kz', password: '123456', role: 'teacher', name: 'Асель Нурова', className: '', avatar: '', linkedStudentEmail: '', teachesClasses: ['10Б', '11А', '11Б'] },
      { id: 'u_ad_001', email: 'admin@school.kz', password: '123456', role: 'admin', name: 'Администратор Лицея', className: '', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
      { id: 'u_ki_001', email: 'kiosk@school.kz', password: '123456', role: 'kiosk', name: 'Школьный Монитор', className: '', avatar: '', linkedStudentEmail: '', teachesClasses: [] },
    ],
    news: [
      { id: 'n1', authorId: 'u_ad_001', title: 'Открытие хакатона', description: 'Сегодня стартует школьный хакатон.', image: 'https://picsum.photos/seed/news1/900/1200', likes: [], createdAt: '2026-03-28 10:00' },
      { id: 'n2', authorId: 'u_te_001', title: 'Консультация по математике', description: 'В среду консультация для 9-х классов.', image: 'https://picsum.photos/seed/news2/900/1200', likes: [], createdAt: '2026-03-29 12:30' },
      { id: 'n3', authorId: 'u_ad_001', title: 'Репетиция последнего звонка', description: 'Репетиция для 11-х классов.', image: 'https://picsum.photos/seed/news3/900/1200', likes: [], createdAt: '2026-03-30 09:20' },
    ],
    clubs: [
      { id: 'cl1', name: 'Робототехника', teacherId: 'u_te_001', approved: true },
      { id: 'cl2', name: 'Дебатный клуб', teacherId: 'u_te_001', approved: true },
      { id: 'cl3', name: 'Физика PRO', teacherId: 'u_te_002', approved: true },
    ],
    clubRequests: [{ id: 'req1', teacherId: 'u_te_001', name: 'Олимпиадная математика', status: 'pending' }],
    clubEnrollments: [
      { studentEmail: 'student9a@school.kz', clubId: 'cl1' },
      { studentEmail: 'student10a@school.kz', clubId: 'cl2' },
      { studentEmail: 'student11a@school.kz', clubId: 'cl3' },
    ],
    schedules: {
      '9А': { sourceType: 'url', value: 'https://example.com/schedule/9a.xlsx', updatedAt: '2026-03-20 10:00' },
      '9Б': { sourceType: 'url', value: 'https://example.com/schedule/9b.xlsx', updatedAt: '2026-03-20 10:00' },
      '9В': { sourceType: 'url', value: 'https://example.com/schedule/9v.xlsx', updatedAt: '2026-03-20 10:00' },
      '10А': { sourceType: 'url', value: 'https://example.com/schedule/10a.xlsx', updatedAt: '2026-03-20 10:00' },
      '10Б': { sourceType: 'url', value: 'https://example.com/schedule/10b.xlsx', updatedAt: '2026-03-20 10:00' },
      '11А': { sourceType: 'url', value: 'https://example.com/schedule/11a.xlsx', updatedAt: '2026-03-20 10:00' },
      '11Б': { sourceType: 'url', value: 'https://example.com/schedule/11b.xlsx', updatedAt: '2026-03-20 10:00' },
    },
    chats: [
      { id: 'm1', fromEmail: 'teacher.math@school.kz', toEmail: 'student9a@school.kz', text: 'Подготовьтесь к теме квадратных уравнений.', createdAt: Date.now() - 3600000 },
      { id: 'm2', fromEmail: 'admin@school.kz', toEmail: 'teacher.phys@school.kz', text: 'Проверьте заявку по кружку.', createdAt: Date.now() - 1800000 },
    ],
    teacherEdited: {},
    recentDialogs: {
      'teacher.math@school.kz': ['student9a@school.kz'],
      'student9a@school.kz': ['teacher.math@school.kz'],
      'admin@school.kz': ['teacher.phys@school.kz'],
      'teacher.phys@school.kz': ['admin@school.kz'],
    },
  };
}

function getDb() {
  const x = localStorage.getItem(DB_KEY);
  if (x) return JSON.parse(x);
  return makeDb();
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function App() {
  const [d, setD] = useState(getDb);
  const [theme, setTheme] = useState(getTheme);
  const [a, setA] = useState({ ok: false, id: null });
  const [p, setP] = useState('news');
  const [o, setO] = useState(false);
  const [m, setM] = useState('login');
  const [er, setEr] = useState('');

  const [f, setF] = useState({ email: '', password: '', role: 'student', name: '', className: '9А', linkedStudentEmail: '' });

  const u = useMemo(() => d.users.find((z) => z.id === a.id) || null, [d.users, a.id]);

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(d));
  }, [d]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const stMail = useMemo(() => {
    if (!u) return '';
    if (u.role === 'student') return u.email;
    if (u.role === 'parent') return u.linkedStudentEmail || '';
    return '';
  }, [u]);

  const stClass = useMemo(() => {
    if (!u) return '';
    if (u.role === 'student') return u.className;
    if (u.role === 'parent') return d.users.find((x) => x.email === u.linkedStudentEmail)?.className || '';
    return '';
  }, [u, d.users]);

  const doLogin = (e) => {
    e.preventDefault();
    setEr('');
    const x = d.users.find((q) => q.email.toLowerCase() === f.email.toLowerCase() && q.password === f.password);
    if (!x) return setEr('Неверная почта или пароль');
    setA({ ok: true, id: x.id });
    setP('news');
    setO(false);
  };

  const doReg = (e) => {
    e.preventDefault();
    setEr('');
    if (!f.email || !f.password || !f.name) return setEr('Заполните обязательные поля');
    if (d.users.some((x) => x.email.toLowerCase() === f.email.toLowerCase())) return setEr('Почта уже занята');

    if (f.role === 'parent') {
      const s = d.users.find((x) => x.email.toLowerCase() === f.linkedStudentEmail.toLowerCase() && x.role === 'student');
      if (!s) return setEr('Почта ученика не найдена');
    }

    const nu = {
      id: mk(),
      email: f.email.trim(),
      password: f.password,
      role: f.role,
      name: f.name.trim(),
      className: f.role === 'student' ? f.className : '',
      avatar: '',
      linkedStudentEmail: f.role === 'parent' ? f.linkedStudentEmail : '',
      teachesClasses: f.role === 'teacher' ? ['9А'] : [],
    };

    setD((z) => ({ ...z, users: [...z.users, nu] }));
    setA({ ok: true, id: nu.id });
    setO(false);
  };

  const out = () => {
    setA({ ok: false, id: null });
    setP('news');
  };

  const like = (nid) => {
    if (!u) return;
    const me = u.email;
    setD((z) => ({
      ...z,
      news: z.news.map((n) => {
        if (n.id !== nid) return n;
        const has = n.likes.includes(me);
        return { ...n, likes: has ? n.likes.filter((x) => x !== me) : [...n.likes, me] };
      }),
    }));
  };

  const addNews = (x) => {
    setD((z) => ({
      ...z,
      news: [{ id: mk(), authorId: u.id, title: x.title, description: x.description, image: x.image || 'https://picsum.photos/seed/newpost/900/1200', likes: [], createdAt: new Date().toLocaleString('ru-RU') }, ...z.news],
    }));
  };

  const editNews = (nid, x) => setD((z) => ({ ...z, news: z.news.map((n) => (n.id === nid ? { ...n, ...x } : n)) }));
  const delNews = (nid) => setD((z) => ({ ...z, news: z.news.filter((n) => n.id !== nid) }));

  const tgClub = (cid) => {
    if (!stMail) return;
    const ex = d.clubEnrollments.some((x) => x.studentEmail === stMail && x.clubId === cid);
    setD((z) => ({
      ...z,
      clubEnrollments: ex
        ? z.clubEnrollments.filter((x) => !(x.studentEmail === stMail && x.clubId === cid))
        : [...z.clubEnrollments, { studentEmail: stMail, clubId: cid }],
    }));
  };

  const reqClub = (name) => setD((z) => ({ ...z, clubRequests: [{ id: mk(), teacherId: u.id, name, status: 'pending' }, ...z.clubRequests] }));

  const doReq = (rid, ok) => {
    setD((z) => {
      const r = z.clubRequests.find((x) => x.id === rid);
      if (!r) return z;
      const clubRequests = z.clubRequests.map((x) => (x.id === rid ? { ...x, status: ok ? 'approved' : 'rejected' } : x));
      const clubs = ok ? [...z.clubs, { id: mk(), name: r.name, teacherId: r.teacherId, approved: true }] : z.clubs;
      return { ...z, clubRequests, clubs };
    });
  };

  const saveSch = ({ className, sourceType, value }) => {
    setD((z) => ({
      ...z,
      schedules: { ...z.schedules, [className]: { sourceType, value, updatedAt: new Date().toLocaleString('ru-RU') } },
    }));
  };

  const saveAcc = ({ name, avatar }) => setD((z) => ({ ...z, users: z.users.map((x) => (x.id === u.id ? { ...x, name, avatar } : x)) }));

  const canMsg = (f1, t1) => {
    if (!f1 || !t1) return false;
    if (f1.email === t1.email) return false;
    if (f1.role === 'parent' || f1.role === 'kiosk') return false;
    if (f1.role !== 'admin' && t1.role === 'admin') return false;
    if (f1.role === 'admin' && t1.role !== 'teacher') return false;
    return true;
  };

  const savePair = (a1, b1) => {
    setD((z) => {
      const aa = z.recentDialogs[a1] || [];
      const bb = z.recentDialogs[b1] || [];
      return {
        ...z,
        recentDialogs: {
          ...z.recentDialogs,
          [a1]: [b1, ...aa.filter((x) => x !== b1)],
          [b1]: [a1, ...bb.filter((x) => x !== a1)],
        },
      };
    });
  };

  const send = ({ toEmail, text }) => {
    const to = d.users.find((x) => x.email.toLowerCase() === toEmail.toLowerCase());
    if (!to) return { ok: false, msg: 'Пользователь не найден' };
    if (!canMsg(u, to)) return { ok: false, msg: 'Нельзя писать этому пользователю' };

    setD((z) => ({ ...z, chats: [...z.chats, { id: mk(), fromEmail: u.email, toEmail: to.email, text, createdAt: Date.now() }] }));
    savePair(u.email, to.email);
    return { ok: true };
  };

  const saveT = ({ studentId, subjectName, kr, sor1, sor2, soch }) => {
    setD((z) => ({
      ...z,
      teacherEdited: {
        ...z.teacherEdited,
        [studentId]: {
          ...(z.teacherEdited[studentId] || {}),
          [subjectName]: { kr: Number(kr), sor1: Number(sor1), sor2: Number(sor2), soch: Number(soch) },
        },
      },
    }));
  };

  return (
    <div className="layout">
      <Side
        user={u}
        active={p}
        setActive={setP}
        onLogin={() => setO(true)}
        onLogout={out}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="main">
        <Top user={u} cls={stClass} />

        {!u && p === 'news' && (
          <div className="card">
            <h3>Лента новостей</h3>
            <Feed news={d.news} user={null} onLike={() => {}} />
          </div>
        )}

        {u && p === 'news' && <News user={u} news={d.news} onLike={like} addNews={addNews} editNews={editNews} delNews={delNews} />}
        {u && p === 'grades' && ['student', 'parent', 'teacher'].includes(u.role) && <Grades user={u} cls={stClass} db={d} saveT={saveT} />}
        {u && p === 'clubs' && ['student', 'parent', 'teacher'].includes(u.role) && <Clubs user={u} db={d} stMail={stMail} tgClub={tgClub} reqClub={reqClub} />}
        {u && p === 'stats' && u.role === 'admin' && <Stats db={d} doReq={doReq} />}
        {u && p === 'schedule' && <Sch user={u} db={d} saveSch={saveSch} />}
        {u && p === 'chat' && !['kiosk', 'parent'].includes(u.role) && <Chat user={u} db={d} send={send} />}
        {u && p === 'account' && <Acc user={u} saveAcc={saveAcc} out={out} />}
      </main>

      {o && (
        <Auth
          mode={m}
          setMode={setM}
          form={f}
          setForm={setF}
          error={er}
          onClose={() => setO(false)}
          onLogin={doLogin}
          onRegister={doReg}
        />
      )}
    </div>
  );
}

function Side({ user, active, setActive, onLogin, onLogout, theme, setTheme }) {
  const arr = user
    ? [
        { id: 'news', t: 'Лента новостей', ok: true },
        { id: 'grades', t: 'Оценки', ok: ['student', 'parent', 'teacher'].includes(user.role) },
        { id: 'clubs', t: 'Кружки', ok: ['student', 'parent', 'teacher'].includes(user.role) },
        { id: 'stats', t: 'Статистика', ok: user.role === 'admin' },
        { id: 'schedule', t: 'Расписание', ok: true },
        { id: 'chat', t: 'Чат', ok: !['parent', 'kiosk'].includes(user.role) },
        { id: 'account', t: 'Аккаунт', ok: true },
      ].filter((x) => x.ok)
    : [{ id: 'news', t: 'Лента новостей', ok: true }];

  return (
    <aside className="side">
      <div className="logo">BilimHub</div>

      <div className="miniUser">
        <div className="avatar">{user?.avatar ? <img src={user.avatar} alt="" /> : <span>{user ? user.name[0] : 'Г'}</span>}</div>
        <div>
          <p className="miniName">{user ? user.name : 'Гость'}</p>
          <p className="miniRole">{user ? roleTxt[user.role] : 'Не авторизован'}</p>
        </div>
      </div>

      <div className="menu">
        {arr.map((x) => <button key={x.id} className={`menuBtn ${active === x.id ? 'active' : ''}`} onClick={() => setActive(x.id)}>{x.t}</button>)}
      </div>

      <button className="menuBtn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Тема: {theme === 'light' ? 'Светлая' : 'Тёмная'}
      </button>

      {user ? <button className="menuBtn logoutBtn" onClick={onLogout}>Выйти</button> : <button className="menuBtn active" onClick={onLogin}>Войти</button>}
    </aside>
  );
}

function Top({ user, cls }) {
  const [tip, setTip] = useState('Подключите аккаунт для персональных функций.');

  useEffect(() => {
    if (!user) {
      setTip(
        <span>
          Портал готов к демонстрации. {' '}
          <a 
            href="https://github.com/eskendir-dev/BilimHub#тестовые-аккаунты" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0052cc', textDecoration: 'underline' }}
          >
            Тестовые аккаунты
          </a>
        </span>
      );
      return;
    } else if (user.role !== 'student') {
      setTip('Портал готов к демонстрации.');
      return;
    }
    const s = mockData.students.find((x) => x.className === cls) || mockData.students[0];
    bilimClassAPI.getStudentGrades(s.id).then((r) => {
      if (r.status !== 200) return;
      const bad = [...r.data.subjects].sort((a, b) => {
        const sa = (a.row.kr?.score || 0) + (a.row.sor1?.score || 0) + (a.row.sor2?.score || 0) + (a.row.soch?.score || 0);
        const sb = (b.row.kr?.score || 0) + (b.row.sor1?.score || 0) + (b.row.sor2?.score || 0) + (b.row.soch?.score || 0);
        return sa - sb;
      })[0];
      setTip(bad ? `Рекомендация: стоит улучшить "${bad.subjectName}".` : 'Продолжайте в том же темпе.');
    });
  }, [user, cls]);

  return (
    <section className="welcome">
      <h2>Здравствуйте{user ? `, ${user.name}` : ''}</h2>
      <p className="tip">{tip}</p>
    </section>
  );
}

function News({ user, news, onLike, addNews, editNews, delNews }) {
  const [f, setF] = useState({ title: '', description: '', image: '' });
  const [eid, setEid] = useState('');
  const [ed, setEd] = useState({ title: '', description: '', image: '' });

  const b64 = (file, cb) => {
    const fr = new FileReader();
    fr.onload = () => cb(fr.result);
    fr.readAsDataURL(file);
  };

  return (
    <section>
      {user.role === 'admin' && (
        <div className="card">
          <h3>Публикация</h3>
          <div className="grid2">
            <input placeholder="Название" value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))} />
            <input placeholder="Ссылка на изображение" value={f.image} onChange={(e) => setF((p) => ({ ...p, image: e.target.value }))} />
          </div>
          <textarea placeholder="Описание" value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} />
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && b64(e.target.files[0], (img) => setF((p) => ({ ...p, image: img })))} />
          <button className="btn primary" onClick={() => {
            if (!f.title || !f.description) return;
            addNews({ ...f, image: f.image || 'https://picsum.photos/seed/newpost/900/1200' });
            setF({ title: '', description: '', image: '' });
          }}>
            Опубликовать
          </button>
        </div>
      )}

      <Feed news={news} user={user} onLike={onLike} eid={eid} setEid={setEid} ed={ed} setEd={setEd} editNews={editNews} delNews={delNews} />
    </section>
  );
}

function Feed({ news, user, onLike, eid, setEid, ed, setEd, editNews, delNews }) {
  return (
    <div className="feed">
      {news.map((n) => (
        <article className="post" key={n.id}>
          <img src={n.image} alt={n.title} />
          <div className="postBody">
            {user?.role === 'admin' && eid === n.id ? (
              <>
                <input value={ed.title} onChange={(e) => setEd((p) => ({ ...p, title: e.target.value }))} />
                <textarea value={ed.description} onChange={(e) => setEd((p) => ({ ...p, description: e.target.value }))} />
                <input value={ed.image} onChange={(e) => setEd((p) => ({ ...p, image: e.target.value }))} />
                <div className="row">
                  <button className="btn primary" onClick={() => { editNews(n.id, ed); setEid(''); }}>Сохранить</button>
                  <button className="btn ghost" onClick={() => setEid('')}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <h4>{n.title}</h4>
                <p>{n.description}</p>
                <div className="row between">
                  <small>{n.createdAt}</small>
                  <button className="btn heart" onClick={() => user && onLike(n.id)} disabled={!user}>Сердце {n.likes.length}</button>
                </div>
                {user?.role === 'admin' && (
                  <div className="row">
                    <button className="btn ghost" onClick={() => { setEid(n.id); setEd({ title: n.title, description: n.description, image: n.image }); }}>Редактировать</button>
                    <button className="btn danger" onClick={() => delNews(n.id)}>Удалить</button>
                  </div>
                )}
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function Grades({ user, cls, db, saveT }) {
  const [sData, setSData] = useState(null);
  const [cid, setCid] = useState('cls_9A');
  const [stu, setStu] = useState([]);
  const [cInfo, setCInfo] = useState(null);

  useEffect(() => {
    bilimClassAPI.getAllStudents().then((r) => r.status === 200 && setStu(r.data));
  }, []);

  useEffect(() => {
    if (!['student', 'parent'].includes(user.role)) return;
    const s = mockData.students.find((x) => x.className === cls) || mockData.students[0];
    bilimClassAPI.getStudentGrades(s.id).then((r) => r.status === 200 && setSData(r.data));
  }, [user.role, cls]);

  useEffect(() => {
    if (user.role !== 'teacher') return;
    bilimClassAPI.getClassStats(cid).then((r) => r.status === 200 && setCInfo(r.data));
  }, [user.role, cid]);

  if (user.role === 'student' || user.role === 'parent') {
    return (
      <div className="card">
        <h3>Таблица оценок</h3>
        {!sData ? <p>Загрузка...</p> : (
          <table className="table">
            <thead><tr><th>Предмет</th><th>КР</th><th>Сор1</th><th>Сор2</th><th>Соч</th></tr></thead>
            <tbody>
              {sData.subjects.map((s) => (
                <tr key={s.subjectId}>
                  <td>{s.subjectName}</td>
                  <td>{s.row.kr ? `${s.row.kr.score}/${s.row.kr.maxScore}` : '-'}</td>
                  <td>{s.row.sor1 ? `${s.row.sor1.score}/${s.row.sor1.maxScore}` : '-'}</td>
                  <td>{s.row.sor2 ? `${s.row.sor2.score}/${s.row.sor2.maxScore}` : '-'}</td>
                  <td>{s.row.soch ? `${s.row.soch.score}/${s.row.soch.maxScore}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  if (user.role === 'teacher') {
    const list = stu.filter((s) => s.classId === cid);
    return (
      <div className="card">
        <h3>Редактирование оценок (учитель)</h3>
        <select value={cid} onChange={(e) => setCid(e.target.value)}>
          {mockData.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {cInfo && <p>Класс: {cInfo.class.name} | Учеников: {cInfo.summary.studentCount}</p>}
        <table className="table">
          <thead><tr><th>Ученик</th><th>Предмет</th><th>КР</th><th>Сор1</th><th>Сор2</th><th>Соч</th><th></th></tr></thead>
          <tbody>
            {list.slice(0, 15).flatMap((st) =>
              mockData.subjects.slice(0, 4).map((sub) => (
                <TR
                  key={`${st.id}_${sub.id}`}
                  n={st.name}
                  sub={sub.name}
                  row={db.teacherEdited?.[st.id]?.[sub.name] || { kr: 70, sor1: 12, sor2: 14, soch: 35 }}
                  save={(row) => saveT({ studentId: st.id, subjectName: sub.name, ...row })}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function TR({ n, sub, row, save }) {
  const [f, setF] = useState(row);
  return (
    <tr>
      <td>{n}</td>
      <td>{sub}</td>
      <td><input type="number" value={f.kr} onChange={(e) => setF((p) => ({ ...p, kr: e.target.value }))} /></td>
      <td><input type="number" value={f.sor1} onChange={(e) => setF((p) => ({ ...p, sor1: e.target.value }))} /></td>
      <td><input type="number" value={f.sor2} onChange={(e) => setF((p) => ({ ...p, sor2: e.target.value }))} /></td>
      <td><input type="number" value={f.soch} onChange={(e) => setF((p) => ({ ...p, soch: e.target.value }))} /></td>
      <td><button className="btn ghost" onClick={() => save(f)}>Сохранить</button></td>
    </tr>
  );
}

function Clubs({ user, db, stMail, tgClub, reqClub }) {
  const arr = db.clubs.filter((x) => x.approved);

  if (user.role === 'student') {
    return (
      <div className="card">
        <h3>Кружки</h3>
        {arr.map((c) => {
          const yes = db.clubEnrollments.some((x) => x.studentEmail === stMail && x.clubId === c.id);
          return <div key={c.id} className="row between line"><span>{c.name}</span><button className={`btn ${yes ? 'ghost' : 'primary'}`} onClick={() => tgClub(c.id)}>{yes ? 'Отписаться' : 'Подписаться'}</button></div>;
        })}
      </div>
    );
  }

  if (user.role === 'parent') {
    return (
      <div className="card">
        <h3>Кружки ученика</h3>
        {arr.map((c) => {
          const yes = db.clubEnrollments.some((x) => x.studentEmail === stMail && x.clubId === c.id);
          return <div key={c.id} className="row between line"><span>{c.name}</span><strong>{yes ? 'Записан' : 'Не записан'}</strong></div>;
        })}
      </div>
    );
  }

  if (user.role === 'teacher') {
    const [n, setN] = useState('');
    const my = arr.filter((c) => c.teacherId === user.id);
    return (
      <div className="card">
        <h3>Кружки учителя</h3>
        <div className="row">
          <input placeholder="Название нового кружка" value={n} onChange={(e) => setN(e.target.value)} />
          <button className="btn primary" onClick={() => { if (!n) return; reqClub(n); setN(''); }}>Создать заявку</button>
        </div>
        {my.map((c) => {
          const list = db.clubEnrollments.filter((e) => e.clubId === c.id).map((e) => e.studentEmail);
          return <div key={c.id} className="subCard"><h4>{c.name}</h4><ul>{list.length ? list.map((x) => <li key={x}>{x}</li>) : <li>Нет участников</li>}</ul></div>;
        })}
      </div>
    );
  }

  return null;
}

function Stats({ db, doReq }) {
  return (
    <>
      <div className="card">
        <h3>Статистика</h3>
        <p>Пользователей: {db.users.length}</p>
        <p>Кружков: {db.clubs.filter((c) => c.approved).length}</p>
        <p>Записей в кружки: {db.clubEnrollments.length}</p>
        <p>Постов: {db.news.length}</p>
      </div>

      <div className="card">
        <h3>Заявки кружков</h3>
        {db.clubRequests.map((r) => (
          <div key={r.id} className="row between line">
            <span>{r.name} ({r.status})</span>
            {r.status === 'pending' && <div className="row"><button className="btn primary" onClick={() => doReq(r.id, true)}>Подтвердить</button><button className="btn danger" onClick={() => doReq(r.id, false)}>Отклонить</button></div>}
          </div>
        ))}
      </div>
    </>
  );
}

function Sch({ user, db, saveSch }) {
  const [c, setC] = useState('9А');
  const [t, setT] = useState('url');
  const [v, setV] = useState('');

  const b64 = (file) => {
    const fr = new FileReader();
    fr.onload = () => setV(fr.result);
    fr.readAsDataURL(file);
  };

  let arr = [];
  if (user.role === 'student') arr = [user.className];
  if (user.role === 'parent') arr = [db.users.find((u) => u.email === user.linkedStudentEmail)?.className].filter(Boolean);
  if (user.role === 'teacher') arr = user.teachesClasses || [];
  if (user.role === 'admin' || user.role === 'kiosk') arr = clsArr;

  return (
    <div className="card">
      <h3>Расписание</h3>

      {user.role === 'admin' && (
        <div className="subCard">
          <h4>Изменить ссылку/файл расписания</h4>
          <div className="grid2">
            <select value={c} onChange={(e) => setC(e.target.value)}>{clsArr.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={t} onChange={(e) => setT(e.target.value)}><option value="url">Ссылка</option><option value="file">Файл</option></select>
          </div>
          {t === 'url' ? <input placeholder="https://..." value={v} onChange={(e) => setV(e.target.value)} /> : <input type="file" onChange={(e) => e.target.files?.[0] && b64(e.target.files[0])} />}
          <button className="btn primary" onClick={() => { if (!v) return; saveSch({ className: c, sourceType: t, value: v }); setV(''); }}>Сохранить</button>
        </div>
      )}

      <div className="scheduleGrid">
        {arr.map((x) => (
          <div key={x} className="scheduleCard">
            <h4>{x}</h4>
            {db.schedules[x] ? (
              <>
                <p>Тип: {db.schedules[x].sourceType}</p>
                {db.schedules[x].sourceType === 'url' ? <a className="openBtn" href={db.schedules[x].value} target="_blank" rel="noreferrer">Открыть расписание</a> : <span>Файл загружен</span>}
                <small>Обновлено: {db.schedules[x].updatedAt}</small>
              </>
            ) : <p>Нет расписания</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chat({ user, db, send }) {
  const [to, setTo] = useState('');
  const [txt, setTxt] = useState('');
  const [op, setOp] = useState('');
  const [er, setEr] = useState('');

  const rr = db.recentDialogs[user.email] || [];
  const recent = rr.map((mail) => ({ email: mail, name: db.users.find((u) => u.email === mail)?.name || mail }));

  const data = op ? db.chats.filter((m) => (m.fromEmail === user.email && m.toEmail === op) || (m.fromEmail === op && m.toEmail === user.email)) : [];

  const sub = () => {
    setEr('');
    if (!to || !txt) return;
    const r = send({ toEmail: to, text: txt });
    if (!r.ok) return setEr(r.msg);
    setOp(to);
    setTxt('');
  };

  return (
    <div className="chatGrid">
      <div className="card">
        <h3>Недавние чаты</h3>
        {recent.length === 0 && <p>Нет диалогов</p>}
        {recent.map((x) => <button key={x.email} className={`chatItem ${op === x.email ? 'active' : ''}`} onClick={() => { setOp(x.email); setTo(x.email); }}>{x.name}</button>)}
      </div>

      <div className="card">
        <h3>Чат</h3>
        <div className="row">
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">Выберите получателя</option>
            {recent.map((x) => <option key={x.email} value={x.email}>{x.name} ({x.email})</option>)}
          </select>
          <input placeholder="или введите почту" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        {er && <p className="err">{er}</p>}

        <div className="chatBody">
          {data.map((m) => {
            const mine = m.fromEmail === user.email;
            const n = db.users.find((u) => u.email === m.fromEmail)?.name || m.fromEmail;
            return <div key={m.id} className={`bubble ${mine ? 'mine' : ''}`}><strong>{n}</strong><p>{m.text}</p></div>;
          })}
        </div>

        <div className="row">
          <input placeholder="Введите сообщение" value={txt} onChange={(e) => setTxt(e.target.value)} />
          <button className="btn primary" onClick={sub}>Отправить</button>
        </div>
      </div>
    </div>
  );
}

function Acc({ user, saveAcc, out }) {
  const [ed, setEd] = useState(false);
  const [n, setN] = useState(user.name);
  const [a, setA] = useState(user.avatar || '');

  const b64 = (file) => {
    const fr = new FileReader();
    fr.onload = () => setA(fr.result);
    fr.readAsDataURL(file);
  };

  return (
    <div className="card">
      <h3>Аккаунт</h3>
      <div className="row">
        <div className="avatar big">{a ? <img src={a} alt="" /> : <span>{user.name[0]}</span>}</div>
        <div>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Роль:</strong> {roleTxt[user.role]}</p>
          {user.className ? <p><strong>Класс:</strong> {user.className}</p> : null}
          <p><strong>Почта:</strong> {user.email}</p>
        </div>
      </div>

      <button className="btn ghost" onClick={() => setEd((v) => !v)}>Редактировать</button>

      {ed && (
        <div className="subCard">
          <label>Имя</label>
          <input value={n} onChange={(e) => setN(e.target.value)} />
          <label>Аватар (ссылка)</label>
          <input value={a} onChange={(e) => setA(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && b64(e.target.files[0])} />
          <button className="btn primary" onClick={() => { if (!n) return; saveAcc({ name: n, avatar: a }); setEd(false); }}>Сохранить</button>
        </div>
      )}

      <button className="btn danger" onClick={out}>Выйти из аккаунта</button>
    </div>
  );
}

function Auth({ mode, setMode, form, setForm, error, onClose, onLogin, onRegister }) {
  return (
    <div className="modalBg">
      <div className="modal">
        <div className="authLogo">BilimHub</div>
        <h3>{mode === 'login' ? 'Вход' : 'Регистрация'}</h3>

        <form className="authForm" onSubmit={mode === 'login' ? onLogin : onRegister}>
          <label>Почта</label>
          <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />

          <label>Пароль</label>
          <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />

          {mode === 'register' && (
            <>
              <label>Имя</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />

              <label>Роль</label>
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="student">Ученик</option>
                <option value="parent">Родитель</option>
                <option value="teacher">Учитель</option>
                <option value="admin">Администрация</option>
                <option value="kiosk">Киоск</option>
              </select>

              {form.role === 'student' && (
                <>
                  <label>Класс</label>
                  <select value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}>
                    {clsArr.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </>
              )}

              {form.role === 'parent' && (
                <>
                  <label>Почта ученика</label>
                  <input value={form.linkedStudentEmail} onChange={(e) => setForm((p) => ({ ...p, linkedStudentEmail: e.target.value }))} />
                </>
              )}
            </>
          )}

          {error && <p className="err">{error}</p>}
          <button className="btn primary" type="submit">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
        </form>

        <p className="switch">
          {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button type="button" className="btn link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войти'}
          </button>
        </p>

        <button className="btn ghost" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default App;