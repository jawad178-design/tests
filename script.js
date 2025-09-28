// Global Variables
let currentCaseId = null;
let currentSection = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show dashboard by default
    showSection('dashboard');
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize notifications
    initializeNotifications();
    
    // Load sample data
    loadSampleData();
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(sectionId);
    
    // Update current section
    currentSection = sectionId;
    
    // Load section-specific data
    loadSectionData(sectionId);
}

function updateNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`.nav-item a[href="#${activeSection}"]`)?.parentElement;
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'cases':
            loadCasesData();
            break;
        case 'consultations':
            loadConsultationsData();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

// Dashboard Functions
function loadDashboardData() {
    updateStatistics();
    loadRecentCases();
    loadUpcomingSessions();
}

function updateStatistics() {
    // This would typically fetch real data from an API
    const stats = {
        activeCases: 45,
        courtCases: 28,
        closedWon: 156,
        appeals: 8
    };
    
    // Update the statistics cards with animation
    animateCounter('.active-cases h3', stats.activeCases);
    animateCounter('.court-cases h3', stats.courtCases);
    animateCounter('.closed-won h3', stats.closedWon);
    animateCounter('.appeals h3', stats.appeals);
}

function animateCounter(selector, targetValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 30;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 50);
}

// Cases Management
function loadCasesData() {
    // This would typically fetch data from an API
    const cases = getSampleCases();
    populateCasesTable(cases);
}

function populateCasesTable(cases) {
    const tbody = document.getElementById('casesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    cases.forEach(caseData => {
        const row = createCaseRow(caseData);
        tbody.appendChild(row);
    });
}

function createCaseRow(caseData) {
    const row = document.createElement('tr');
    row.onclick = () => showCaseDetails(caseData.id);
    
    row.innerHTML = `
        <td>${caseData.number}</td>
        <td>${caseData.type}</td>
        <td>${caseData.court}</td>
        <td>${caseData.plaintiff}</td>
        <td>${caseData.amount || '-'}</td>
        <td><span class="status ${caseData.status}">${getStatusText(caseData.status)}</span></td>
        <td>${caseData.lastSession || '-'}</td>
        <td>${caseData.nextSession || 'لم يُحدد'}</td>
        <td>
            <button class="btn-icon" onclick="showCaseDetails('${caseData.id}')" title="عرض التفاصيل">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="assignCase('${caseData.id}')" title="إحالة">
                <i class="fas fa-share"></i>
            </button>
            <button class="btn-icon" onclick="editCase('${caseData.id}')" title="تعديل">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    `;
    
    return row;
}

function getStatusText(status) {
    const statusMap = {
        'new': 'جديدة',
        'active': 'نشطة',
        'in-court': 'في المحكمة',
        'appeal': 'استئناف',
        'closed': 'مغلقة'
    };
    return statusMap[status] || status;
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add click outside to close
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeModal(modalId);
            }
        };
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showNewCaseModal() {
    showModal('newCaseModal');
    resetForm('newCaseForm');
}

function showCaseDetails(caseId) {
    currentCaseId = caseId;
    loadCaseDetails(caseId);
    showModal('caseDetailsModal');
}

function loadCaseDetails(caseId) {
    // This would typically fetch detailed case data from an API
    const caseData = getSampleCaseDetails(caseId);
    
    if (caseData) {
        updateCaseDetailsModal(caseData);
    }
}

function updateCaseDetailsModal(caseData) {
    // Update modal title and header info
    const titleElement = document.getElementById('caseDetailsTitle');
    if (titleElement) {
        titleElement.textContent = `تفاصيل القضية - ${caseData.number}`;
    }
    
    // Update case meta information
    const metaElements = document.querySelector('.case-meta');
    if (metaElements) {
        metaElements.innerHTML = `
            <span class="case-status ${caseData.status}">${getStatusText(caseData.status)}</span>
            <span class="case-court">${caseData.court}</span>
            <span class="case-rep">الممثل: ${caseData.representative}</span>
        `;
    }
    
    // Update overview tab content
    updateOverviewTab(caseData);
}

function updateOverviewTab(caseData) {
    // Update case information
    const infoElements = {
        caseNumber: caseData.number,
        caseType: caseData.type,
        court: caseData.court,
        chamber: caseData.chamber,
        claimAmount: caseData.amount,
        registrationDate: caseData.registrationDate
    };
    
    // Update plaintiff information
    const plaintiffInfo = {
        name: caseData.plaintiff,
        id: caseData.plaintiffId,
        jobTitle: caseData.jobTitle,
        department: caseData.department
    };
    
    // Update complaint text
    const complaintElement = document.querySelector('.complaint-text p');
    if (complaintElement) {
        complaintElement.textContent = caseData.complaintText || 'لا توجد تفاصيل متاحة';
    }
}

// Tab Functions
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Load tab-specific data
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'sessions':
            loadSessionsData();
            break;
        case 'documents':
            loadDocumentsData();
            break;
        case 'history':
            loadHistoryData();
            break;
    }
}

// Form Functions
function initializeFormHandlers() {
    const newCaseForm = document.getElementById('newCaseForm');
    if (newCaseForm) {
        newCaseForm.onsubmit = handleNewCaseSubmit;
    }
    
    // Initialize file upload
    const fileInput = document.getElementById('attachments');
    if (fileInput) {
        fileInput.onchange = handleFileUpload;
    }
}

function handleNewCaseSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const caseData = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateCaseForm(caseData)) {
        return;
    }
    
    // Save case (this would typically send data to an API)
    saveCaseData(caseData);
    
    // Close modal and show success message
    closeModal('newCaseModal');
    showSuccessMessage('تم حفظ القضية بنجاح');
    
    // Refresh cases list
    if (currentSection === 'cases') {
        loadCasesData();
    }
}

function validateCaseForm(caseData) {
    const requiredFields = ['caseNumber', 'court', 'caseType', 'plaintiffName'];
    
    for (const field of requiredFields) {
        if (!caseData[field]) {
            showErrorMessage(`يرجى تعبئة حقل ${getFieldLabel(field)}`);
            return false;
        }
    }
    
    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        'caseNumber': 'رقم القضية',
        'court': 'المحكمة',
        'caseType': 'نوع القضية',
        'plaintiffName': 'اسم المدعي'
    };
    return labels[fieldName] || fieldName;
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

function saveDraft() {
    const formData = new FormData(document.getElementById('newCaseForm'));
    const draftData = Object.fromEntries(formData.entries());
    
    // Save to localStorage as draft
    localStorage.setItem('caseDraft', JSON.stringify(draftData));
    showSuccessMessage('تم حفظ المسودة بنجاح');
}

// Search and Filter Functions
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.oninput = handleSearch;
    }
    
    // Initialize filters
    const filters = ['statusFilter', 'courtFilter', 'dateFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.onchange = handleFilterChange;
        }
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cases = getSampleCases();
    
    const filteredCases = cases.filter(caseData => 
        caseData.number.toLowerCase().includes(searchTerm) ||
        caseData.plaintiff.toLowerCase().includes(searchTerm) ||
        caseData.type.toLowerCase().includes(searchTerm)
    );
    
    populateCasesTable(filteredCases);
}

function handleFilterChange() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const courtFilter = document.getElementById('courtFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    let cases = getSampleCases();
    
    if (statusFilter) {
        cases = cases.filter(c => c.status === statusFilter);
    }
    
    if (courtFilter) {
        cases = cases.filter(c => c.court.includes(courtFilter));
    }
    
    if (dateFilter) {
        cases = cases.filter(c => c.registrationDate === dateFilter);
    }
    
    populateCasesTable(cases);
}

// Notification Functions
function initializeNotifications() {
    // This would typically connect to a real-time notification system
    updateNotificationCount();
}

function updateNotificationCount() {
    const count = 3; // This would come from an API
    const badge = document.querySelector('.notification-count');
    if (badge) {
        badge.textContent = count;
    }
}

// Action Functions
function assignCase(caseId) {
    event.stopPropagation(); // Prevent row click
    
    const assignment = prompt('إحالة القضية إلى:');
    if (assignment) {
        showSuccessMessage(`تم إحالة القضية ${caseId} إلى ${assignment}`);
        
        // Update case status (this would typically call an API)
        updateCaseStatus(caseId, 'assigned');
    }
}

function editCase(caseId) {
    event.stopPropagation(); // Prevent row click
    
    // Load case data into edit form
    const caseData = getSampleCaseDetails(caseId);
    if (caseData) {
        populateEditForm(caseData);
        showModal('newCaseModal');
    }
}

function updateCaseStatus(caseId, newStatus) {
    // This would typically call an API to update the case status
    console.log(`Updating case ${caseId} to status: ${newStatus}`);
}

function showAddSessionModal() {
    // This would show a modal for adding a new court session
    const sessionDate = prompt('موعد الجلسة (YYYY-MM-DD HH:mm):');
    if (sessionDate) {
        addSessionToCase(currentCaseId, sessionDate);
    }
}

function addSessionToCase(caseId, sessionDate) {
    showSuccessMessage(`تم إضافة جلسة جديدة بتاريخ ${sessionDate}`);
    
    // Refresh sessions tab
    loadSessionsData();
}

function uploadDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    
    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            showSuccessMessage(`تم رفع المستند: ${file.name}`);
        });
        
        // Refresh documents tab
        loadDocumentsData();
    };
    
    input.click();
}

// Message Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Sample Data Functions
function getSampleCases() {
    return [
        {
            id: '2025-109',
            number: '2025-109',
            type: 'عمل - مطلب مالي',
            court: 'العمالية - الدائرة 4',
            plaintiff: 'محمد أحمد',
            amount: '4,000 ريال',
            status: 'new',
            lastSession: null,
            nextSession: null,
            registrationDate: '2025-09-27'
        },
        {
            id: '2025-108',
            number: '2025-108',
            type: 'إدارية - طعن قرار',
            court: 'الإدارية - الدائرة 2',
            plaintiff: 'سارة علي',
            amount: null,
            status: 'active',
            lastSession: '15 سبتمبر 2025',
            nextSession: '5 أكتوبر 2025',
            registrationDate: '2025-09-10'
        },
        {
            id: '2025-095',
            number: '2025-095',
            type: 'تجارية - نزاع عقد',
            court: 'التجارية - الدائرة 1',
            plaintiff: 'خالد محمد',
            amount: '25,000 ريال',
            status: 'in-court',
            lastSession: '20 سبتمبر 2025',
            nextSession: '28 سبتمبر 2025',
            registrationDate: '2025-08-15'
        }
    ];
}

function getSampleCaseDetails(caseId) {
    const cases = {
        '2025-109': {
            id: '2025-109',
            number: '2025-109',
            type: 'عمل - مطلب مالي',
            court: 'المحكمة العمالية',
            chamber: 'الدائرة 4',
            plaintiff: 'محمد أحمد',
            plaintiffId: '1088899884',
            jobTitle: 'موظف إداري',
            department: 'الموارد البشرية',
            amount: '4,000 ريال',
            status: 'new',
            representative: 'أحمد محمد',
            registrationDate: '27 سبتمبر 2025',
            complaintText: 'يطالب المدعي بمستحقاته المالية المتأخرة عن فترة العمل من يناير 2024 إلى مارس 2024، والتي تشمل الراتب الأساسي وبدل السكن وبدل المواصلات، بإجمالي مبلغ 4000 ريال، مع طلب التعويض عن الأضرار التي لحقت به جراء تأخير صرف هذه المستحقات.'
        }
    };
    
    return cases[caseId];
}

function loadSampleData() {
    // This would typically load data from an API
    console.log('Sample data loaded');
}

function loadRecentCases() {
    // Update dashboard with recent cases
}

function loadUpcomingSessions() {
    // Update dashboard with upcoming sessions
}

function loadConsultationsData() {
    // Load legal consultations data
}

function loadReportsData() {
    // Load reports data
}

function loadSessionsData() {
    // Load sessions data for current case
}

function loadDocumentsData() {
    // Load documents data for current case
}

function loadHistoryData() {
    // Load history data for current case
}

// File Upload Handler
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    const fileList = document.createElement('div');
    fileList.className = 'uploaded-files';
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
            <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        `;
        fileList.appendChild(fileItem);
    });
    
    // Replace the upload area with file list
    const uploadLabel = e.target.nextElementSibling;
    uploadLabel.style.display = 'none';
    e.target.parentElement.appendChild(fileList);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -20px); opacity: 0; }
    }
    
    .uploaded-files {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .file-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 6px;
        font-size: 0.9rem;
    }
    
    .file-item i {
        color: #3498db;
    }
    
    .file-item small {
        margin-right: auto;
        color: #7f8c8d;
    }
`;
document.head.appendChild(style);

// Additional Functions for New Features

// Library Functions
function showLibraryCategory(category) {
    // Hide all categories
    const categories = document.querySelectorAll('.category-content');
    categories.forEach(cat => cat.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected category
    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
        selectedCategory.classList.add('active');
    }
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`[onclick="showLibraryCategory('${category}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

function uploadLegalDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.txt';
    
    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            showSuccessMessage(`تم رفع المستند: ${file.name}`);
        });
    };
    
    input.click();
}

function createTemplate() {
    const templateName = prompt('اسم القالب الجديد:');
    if (templateName) {
        showSuccessMessage(`تم إنشاء قالب: ${templateName}`);
    }
}

// Consultation Functions
function showConsultationDetails(consultationId) {
    // This would typically load consultation details from an API
    showModal('consultationModal');
}

function assignConsultation(consultationId) {
    event.stopPropagation();
    showModal('assignmentModal');
}

function respondConsultation(consultationId) {
    event.stopPropagation();
    showConsultationDetails(consultationId);
    setTimeout(() => {
        showResponseSection();
    }, 500);
}

function showResponseSection() {
    const responseSection = document.getElementById('responseSection');
    if (responseSection) {
        responseSection.style.display = 'block';
    }
    
    // Update modal footer to show submit button
    const modalFooter = document.querySelector('#consultationModal .modal-footer');
    if (modalFooter) {
        modalFooter.innerHTML = `
            <button type="button" class="btn-secondary" onclick="closeModal('consultationModal')">إلغاء</button>
            <button type="button" class="btn-outline" onclick="saveDraftResponse()">حفظ كمسودة</button>
            <button type="button" class="btn-primary" onclick="submitResponse()">إرسال للاعتماد</button>
        `;
    }
}

function requestMoreInfo() {
    const additionalInfo = prompt('ما المعلومات الإضافية المطلوبة؟');
    if (additionalInfo) {
        showSuccessMessage('تم إرسال طلب المعلومات الإضافية');
        closeModal('consultationModal');
    }
}

function saveDraftResponse() {
    const response = document.getElementById('legalResponse').value;
    if (response.trim()) {
        showSuccessMessage('تم حفظ الرد كمسودة');
    }
}

function submitResponse() {
    const response = document.getElementById('legalResponse').value;
    if (response.trim()) {
        showSuccessMessage('تم إرسال الرد لاعتماد مدير الشؤون القانونية');
        closeModal('consultationModal');
    } else {
        showErrorMessage('يرجى كتابة الرد القانوني');
    }
}

// Reports Functions
function generateReport() {
    showSuccessMessage('جاري إنشاء التقرير...');
    // This would typically generate a custom report
}

function exportReports() {
    showSuccessMessage('جاري تصدير التقارير...');
    // This would typically export reports as PDF or Excel
}

function updateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    showSuccessMessage(`تم تحديث التقرير: ${reportType} من ${startDate} إلى ${endDate}`);
}

// Archive Functions
function exportArchive() {
    showSuccessMessage('جاري تصدير الأرشيف...');
}

function viewArchivedCase(caseId) {
    // This would load archived case details
    showSuccessMessage(`عرض تفاصيل القضية المؤرشفة: ${caseId}`);
}

function downloadCaseFile(caseId) {
    showSuccessMessage(`تحميل ملف القضية: ${caseId}`);
}

// Settings Functions
function showSettingsTab(tabName) {
    // Hide all settings panels
    const panels = document.querySelectorAll('.settings-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all settings tabs
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected panel
    const selectedPanel = document.getElementById(tabName + '-settings');
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`[onclick="showSettingsTab('${tabName}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Session Management Functions
function showAddSessionModal() {
    if (currentCaseId) {
        document.getElementById('sessionCaseNumber').value = currentCaseId;
        showModal('addSessionModal');
    } else {
        showErrorMessage('لم يتم تحديد القضية');
    }
}

function handleAddSessionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const sessionData = Object.fromEntries(formData.entries());
    
    // Validate session form
    if (!validateSessionForm(sessionData)) {
        return;
    }
    
    // Save session data
    saveSessionData(sessionData);
    
    closeModal('addSessionModal');
    showSuccessMessage('تم حفظ الجلسة بنجاح');
}

function validateSessionForm(sessionData) {
    const requiredFields = ['sessionNumber', 'sessionDateTime', 'sessionCourt'];
    
    for (const field of requiredFields) {
        if (!sessionData[field]) {
            showErrorMessage(`يرجى تعبئة حقل ${getSessionFieldLabel(field)}`);
            return false;
        }
    }
    
    return true;
}

function getSessionFieldLabel(fieldName) {
    const labels = {
        'sessionNumber': 'رقم الجلسة',
        'sessionDateTime': 'تاريخ ووقت الجلسة',
        'sessionCourt': 'المحكمة'
    };
    return labels[fieldName] || fieldName;
}

function saveSessionData(sessionData) {
    // This would typically save session data to an API
    console.log('Session data saved:', sessionData);
}

// Initialize additional form handlers
function initializeAdditionalFormHandlers() {
    const addSessionForm = document.getElementById('addSessionForm');
    if (addSessionForm) {
        addSessionForm.onsubmit = handleAddSessionSubmit;
    }
    
    const assignmentForm = document.getElementById('assignmentForm');
    if (assignmentForm) {
        assignmentForm.onsubmit = handleAssignmentSubmit;
    }
}