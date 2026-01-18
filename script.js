// ============================================
// متغيرات عامة
// ============================================

let courses = [];
let courseId = 0;

// العناصر من HTML
const currentGPAInput = document.getElementById('currentGPA');
const completedHoursInput = document.getElementById('completedHours');
const newGPADisplay = document.getElementById('newGPA');
const gpaIncreaseDisplay = document.getElementById('gpaIncrease');
const semesterGPADisplay = document.getElementById('semesterGPA');
const cumulativeGPADisplay = document.getElementById('cumulativeGPA');
const coursesList = document.getElementById('coursesList');
const addCourseBtn = document.getElementById('addCourseBtn');
const courseTypeSelect = document.getElementById('courseTypeSelect');

// ============================================
// عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    addCourseBtn.addEventListener('click', addCourse);
    currentGPAInput.addEventListener('change', updateResults);
    currentGPAInput.addEventListener('input', updateResults);
    completedHoursInput.addEventListener('change', updateResults);
    completedHoursInput.addEventListener('input', updateResults);
});

// ============================================
// دالة إضافة مادة جديدة
// ============================================

function addCourse() {
    const courseType = courseTypeSelect.value;
    
    if (!courseType) {
        alert('اختري نوع المادة أولاً!');
        return;
    }
    
    courseId++;
    const course = {
        id: courseId,
        type: courseType,
        name: '',
        hours: 3,
        mid: 0,
        practical: 0,
        courseGrade: 0,
        final: 0,
        activity: 0
    };
    
    courses.push(course);
    courseTypeSelect.value = '';
    renderCourses();
}
// ============================================
// دالة عرض المواد
// ============================================

function renderCourses() {
    coursesList.innerHTML = '';
    
    if (courses.length === 0) {
        coursesList.innerHTML = '<p style="text-align: center; color: #718096; padding: 40px;">لم تقم باضافة أي مواد حتى الآن</p>';
        updateResults();
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        let inputsHTML = '<h4><input type="text" placeholder=" اسم المادة(اختياري)" value="' + course.name + '" onchange="updateCourseName(' + course.id + ', this.value)"></h4>';
        inputsHTML += '<div class="course-inputs"><div><label>الساعات</label><input type="number" min="1" max="6" value="' + course.hours + '" onchange="updateCourseHours(' + course.id + ', this.value)"></div>';
        
        if (course.type === 'practical') {
            inputsHTML += '<div><label>النصفي (35)</label><input type="text" placeholder="ادخل العلامة من 100" input type="number" min="0" max="100" value="' + course.mid + '" onchange="updateCourseMark(' + course.id + ', \'mid\', this.value)"></div>';
            inputsHTML += '<div><label>العملي (30)</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.practical + '" onchange="updateCourseMark(' + course.id + ', \'practical\', this.value)"></div>';
            inputsHTML += '<div><label> علامة المادة</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.courseGrade + '" onchange="updateCourseMark(' + course.id + ', \'courseGrade\', this.value)"></div>';
        } else if (course.type === 'activity') {
            inputsHTML += '<div><label>النصفي (45)</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.mid + '" onchange="updateCourseMark(' + course.id + ', \'mid\', this.value)"></div>';
            inputsHTML += '<div><label>النشاط (10)</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.activity + '" onchange="updateCourseMark(' + course.id + ', \'activity\', this.value)"></div>';
            inputsHTML += '<div><label>علامة المادة </label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.courseGrade + '" onchange="updateCourseMark(' + course.id + ', \'courseGrade\', this.value)"></div>';
        } else if (course.type === 'noPractical') {
            inputsHTML += '<div><label>العملي (65)</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.practical + '" onchange="updateCourseMark(' + course.id + ', \'practical\', this.value)"></div>';
            inputsHTML += '<div><label>علامة المادة </label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.courseGrade+ '" onchange="updateCourseMark(' + course.id + ', \'courseGrade\', this.value)"></div>';
        }
            else if (course.type === 'noactivity') {
            inputsHTML += '<div><label> النصفي (50 )  </label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.mid + '" onchange="updateCourseMark(' + course.id + ', \'mid\', this.value)"></div>';
            inputsHTML += '<div><label>النهائي (50)</label><input type="text" placeholder="ادخل العلامة من 100"input type="number" min="0" max="100" value="' + course.courseGrade + '" onchange="updateCourseMark(' + course.id + ', \'courseGrade\', this.value)"></div>';
        }
        
        
        const calculatedFinal = calculateFinalGrade(course);
        
        inputsHTML += '</div><div class="course-grade"><span>علامة الامتحان النهائي : <strong>' + calculatedFinal.toFixed(2) + '</strong></span><button class="btn-delete" onclick="deleteCourse(' + course.id + ')">حذف</button></div>';
        
        courseCard.innerHTML = inputsHTML;
        coursesList.appendChild(courseCard);
    });
    
    updateResults();
}
// ============================================
// دالة حساب علامة النهائي
// ============================================

function calculateFinalGrade(course) {
    if (course.courseGrade === 0) {
        return 0;
    }
    
    if (course.type === 'practical') {
        // النهائي = (علامة المادة - (النصفي×0.35 + العملي×0.30)) / 0.35
        const midPoints = (course.mid / 100) * 35;
        const practicalPoints = (course.practical / 100) * 30;
        const remaining = course.courseGrade - midPoints - practicalPoints;
        const finalGrade = remaining / 0.35;
        return Math.min(100, Math.max(0, finalGrade));
    } else if (course.type === 'activity') {
        // النهائي = (علامة المادة - (النصفي×0.45 + النشاط×0.10)) / 0.45
        const midPoints = (course.mid / 100) * 45;
        const activityPoints = (course.activity / 100) * 10;
        const remaining = course.courseGrade - midPoints - activityPoints;
        const finalGrade = remaining / 0.45;
        return Math.min(100, Math.max(0, finalGrade));
    } else if (course.type === 'noPractical') {
        // النهائي = (علامة المادة - (العملي×0.65)) / 0.35
        const practicalPoints = (course.practical / 100) * 65;
        const remaining = course.courseGrade - practicalPoints;
        const finalGrade = remaining / 0.35;
        return Math.min(100, Math.max(0, finalGrade));
    }

        else if(course.type === 'noactivity'){
           // النهائي = (علامة المادة - النصفي *0.50)/ 0.50
           const midpoints =(course.mid /100)*50;
           const remaining = (course.courseGrade - midpoints);
           const finalGrade = remaining /0.50;
           return Math.min(100,Math.max(0,finalGrade));
        }

    return 0;
}
// ============================================
// دالة حساب علامة المادة النهائية (من 100)
// ============================================

function calculateCourseGrade(course) {
    if (course.type === 'practical') {
        const midScore = (course.mid / 100) * 35;
        const practicalScore = (course.practical / 100) * 30;
        const finalScore = (calculateFinalGrade(course) / 100) * 35;
        return midScore + practicalScore + finalScore;
    } else if (course.type === 'activity') {
        const midScore = (course.mid / 100) * 45;
        const activityScore = (course.activity / 100) * 10;
        const finalScore = (calculateFinalGrade(course) / 100) * 45;
        return midScore + activityScore + finalScore;
    } else if (course.type === 'noPractical') {
        const practicalScore = (course.practical / 100) * 65;
        const finalScore = (calculateFinalGrade(course) / 100) * 35;
        return practicalScore + finalScore;
    }
    return 0;
}
// ============================================
// دالة تحديث اسم المادة
// ============================================

function updateCourseName(id, name) {
    const course = courses.find(c => c.id === id);
    if (course) {
        course.name = name;
        updateResults();
    }
}

// ============================================
// دالة تحديث ساعات المادة
// ============================================

function updateCourseHours(id, hours) {
    const course = courses.find(c => c.id === id);
    if (course) {
        course.hours = Math.max(1, parseInt(hours) || 0);
        renderCourses();
    }
}

// ============================================
// دالة تحديث علامة المادة
// ============================================

function updateCourseMark(id, type, value) {
    const course = courses.find(c => c.id === id);
    if (course) {
        const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
        course[type] = numValue;
        renderCourses();
    }
}

// ============================================
// دالة حذف مادة
// ============================================

function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    renderCourses();
}
// ============================================
// دالة تحديث النتائج
// ============================================

function updateResults() {
    const currentGPA = parseFloat(currentGPAInput.value) || 0;
    const completedHours = parseInt(completedHoursInput.value) || 0;
    
    // حساب معدل الفصل الحالي والنقاط الإجمالية
    let totalPoints = 0;
    let totalHours = 0;
    
    courses.forEach(course => {
        const courseGrade = calculateCourseGrade(course);
        totalPoints += courseGrade * course.hours;
        totalHours += course.hours;
    });
    
    // معدل الفصل الحالي
    const semesterGPA = totalHours > 0 ? totalPoints / totalHours : 0;
    
    // المعدل التراكمي الجديد
    const newTotalHours = completedHours + totalHours;
    const newTotalPoints = (currentGPA * completedHours) + totalPoints;
    const newCumulativeGPA = newTotalHours > 0 ? newTotalPoints / newTotalHours : currentGPA;
    const gpaIncrease = newCumulativeGPA - currentGPA;
    
    // عرض النتائج في البطاقات العلوية
    newGPADisplay.textContent = newCumulativeGPA.toFixed(2);
    gpaIncreaseDisplay.textContent = (gpaIncrease >= 0 ? '+' : '') + gpaIncrease.toFixed(2);
    
    // تغيير اللون حسب النتيجة
    if (newCumulativeGPA >= 85) {
        gpaIncreaseDisplay.style.color = '#4ade80'; // أخضر
    } else if (newCumulativeGPA >= 75) {
        gpaIncreaseDisplay.style.color = '#fbbf24'; // أصفر
    } else {
        gpaIncreaseDisplay.style.color = '#ff6b6b'; // أحمر
    }
    
    // عرض النتائج في قسم النتائج
    semesterGPADisplay.textContent = semesterGPA.toFixed(2);
    cumulativeGPADisplay.textContent = newCumulativeGPA.toFixed(2);
}