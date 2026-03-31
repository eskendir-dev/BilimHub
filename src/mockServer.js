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

const teachers = [
  { id: 't_001', name: 'Мария Иванова', subjectId: 'sub_001' },
  { id: 't_002', name: 'Ахмет Сейткали', subjectId: 'sub_001' },
  { id: 't_003', name: 'Асель Нурова', subjectId: 'sub_002' },
  { id: 't_004', name: 'Дамир Нуров', subjectId: 'sub_002' },
  { id: 't_005', name: 'Гульнара Сейт', subjectId: 'sub_003' },
  { id: 't_006', name: 'Берик Жанов', subjectId: 'sub_004' },
  { id: 't_007', name: 'Лейла Омар', subjectId: 'sub_005' },
  { id: 't_008', name: 'Айгуль Бекова', subjectId: 'sub_006' },
  { id: 't_009', name: 'Нуржан Алиев', subjectId: 'sub_007' },
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
      data: students.map((s) => ({ id: s.id, name: s.name, classId: s.classId, className: s.className, parallel: s.parallel })),
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
        student: { id: student.id, name: student.name, className: student.className, parallel: student.parallel },
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

export const mockData = { students, grades, classes, subjects, teachers };