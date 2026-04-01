const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const subjects = [
  { id: 'sub_001', name: 'Математика' },
  { id: 'sub_002', name: 'Физика' },
  { id: 'sub_003', name: 'Химия' },
  { id: 'sub_004', name: 'История' },
  { id: 'sub_005', name: 'Английский' },
  { id: 'sub_006', name: 'Казахский' },
  { id: 'sub_007', name: 'Биология' },
];

const classes = [
  { id: 'cls_9A', name: '9А', parallel: 9 },
  { id: 'cls_9B', name: '9Б', parallel: 9 },
  { id: 'cls_9V', name: '9В', parallel: 9 },
  { id: 'cls_10A', name: '10А', parallel: 10 },
  { id: 'cls_10B', name: '10Б', parallel: 10 },
  { id: 'cls_11A', name: '11А', parallel: 11 },
  { id: 'cls_11B', name: '11Б', parallel: 11 },
];

const boyNames = ['Алихан', 'Дамир', 'Нуржан', 'Берик', 'Арман', 'Санжар', 'Темір', 'Ерлан', 'Жанбол', 'Максат'];
const girlNames = ['Айгерим', 'Динара', 'Сауле', 'Гульнара', 'Айжан', 'Мадина', 'Зарина', 'Аида', 'Назерке', 'Камила'];
const lastNames = ['Сейтов', 'Нуров', 'Жанов', 'Бекова', 'Омаров', 'Алиев', 'Касымов', 'Муратов', 'Дюсенов', 'Ахметов'];

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getScore(maxScore, level) {
  if (level === 'strong') return rnd(Math.floor(maxScore * 0.8), maxScore);
  if (level === 'average') return rnd(Math.floor(maxScore * 0.55), Math.floor(maxScore * 0.79));
  return rnd(Math.floor(maxScore * 0.3), Math.floor(maxScore * 0.54));
}

function generateAll() {
  const students = [];
  const grades = [];
  let counter = 1;

  for (const cls of classes) {
    for (let i = 0; i < 12; i++) {
      const isBoy = i % 2 === 0;
      const firstName = isBoy ? boyNames[i % boyNames.length] : girlNames[i % girlNames.length];
      const lastName = lastNames[i % lastNames.length];

      const roll = Math.random();
      const level = roll > 0.7 ? 'strong' : roll > 0.35 ? 'average' : 'weak';

      const studentId = `st_${String(counter).padStart(3, '0')}`;
      counter++;

      students.push({
        id: studentId,
        name: `${firstName} ${lastName}`,
        classId: cls.id,
        className: cls.name,
        parallel: cls.parallel,
        level,
      });

      for (const sub of subjects) {
        grades.push({ id: `${studentId}_${sub.id}_kr`, studentId, subjectId: sub.id, subjectName: sub.name, type: 'КР', number: 1, score: getScore(100, level), maxScore: 100, date: '2025-09-10', quarter: 1 });
        grades.push({ id: `${studentId}_${sub.id}_sor1`, studentId, subjectId: sub.id, subjectName: sub.name, type: 'СОР', number: 1, score: getScore(20, level), maxScore: 20, date: '2025-10-10', quarter: 1 });
        grades.push({ id: `${studentId}_${sub.id}_sor2`, studentId, subjectId: sub.id, subjectName: sub.name, type: 'СОР', number: 2, score: getScore(20, level), maxScore: 20, date: '2025-11-10', quarter: 1 });
        grades.push({ id: `${studentId}_${sub.id}_soch`, studentId, subjectId: sub.id, subjectName: sub.name, type: 'СОЧ', number: 1, score: getScore(50, level), maxScore: 50, date: '2025-12-05', quarter: 1 });
      }
    }
  }

  return { students, grades };
}

const { students, grades } = generateAll();

export const bilimClassAPI = {
  getAllStudents: async () => {
    await delay(220);
    return {
      status: 200,
      data: students.map((s) => ({
        id: s.id,
        name: s.name,
        classId: s.classId,
        className: s.className,
        parallel: s.parallel,
      })),
    };
  },

  getStudentGrades: async (studentId) => {
    await delay(280);
    const student = students.find((s) => s.id === studentId);
    if (!student) return { status: 404, error: 'не найден' };

    const sg = grades.filter((g) => g.studentId === studentId);

    const bySubject = subjects.map((sub) => {
      const subG = sg.filter((g) => g.subjectId === sub.id);
      const kr = subG.find((g) => g.type === 'КР');
      const sor1 = subG.find((g) => g.type === 'СОР' && g.number === 1);
      const sor2 = subG.find((g) => g.type === 'СОР' && g.number === 2);
      const soch = subG.find((g) => g.type === 'СОЧ');

      return {
        subjectId: sub.id,
        subjectName: sub.name,
        row: {
          kr: kr ? { score: kr.score, maxScore: kr.maxScore } : null,
          sor1: sor1 ? { score: sor1.score, maxScore: sor1.maxScore } : null,
          sor2: sor2 ? { score: sor2.score, maxScore: sor2.maxScore } : null,
          soch: soch ? { score: soch.score, maxScore: soch.maxScore } : null,
        },
      };
    });

    return {
      status: 200,
      data: {
        student: {
          id: student.id,
          name: student.name,
          className: student.className,
          parallel: student.parallel,
        },
        subjects: bySubject,
      },
    };
  },

  getClassStats: async (classId) => {
    await delay(300);
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return { status: 404, error: 'не найден' };

    const classStudents = students.filter((s) => s.classId === classId);

    return {
      status: 200,
      data: {
        class: { id: cls.id, name: cls.name, parallel: cls.parallel },
        summary: { studentCount: classStudents.length },
      },
    };
  },
};

export const mockData = {
  students,
  grades,
  classes,
  subjects,
};

export function makeInitialPortalDb() {
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
      '9А': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=1981616314#gid=1981616314', updatedAt: '2026-03-20 10:00' },
      '9Б': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=203665765#gid=203665765', updatedAt: '2026-03-20 10:00' },
      '9В': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=1903494538#gid=1903494538', updatedAt: '2026-03-20 10:00' },
      '10А': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=2068762932#gid=2068762932', updatedAt: '2026-03-20 10:00' },
      '10Б': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=222705019#gid=222705019', updatedAt: '2026-03-20 10:00' },
      '11А': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=457180191#gid=457180191', updatedAt: '2026-03-20 10:00' },
      '11Б': { sourceType: 'url', value: 'https://docs.google.com/spreadsheets/d/1CptPCnGJE4xu4PUPtb3-Zdu-eElk8I-P/edit?gid=699220844#gid=699220844', updatedAt: '2026-03-20 10:00' },
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