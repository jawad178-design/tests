// نظام مسار القانوني - الوظائف التفاعلية
// Legal Case Management System - Interactive Functions

// ==================== المتغيرات العامة ====================
let currentSection = 'dashboard';
let notificationPanelOpen = false;

// بيانات تجريبية للقضايا
const sampleCases = [
    {
        id: '2025-109',
        plaintiff: 'محمد أحمد الخالدي',
        type: 'دعوى عمالية',
        court: 'المحكمة العمالية - الدائرة 4',
        status: 'active',
        nextHearing: '2025/09/30 - 10:00 ص',
        claimAmount: 4000,
        department: 'الموارد البشرية'
    },
    {
        id: '2025-108',
        plaintiff: 'سارة خالد محمد',
        type: 'دعوى مدنية',
        court: 'المحكمة المدنية - الدائرة 2',
        status: 'in-court',
        nextHearing: '2025/10/02 - 11:30 ص',
        claimAmount: 2500,
        department: 'الشؤون الإدارية'
    },
    {
        id: '2025-107',
        plaintiff: 'علي حسن أحمد',
        type: 'دعوى إدارية',
        court: 'المحكمة الإدارية - الدائرة 1',
        status: 'appeal',
        nextHearing: '2025/10/05 - 09:00 ص',
        claimAmount: 7500,
        department: 'الشؤون المالية'
    }
];

// ==================== وظائف التهيئة ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
    loadDashboardData();
});

function initializeSystem() {
    // تعيين القسم النشط
    showSection('dashboard');
    
    // تحديث تاريخ اليوم في النماذج
    const today = new Date();
    const dateString = today.toISOString().slice(0, 16);
    const receivedDateInput = document.getElementById('receivedDate');
    if (receivedDateInput) {
        receivedDateInput.value = dateString;
    }
    
    // تحديث رقم القضية التلقائي
    updateCaseNumber();
}

function setupEventListeners() {
    // البحث في القضايا
    const searchInput = document.getElementById('caseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterCases);
    }
    
    // فلاتر القضايا
    const statusFilter = document.getElementById('statusFilter');
    const courtFilter = document.getElementById('courtFilter');
    if (statusFilter) statusFilter.addEventListener('change', filterCases);
    if (courtFilter) courtFilter.addEventListener('change', filterCases);
    
    // نموذج القضية الجديدة
    const newCaseForm = document.getElementById('newCaseForm');
    if (newCaseForm) {
        newCaseForm.addEventListener('submit', handleNewCaseSubmit);
    }
    
    // إغلاق النوافذ المنبثقة بالنقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('caseModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// ==================== وظائف التنقل ====================
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المحدد
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // تحديث التنقل
    updateNavigation(sectionId);
    
    // تحميل بيانات القسم إذا لزم الأمر
    loadSectionData(sectionId);
}

function updateNavigation(activeSectionId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${activeSectionId}`) {
            item.classList.add('active');
        }
    });
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'cases':
            loadCasesData();
            break;
        case 'new-case':
            resetNewCaseForm();
            break;
    }
}

// ==================== وظائف لوحة التحكم ====================
function loadDashboardData() {
    // تحديث الإحصائيات
    updateDashboardStats();
    
    // تحديث القضايا الحديثة
    updateRecentCases();
    
    // تحديث التذكيرات
    updateReminders();
}

function updateDashboardStats() {
    // محاكاة تحديث الإحصائيات
    const stats = {
        activeCases: 47,
        favorableRulings: 23,
        appeals: 8,
        upcomingHearings: 12
    };
    
    // يمكن إضافة رسوم بيانية هنا في المستقبل
    console.log('Dashboard stats updated:', stats);
}

function updateRecentCases() {
    // تحديث قائمة القضايا الحديثة في لوحة التحكم
    const caseList = document.querySelector('.case-list');
    if (!caseList) return;
    
    // استخدام البيانات التجريبية
    let html = '';
    sampleCases.slice(0, 3).forEach(caseData => {
        html += createCaseItemHTML(caseData);
    });
    
    caseList.innerHTML = html;
}

function createCaseItemHTML(caseData) {
    const statusText = getStatusText(caseData.status);
    const statusClass = caseData.status;
    
    return `
        <div class="case-item" onclick="viewCase('${caseData.id}')">
            <div class="case-number">${caseData.id}</div>
            <div class="case-info">
                <h4>${caseData.type} - ${caseData.plaintiff}</h4>
                <p class="case-court">${caseData.court}</p>
                <span class="case-status ${statusClass}">${statusText}</span>
            </div>
            <div class="case-date">منذ يومين</div>
        </div>
    `;
}

function updateReminders() {
    // تحديث قائمة التذكيرات
    console.log('Reminders updated');
}

// ==================== وظائف إدارة القضايا ====================
function loadCasesData() {
    updateCasesTable();
}

function updateCasesTable() {
    const tableBody = document.querySelector('.cases-table tbody');
    if (!tableBody) return;
    
    let html = '';
    sampleCases.forEach(caseData => {
        html += createCaseRowHTML(caseData);
    });
    
    tableBody.innerHTML = html;
}

function createCaseRowHTML(caseData) {
    const statusText = getStatusText(caseData.status);
    
    return `
        <tr>
            <td><strong>${caseData.id}</strong></td>
            <td>${caseData.plaintiff}</td>
            <td>${caseData.type}</td>
            <td>${caseData.court}</td>
            <td><span class="status ${caseData.status}">${statusText}</span></td>
            <td>${caseData.nextHearing}</td>
            <td>
                <button class="btn-action view" onclick="viewCase('${caseData.id}')" title="عرض التفاصيل">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action edit" onclick="editCase('${caseData.id}')" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action assign" onclick="assignCase('${caseData.id}')" title="إحالة">
                    <i class="fas fa-share"></i>
                </button>
            </td>
        </tr>
    `;
}

function getStatusText(status) {
    const statusTexts = {
        'active': 'نشطة',
        'in-court': 'في المحكمة',
        'appeal': 'استئناف',
        'closed': 'مغلقة'
    };
    return statusTexts[status] || status;
}

function filterCases() {
    const searchTerm = document.getElementById('caseSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const courtFilter = document.getElementById('courtFilter')?.value || '';
    
    let filteredCases = sampleCases.filter(caseData => {
        const matchesSearch = caseData.plaintiff.toLowerCase().includes(searchTerm) ||
                            caseData.id.toLowerCase().includes(searchTerm) ||
                            caseData.type.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || caseData.status === statusFilter;
        
        const matchesCourt = !courtFilter || caseData.court.toLowerCase().includes(courtFilter);
        
        return matchesSearch && matchesStatus && matchesCourt;
    });
    
    // تحديث الجدول بالنتائج المفلترة
    updateFilteredTable(filteredCases);
}

function updateFilteredTable(cases) {
    const tableBody = document.querySelector('.cases-table tbody');
    if (!tableBody) return;
    
    if (cases.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--medium-gray);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i><br>
                    لم يتم العثور على قضايا مطابقة للبحث
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    cases.forEach(caseData => {
        html += createCaseRowHTML(caseData);
    });
    
    tableBody.innerHTML = html;
}

// ==================== وظائف القضايا ====================
function viewCase(caseId) {
    const caseData = sampleCases.find(c => c.id === caseId);
    if (!caseData) {
        showNotification('القضية غير موجودة', 'error');
        return;
    }
    
    showCaseModal(caseData);
}

function editCase(caseId) {
    // الانتقال لصفحة التعديل أو فتح نافذة تعديل
    showSection('new-case');
    populateFormWithCaseData(caseId);
}

function assignCase(caseId) {
    if (confirm('هل تريد إحالة هذه القضية إلى جهة أخرى؟')) {
        showNotification('تم إحالة القضية بنجاح', 'success');
    }
}

function populateFormWithCaseData(caseId) {
    const caseData = sampleCases.find(c => c.id === caseId);
    if (!caseData) return;
    
    // ملء النموذج ببيانات القضية للتعديل
    document.getElementById('caseNumber').value = caseData.id;
    document.getElementById('plaintiffName').value = caseData.plaintiff;
    document.getElementById('claimAmount').value = caseData.claimAmount;
    document.getElementById('department').value = caseData.department;
}

function showCaseModal(caseData) {
    const modal = document.getElementById('caseModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="case-details">
            <div class="detail-header">
                <h3>القضية رقم: ${caseData.id}</h3>
                <span class="status ${caseData.status}">${getStatusText(caseData.status)}</span>
            </div>
            
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>اسم المدعي:</strong>
                    <span>${caseData.plaintiff}</span>
                </div>
                <div class="detail-item">
                    <strong>نوع القضية:</strong>
                    <span>${caseData.type}</span>
                </div>
                <div class="detail-item">
                    <strong>المحكمة:</strong>
                    <span>${caseData.court}</span>
                </div>
                <div class="detail-item">
                    <strong>موعد الجلسة القادمة:</strong>
                    <span>${caseData.nextHearing}</span>
                </div>
                <div class="detail-item">
                    <strong>مبلغ المطالبة:</strong>
                    <span>${caseData.claimAmount} ريال</span>
                </div>
                <div class="detail-item">
                    <strong>الإدارة:</strong>
                    <span>${caseData.department}</span>
                </div>
            </div>
            
            <div class="case-tabs">
                <button class="tab-btn active" onclick="showCaseTab('overview')">نظرة عامة</button>
                <button class="tab-btn" onclick="showCaseTab('sessions')">الجلسات</button>
                <button class="tab-btn" onclick="showCaseTab('documents')">المستندات</button>
                <button class="tab-btn" onclick="showCaseTab('history')">السجل</button>
            </div>
            
            <div class="tab-content">
                <div id="overview-tab" class="tab-panel active">
                    <p>معلومات عامة عن القضية...</p>
                </div>
                <div id="sessions-tab" class="tab-panel">
                    <p>جدول الجلسات...</p>
                </div>
                <div id="documents-tab" class="tab-panel">
                    <p>المستندات المرفقة...</p>
                </div>
                <div id="history-tab" class="tab-panel">
                    <p>تاريخ التعديلات والإجراءات...</p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function showCaseTab(tabName) {
    // إزالة الحالة النشطة من جميع التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // تفعيل التبويب المحدد
    document.querySelector(`[onclick="showCaseTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('caseModal');
    modal.classList.remove('active');
}

// ==================== وظائف القضية الجديدة ====================
function resetNewCaseForm() {
    const form = document.getElementById('newCaseForm');
    if (form) {
        form.reset();
        updateCaseNumber();
    }
}

function updateCaseNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const caseNumber = `${year}-${randomNum}`;
    
    const caseNumberInput = document.getElementById('caseNumber');
    if (caseNumberInput && !caseNumberInput.value) {
        caseNumberInput.value = caseNumber;
    }
}

function handleNewCaseSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const caseData = {};
    
    // جمع بيانات النموذج
    for (let [key, value] of formData.entries()) {
        caseData[key] = value;
    }
    
    // التحقق من صحة البيانات
    if (!validateCaseData(caseData)) {
        return;
    }
    
    // محاكاة حفظ القضية
    saveCaseData(caseData);
}

function validateCaseData(data) {
    const requiredFields = ['caseNumber', 'plaintiffName', 'caseType', 'court'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            showNotification(`يرجى ملء حقل ${getFieldLabel(field)}`, 'error');
            return false;
        }
    }
    
    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        'caseNumber': 'رقم القضية',
        'plaintiffName': 'اسم المدعي',
        'caseType': 'نوع القضية',
        'court': 'المحكمة'
    };
    return labels[fieldName] || fieldName;
}

function saveCaseData(data) {
    // محاكاة حفظ البيانات
    console.log('Saving case data:', data);
    
    // إضافة القضية للبيانات التجريبية
    const newCase = {
        id: data.caseNumber,
        plaintiff: data.plaintiffName,
        type: data.caseType,
        court: data.court,
        status: 'active',
        nextHearing: data.firstHearing || 'غير محدد',
        claimAmount: data.claimAmount || 0,
        department: data.department || 'غير محدد'
    };
    
    sampleCases.unshift(newCase);
    
    showNotification('تم حفظ القضية بنجاح', 'success');
    
    // إعادة تعيين النموذج والانتقال لصفحة القضايا
    resetNewCaseForm();
    setTimeout(() => {
        showSection('cases');
    }, 1500);
}

function saveDraft() {
    showNotification('تم حفظ المسودة', 'info');
}

function saveAndAssign() {
    const form = document.getElementById('newCaseForm');
    if (validateForm(form)) {
        showNotification('تم حفظ القضية وإحالتها', 'success');
    }
}

function validateForm(form) {
    // تحقق بسيط من النموذج
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            input.focus();
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return false;
        }
    }
    
    return true;
}

// ==================== وظائف التبليغات ====================
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    notificationPanelOpen = !notificationPanelOpen;
    
    if (notificationPanelOpen) {
        panel.classList.add('active');
    } else {
        panel.classList.remove('active');
    }
}

function showNotification(message, type = 'info') {
    // إنشاء عنصر التبليغ
    const notification = document.createElement('div');
    notification.className = `notification toast ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" class="close-btn">×</button>
    `;
    
    // إضافة الأنماط المطلوبة
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInLeft 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة التبليغ تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutLeft 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-triangle',
        'warning': 'fa-exclamation-circle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// ==================== وظائف مساعدة ====================
function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('ar-SA', options);
}

function formatCurrency(amount) {
    if (!amount) return '0 ريال';
    
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
}

// إضافة أنماط الرسوم المتحركة للتبليغات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
    
    .notification.toast .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification.toast .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .case-details .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-gray);
    }
    
    .case-details .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .case-details .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        background: var(--light-gray);
        border-radius: var(--border-radius);
    }
    
    .case-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-gray);
    }
    
    .tab-btn {
        padding: 1rem 1.5rem;
        border: none;
        background: none;
        color: var(--medium-gray);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: var(--transition);
    }
    
    .tab-btn.active {
        color: var(--primary-blue);
        border-bottom-color: var(--primary-blue);
    }
    
    .tab-btn:hover {
        color: var(--primary-blue);
        background: var(--light-gray);
    }
    
    .tab-panel {
        display: none;
        padding: 2rem;
        background: var(--light-gray);
        border-radius: var(--border-radius);
    }
    
    .tab-panel.active {
        display: block;
    }
`;

document.head.appendChild(style);

console.log('Legal Case Management System initialized successfully');