# 🎓 Student Dashboard (dashboard-front)

## 📌 نظرة عامة
هذا المشروع هو **Student Dashboard** واجهة أمامية مبنية بـ **React** وتتصل بــ **Node.js/Express** في الخلفية.  
الداشبورد يعرض معلومات خاصة بالطلاب مثل الإعلانات، الكورسات المتاحة، والاختبارات (Quizzes) في شكل **Cards** تفاعلية، مع إمكانية فتح التفاصيل والتسجيل في الكورسات والمشاركة في الكويزات.

---

## ✨ المزايا الرئيسية
- لوحة تحكم للطالب تعرض:
  - 📰 **Cards للإعلانات** (Announcements) مع تاريخ النشر والتفاصيل.
  - 📚 **Cards للكورسات** (Courses) مع زر الانضمام أو عرض المحتوى.
  - 📝 **Cards للاختبارات** (Quizzes) مع حالة (Not Started / In Progress / Completed).
- عرض عدد الكورسات المكتملة / المعلقة.
- ربط مع APIs لاستدعاء البيانات (announcements, courses, quizzes, user).
- تصميم Responsive يعمل بشكل جيد على الموبايل والكمبيوتر.
- إدارة الحالة باستخدام React Hooks (useState, useEffect) — قابل للتطوير لاستعمال Context أو Redux.

---

## 🛠️ التقنيات المستخدمة
- **Frontend:** React.js, Axios, Tailwind CSS / Bootstrap (حسب الموجود عندك)  
- **Backend (مختصر):** Node.js, Express.js (API endpoints متوقع أن تكون موجودة في مشروع `dashboard-backend`)  
- **Authentication:** JWT أو Cookie-based (حسب التطبيق)  
- **Database (خلفية):** MongoDB / PostgreSQL (تختلف حسب الـ backend)  
- **Version Control:** Git / GitHub

---

## 🔌 واجهات الـ API المتوقعة (مثال)
> تأكدي من أن الـ `REACT_APP_API_URL` يشير للـ backend الصحيح.

- `GET /api/announcements` — جلب كل الإعلانات  
- `GET /api/courses` — جلب كل الكورسات  
- `GET /api/courses/:id` — جلب تفاصيل كورس معين  
- `GET /api/quizzes` — جلب كل الكويزات  
- `POST /api/auth/login` — تسجيل دخول  
- `GET /api/user/profile` — جلب بيانات المستخدم

---

## 🚀 كيفية التشغيل محليًا (Frontend)

1. انسخي المجلد أو افتحي المشروع:
```bash
git clone <repo-link>
cd dashboard-front
