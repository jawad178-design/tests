// نظام مسار القانوني - النسخة المحدثة
// Legal System Enhanced JavaScript - Based on PDF Screenshots

// Global Variables
let currentSection = 'dashboard';
let casesData = [];
let sessionsData = [];
let currentCaseId = null;

// Preloader Management
let preloaderProgress = 0;
let preloaderInterval;

// Initialize System
document.addEventListener('DOMContentLoaded', function() {
    // Add preloader-active class to body
    document.body.classList.add('preloader-active');
    
    // Start preloader
    startPreloader();
});

// Preloader Functions
function startPreloader() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    preloaderInterval = setInterval(() => {
        preloaderProgress += Math.random() * 15 + 5; // Random increment between 5-20
        
        if (preloaderProgress >= 100) {
            preloaderProgress = 100;
            clearInterval(preloaderInterval);
            
            // Complete loading after a short delay
            setTimeout(() => {
                completePreloader();
            }, 500);
        }
        
        // Update progress bar and text
        if (progressFill) {
            progressFill.style.width = preloaderProgress + '%';
        }
        if (progressText) {
            progressText.textContent = Math.round(preloaderProgress) + '%';
        }
        
    }, 200); // Update every 200ms
}

function completePreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        preloader.classList.add('fade-out');
        
        // Remove preloader and initialize system after fade out
        setTimeout(() => {
            preloader.remove();
            document.body.classList.remove('preloader-active');
            initializeSystem();
        }, 500);
    } else {
        // Fallback if preloader element not found
        document.body.classList.remove('preloader-active');
        initializeSystem();
    }
}

// Initialize System
function initializeSystem() {
    console.log('🏛️ نظام مسار القانوني - تم التحميل بنجاح');
    updateCurrentDate();
    loadDashboardData();
    setupEventListeners();
    showSection('dashboard');
    loadSampleData();
    initializeKPIAnimations();
    startKPIUpdates(); // Start periodic updates
}

// Update Current Date
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Riyadh'
        };
        dateElement.textContent = now.toLocaleDateString('ar-SA', options);
    }
}

// Initialize KPI Animations
function initializeKPIAnimations() {
    // Animate stat numbers when they come into view
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

// Animate Stat Numbers
function animateStatNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            clearInterval(timer);
            element.textContent = finalValue;
        } else {
            const displayValue = Math.floor(current);
            const suffix = finalValue.replace(/[\d,]/g, '');
            element.textContent = displayValue.toLocaleString('ar-SA') + suffix;
        }
    }, duration / steps);
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }

    // Update navigation
    updateNavigation(sectionId);

    // Load section-specific data
    loadSectionData(sectionId);
}

// Update Navigation Active State
function updateNavigation(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Find and activate current nav link
    const currentLink = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Load Section Data
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'new-case':
            loadNewCaseData();
            break;
        case 'active-cases':
            loadActiveCasesData();
            break;
        case 'case-registration':
            loadCaseRegistrationData();
            break;
        default:
            console.log(`Loading data for ${sectionId}`);
    }
}

// Generate Quick Report Function
function generateReport() {
    showNotification('🔄 جاري إنشاء التقرير السريع...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const reportData = {
            totalCases: 156,
            completedCases: 342,
            pendingCases: 28,
            successRate: 87,
            avgCaseTime: 45,
            clientSatisfaction: 4.8,
            teamPerformance: 94,
            financialSavings: '2.4M',
            riskCases: 5
        };
        
        displayQuickReport(reportData);
        showNotification('✅ تم إنشاء التقرير بنجاح!', 'success');
    }, 2000);
}

// Display Quick Report
function displayQuickReport(data) {
    const reportModal = createReportModal(data);
    document.body.appendChild(reportModal);
    
    // Show modal with animation
    setTimeout(() => {
        reportModal.classList.add('show');
    }, 100);
}

// Create Report Modal
function createReportModal(data) {
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = `
        <div class="report-modal-content">
            <div class="report-header">
                <h3><i class="fas fa-chart-bar"></i> التقرير السريع للأداء</h3>
                <button class="close-modal" onclick="closeReportModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="report-body">
                <div class="report-summary">
                    <div class="summary-item">
                        <span class="summary-label">إجمالي القضايا:</span>
                        <span class="summary-value">${data.totalCases}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">معدل النجاح:</span>
                        <span class="summary-value">${data.successRate}%</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">رضا العملاء:</span>
                        <span class="summary-value">${data.clientSatisfaction}/5.0</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">الوفورات المحققة:</span>
                        <span class="summary-value">${data.financialSavings} ريال</span>
                    </div>
                </div>
                <div class="report-chart-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <p>مخطط الأداء الشهري</p>
                </div>
            </div>
            <div class="report-footer">
                <button class="btn-blue" onclick="downloadReport()">
                    <i class="fas fa-download"></i> تحميل التقرير
                </button>
                <button class="btn-green" onclick="emailReport()">
                    <i class="fas fa-envelope"></i> إرسال بالبريد
                </button>
            </div>
        </div>
    `;
    return modal;
}

// Close Report Modal
function closeReportModal() {
    const modal = document.querySelector('.report-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Download Report
function downloadReport() {
    showNotification('📥 جاري تحميل التقرير...', 'info');
    setTimeout(() => {
        showNotification('✅ تم تحميل التقرير بنجاح!', 'success');
        closeReportModal();
    }, 1500);
}

// Email Report
function emailReport() {
    showNotification('📧 جاري إرسال التقرير بالبريد الإلكتروني...', 'info');
    setTimeout(() => {
        showNotification('✅ تم إرسال التقرير بنجاح!', 'success');
        closeReportModal();
    }, 2000);
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

// Update KPI values periodically (simulated real-time updates)
function startKPIUpdates() {
    setInterval(() => {
        updateRandomKPIs();
    }, 30000); // Update every 30 seconds
}

// Update Random KPIs
function updateRandomKPIs() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const randomStat = statNumbers[Math.floor(Math.random() * statNumbers.length)];
    
    if (randomStat) {
        const currentValue = parseInt(randomStat.textContent.replace(/[^\d]/g, ''));
        if (!isNaN(currentValue)) {
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newValue = Math.max(0, currentValue + variation);
            const suffix = randomStat.textContent.replace(/[\d,]/g, '');
            randomStat.textContent = newValue.toLocaleString('ar-SA') + suffix;
        }
    }
}

// Dashboard Functions
function loadDashboardData() {
    // Update statistics cards with real-time data
    updateStatistics();
}

function updateStatistics() {
    const stats = {
        activeCases: 42,
        completedCases: 128,
        weeklyHearings: 15,
        pendingConsultations: 7
    };

    // Update stat cards if they exist
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements.length >= 4) {
        statElements[0].textContent = stats.activeCases;
        statElements[1].textContent = stats.completedCases;
        statElements[2].textContent = stats.weeklyHearings;
        statElements[3].textContent = stats.pendingConsultations;
    }
}

// New Case Functions
function loadNewCaseData() {
    // Load new case notifications and table data
    updateNewCaseTable();
}

function updateNewCaseTable() {
    const newCases = [
        {
            caseNumber: '2025-110',
            firstHearing: '2025/10/05 - 09:30 ص',
            court: 'المحكمة العمالية - الدائرة 2'
        },
        {
            caseNumber: '2025-111',
            firstHearing: '2025/10/07 - 11:00 ص',
            court: 'المحكمة المدنية - الدائرة 3'
        },
        {
            caseNumber: '2025-112',
            firstHearing: '2025/10/08 - 10:30 ص',
            court: 'المحكمة الإدارية - الدائرة 1'
        }
    ];

    // Update table if it exists
    const tableBody = document.querySelector('.case-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        newCases.forEach(caseItem => {
            const row = createCaseTableRow(caseItem);
            tableBody.appendChild(row);
        });
    }
}

function createCaseTableRow(caseData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${caseData.caseNumber}</td>
        <td>${caseData.firstHearing}</td>
        <td>${caseData.court}</td>
        <td><button class="btn-red" onclick="openCaseRegistration('${caseData.caseNumber}')">فتح وتسجيل</button></td>
    `;
    return row;
}

// Case Registration Functions
function openCaseRegistration(caseNumber) {
    currentCaseId = caseNumber;
    showSection('case-registration');
    populateCaseRegistrationForm(caseNumber);
    showNotification('تم فتح نموذج تسجيل القضية: ' + caseNumber, 'info');
}

function populateCaseRegistrationForm(caseNumber) {
    // Pre-populate form with case data
    const form = document.querySelector('.case-registration-form');
    if (form) {
        const caseNumberInput = form.querySelector('input[type="text"]');
        if (caseNumberInput) {
            caseNumberInput.value = caseNumber;
        }
    }
}

function loadCaseRegistrationData() {
    // Load case registration form data
    console.log('Loading case registration data...');
}

// Active Cases Functions
function loadActiveCasesData() {
    // Load active cases table
    updateActiveCasesTable();
}

function updateActiveCasesTable() {
    const activeCases = [
        {
            caseNumber: '578987',
            circuit: 'المحكمة المدنية',
            plaintiff: 'خالد محمد',
            idNumber: '1088899488',
            representative: 'محمد أحمد',
            sessionNumber: '3',
            sessionDate: '3فبراير/2024م-11:30'
        },
        {
            caseNumber: '578988',
            circuit: 'المحكمة العمالية',
            plaintiff: 'فاطمة أحمد',
            idNumber: '1088899489',
            representative: 'سارة خالد',
            sessionNumber: '2',
            sessionDate: '4فبراير/2024م-10:00'
        },
        {
            caseNumber: '578989',
            circuit: 'المحكمة التجارية',
            plaintiff: 'عبد الله علي',
            idNumber: '1088899490',
            representative: 'محمد علي',
            sessionNumber: '1',
            sessionDate: '5فبراير/2024م-09:30'
        }
    ];

    const tableBody = document.querySelector('.enhanced-cases-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        activeCases.forEach(caseData => {
            const row = createActiveCaseRow(caseData);
            tableBody.appendChild(row);
        });
    }
}

function createActiveCaseRow(caseData) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${caseData.caseNumber}</td>
        <td>${caseData.circuit}</td>
        <td>${caseData.plaintiff}</td>
        <td>${caseData.idNumber}</td>
        <td>${caseData.representative}</td>
        <td>${caseData.sessionNumber}</td>
        <td>${caseData.sessionDate}</td>
        <td><button class="btn-green" onclick="openSessionDetails('${caseData.caseNumber}')">فتح وتحديث</button></td>
    `;
    return row;
}

// Session Details Functions
function openSessionDetails(caseNumber) {
    currentCaseId = caseNumber;
    showSection('session-details');
    loadSessionDetailsData(caseNumber);
    showNotification('تم فتح تفاصيل الجلسة للقضية: ' + caseNumber, 'info');
}

function loadSessionDetailsData(caseNumber) {
    // Load session details for specific case
    const sessionInfo = {
        caseType: 'مدني وطعون',
        claimType: 'مالية',
        defendantName: 'خالد محمد',
        caseDescription: 'دعوى مطالبة بحقوق مالية متأخرة...'
    };

    updateSessionInfo(sessionInfo);
}

function updateSessionInfo(sessionInfo) {
    const infoRows = document.querySelectorAll('.info-row span');
    if (infoRows.length >= 4) {
        infoRows[0].textContent = sessionInfo.caseType;
        infoRows[1].textContent = sessionInfo.claimType;
        infoRows[2].textContent = sessionInfo.defendantName;
        infoRows[3].textContent = sessionInfo.caseDescription;
    }
}

// Form Functions
function saveCase() {
    const form = document.querySelector('#newCaseForm');
    if (form) {
        const formData = new FormData(form);
        const caseData = Object.fromEntries(formData);
        
        // Validate form
        if (validateCaseForm(caseData)) {
            // Save case
            saveCaseData(caseData);
            showNotification('تم حفظ القضية بنجاح', 'success');
            form.reset();
        } else {
            showNotification('يرجى تعبئة جميع الحقول المطلوبة', 'error');
        }
    }
}

function validateCaseForm(caseData) {
    const requiredFields = ['caseName', 'caseNumber', 'courtName', 'responsibleEntity'];
    return requiredFields.every(field => caseData[field] && caseData[field].trim() !== '');
}

function saveCaseData(caseData) {
    // Save case data to storage or send to server
    casesData.push({
        id: generateCaseId(),
        ...caseData,
        status: 'active',
        createdAt: new Date().toISOString()
    });
    
    // Update local storage
    localStorage.setItem('legalSystemCases', JSON.stringify(casesData));
}

function updateSessionData() {
    const sessionForm = document.querySelector('.session-details-form');
    if (sessionForm) {
        const formData = new FormData(sessionForm);
        const sessionData = Object.fromEntries(formData);
        
        // Save session data
        saveSessionData(sessionData);
        showNotification('تم تحديث بيانات الجلسة بنجاح', 'success');
    }
}

function saveSessionData(sessionData) {
    sessionsData.push({
        id: generateSessionId(),
        caseId: currentCaseId,
        ...sessionData,
        updatedAt: new Date().toISOString()
    });
    
    // Update local storage
    localStorage.setItem('legalSystemSessions', JSON.stringify(sessionsData));
}

function closeCaseWithReason() {
    if (currentCaseId) {
        const reason = prompt('يرجى إدخال سبب إغلاق القضية:');
        if (reason) {
            closeCase(currentCaseId, reason);
            showNotification('تم إغلاق القضية: ' + currentCaseId, 'success');
            showSection('active-cases');
        }
    }
}

function closeCase(caseId, reason) {
    // Update case status to closed
    const caseIndex = casesData.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
        casesData[caseIndex].status = 'closed';
        casesData[caseIndex].closedReason = reason;
        casesData[caseIndex].closedAt = new Date().toISOString();
        
        // Update local storage
        localStorage.setItem('legalSystemCases', JSON.stringify(casesData));
    }
}

// Utility Functions
function generateCaseId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}-${random}`;
}

function generateSessionId() {
    return 'session-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function loadSampleData() {
    // Load sample data if storage is empty
    const savedCases = localStorage.getItem('legalSystemCases');
    const savedSessions = localStorage.getItem('legalSystemSessions');
    
    if (!savedCases) {
        casesData = generateSampleCases();
        localStorage.setItem('legalSystemCases', JSON.stringify(casesData));
    } else {
        casesData = JSON.parse(savedCases);
    }
    
    if (!savedSessions) {
        sessionsData = generateSampleSessions();
        localStorage.setItem('legalSystemSessions', JSON.stringify(sessionsData));
    } else {
        sessionsData = JSON.parse(savedSessions);
    }
}

function generateSampleCases() {
    return [
        {
            id: '2025-001',
            caseName: 'دعوى مطالبة مالية',
            caseNumber: '2025-001',
            courtName: 'المحكمة العمالية',
            status: 'active',
            createdAt: '2025-01-15T10:00:00Z'
        },
        {
            id: '2025-002',
            caseName: 'دعوى تعويض',
            caseNumber: '2025-002',
            courtName: 'المحكمة المدنية',
            status: 'in-court',
            createdAt: '2025-02-01T14:30:00Z'
        }
    ];
}

function generateSampleSessions() {
    return [
        {
            id: 'session-001',
            caseId: '2025-001',
            sessionNumber: 1,
            sessionDate: '2025-03-15T09:30:00Z',
            summary: 'جلسة أولى - تسجيل الحضور',
            updatedAt: '2025-03-15T09:30:00Z'
        }
    ];
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not exist
    if (!document.querySelector('#notification-styles')) {
        addNotificationStyles();
    }
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function addNotificationStyles() {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            left: 20px;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 300px;
            max-width: 500px;
            border-left: 4px solid var(--primary-blue);
            animation: slideIn 0.3s ease;
        }
        
        .notification.success { border-left-color: var(--success-green); }
        .notification.error { border-left-color: var(--danger-red); }
        .notification.warning { border-left-color: var(--warning-orange); }
        .notification.info { border-left-color: var(--primary-blue); }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-gray);
            font-size: 0.9rem;
        }
        
        @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(styles);
}

// Event Listeners
function setupEventListeners() {
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
    
    // Handle button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-green')) {
            if (e.target.textContent.includes('تحديث')) {
                updateSessionData();
            }
        }
        
        if (e.target.classList.contains('btn-red')) {
            if (e.target.textContent.includes('إغلاق القضية')) {
                closeCaseWithReason();
            }
        }
    });
    
    // Handle mobile menu toggle - updated for hamburger menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navOverlay = document.getElementById('navOverlay');
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }
    
    // Close sidebar when navigation link is clicked on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
    
    // Close sidebar with ESC key (mobile only)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 1024) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 1024) {
            // On desktop, remove mobile classes but keep sidebar visible
            if (sidebar) {
                sidebar.classList.remove('open');
            }
            const navOverlay = document.getElementById('navOverlay');
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            if (navOverlay) navOverlay.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function handleFormSubmission(form) {
    const formId = form.id;
    
    switch(formId) {
        case 'newCaseForm':
            saveCase();
            break;
        case 'sessionForm':
            updateSessionData();
            break;
        default:
            console.log('Form submitted:', formId);
    }
}

// Search and Filter Functions
function searchCases(searchTerm) {
    const filteredCases = casesData.filter(caseItem => 
        caseItem.caseName.includes(searchTerm) ||
        caseItem.caseNumber.includes(searchTerm) ||
        caseItem.courtName.includes(searchTerm)
    );
    
    updateCasesDisplay(filteredCases);
}

function filterCasesByStatus(status) {
    let filteredCases;
    
    if (status === 'all' || !status) {
        filteredCases = casesData;
    } else {
        filteredCases = casesData.filter(caseItem => caseItem.status === status);
    }
    
    updateCasesDisplay(filteredCases);
}

function updateCasesDisplay(cases) {
    // Update the cases table with filtered results
    const tableBody = document.querySelector('.enhanced-cases-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        cases.forEach(caseData => {
            const row = createActiveCaseRow(caseData);
            tableBody.appendChild(row);
        });
    }
}

// Export Functions for Reports
function exportCasesReport() {
    const csvContent = generateCasesCSV();
    downloadCSV(csvContent, 'تقرير_القضايا.csv');
}

function generateCasesCSV() {
    const headers = ['رقم القضية', 'اسم القضية', 'المحكمة', 'الحالة', 'تاريخ الإنشاء'];
    const rows = casesData.map(caseItem => [
        caseItem.caseNumber,
        caseItem.caseName,
        caseItem.courtName,
        caseItem.status,
        new Date(caseItem.createdAt).toLocaleDateString('ar-SA')
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Print Functions
function printCurrentSection() {
    const currentContent = document.querySelector('.content-section.active');
    if (currentContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html dir="rtl">
                <head>
                    <title>نظام مسار القانوني - طباعة</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Cairo', sans-serif; direction: rtl; }
                        .content-section { display: block !important; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                        .btn-red, .btn-blue, .btn-green { display: none; }
                    </style>
                </head>
                <body>
                    ${currentContent.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize tooltips and help system
function initializeHelp() {
    const helpButtons = document.querySelectorAll('[data-help]');
    helpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const helpText = this.getAttribute('data-help');
            showNotification(helpText, 'info');
        });
    });
}

// Auto-save functionality
function enableAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                saveFormDraft(form.id, input.name, input.value);
            });
        });
    });
}

function saveFormDraft(formId, fieldName, value) {
    const draftKey = `draft_${formId}`;
    const existingDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    existingDraft[fieldName] = value;
    localStorage.setItem(draftKey, JSON.stringify(existingDraft));
}

function loadFormDraft(formId) {
    const draftKey = `draft_${formId}`;
    const draft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    
    Object.keys(draft).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.value = draft[fieldName];
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('نظام مسار القانوني - خطأ:', e.error);
    showNotification('حدث خطأ في النظام. يرجى تحديث الصفحة.', 'error');
});

// Final initialization
console.log('🏛️ نظام مسار القانوني - تم تحميل جميع الوظائف بنجاح');
console.log('📋 البيانات المحفوظة:', {
    cases: casesData.length,
    sessions: sessionsData.length
});

// Hamburger Menu Functions
function toggleSidebar() {
    // Only allow toggle on mobile devices
    if (window.innerWidth > 1024) {
        return;
    }
    
    const sidebar = document.getElementById('sidebar');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    console.log('Toggle sidebar called', { sidebar: !!sidebar, navOverlay: !!navOverlay, hamburgerBtn: !!hamburgerBtn });
    
    if (sidebar && navOverlay && hamburgerBtn) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    } else {
        console.error('Missing sidebar elements:', { sidebar: !!sidebar, navOverlay: !!navOverlay, hamburgerBtn: !!hamburgerBtn });
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    if (sidebar && navOverlay && hamburgerBtn) {
        sidebar.classList.add('open');
        navOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
        
        console.log('Sidebar opened successfully');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const navOverlay = document.getElementById('navOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    if (sidebar && navOverlay && hamburgerBtn) {
        sidebar.classList.remove('open');
        navOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Sidebar closed successfully');
    }
}

// Make functions globally available for HTML onclick handlers
window.toggleSidebar = toggleSidebar;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;

// Notification System Functions
function markAllAsRead() {
    const notifications = document.querySelectorAll('.notification-item.unread');
    notifications.forEach(notification => {
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        // Update visual appearance
        notification.style.opacity = '0.8';
        notification.style.background = 'var(--bg-light)';
        
        // Update status badge
        const statusBadge = notification.querySelector('.notification-status');
        if (statusBadge) {
            statusBadge.textContent = 'مقروء';
            statusBadge.style.background = 'var(--support-green)';
        }
        
        // Update action button
        const markReadBtn = notification.querySelector('button');
        if (markReadBtn && markReadBtn.textContent.includes('علامة مقروء')) {
            markReadBtn.textContent = 'أرشفة';
            markReadBtn.className = 'btn-green';
            markReadBtn.onclick = () => archiveNotification(notification);
        }
    });
    
    // Update statistics
    updateNotificationStats();
    showNotification('تم وضع علامة مقروء على جميع التبليغات', 'success');
}

function filterUrgent() {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        if (notification.classList.contains('urgent')) {
            notification.style.display = 'block';
        } else {
            notification.style.display = 'none';
        }
    });
    showNotification('تم عرض التبليغات العاجلة فقط', 'info');
}

function archiveRead() {
    const readNotifications = document.querySelectorAll('.notification-item.read');
    readNotifications.forEach(notification => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    updateNotificationStats();
    showNotification(`تم أرشفة ${readNotifications.length} تبليغ مقروء`, 'success');
}

function createNotification() {
    showNotification('سيتم إضافة نافذة إنشاء التبليغات قريباً', 'info');
}

function archiveNotification(notificationElement) {
    notificationElement.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
        notificationElement.remove();
        updateNotificationStats();
        showNotification('تم أرشفة التبليغ', 'success');
    }, 300);
}

function markAsRead(notificationElement) {
    notificationElement.classList.remove('unread');
    notificationElement.classList.add('read');
    
    // Update visual appearance
    notificationElement.style.opacity = '0.8';
    notificationElement.style.background = 'var(--bg-light)';
    
    // Update status badge
    const statusBadge = notificationElement.querySelector('.notification-status');
    if (statusBadge) {
        statusBadge.textContent = 'مقروء';
        statusBadge.style.background = 'var(--support-green)';
    }
    
    updateNotificationStats();
    showNotification('تم وضع علامة مقروء على التبليغ', 'success');
}

function updateNotificationStats() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    const urgentNotifications = document.querySelectorAll('.notification-item.urgent.unread');
    const totalNotifications = document.querySelectorAll('.notification-item');
    
    // Update statistics in the dashboard stats
    const unreadStat = document.querySelector('.stat-card .stat-info h4');
    if (unreadStat && unreadStat.textContent === 'غير المقروءة') {
        const unreadNumber = unreadStat.parentElement.querySelector('.stat-number');
        if (unreadNumber) {
            unreadNumber.textContent = unreadNotifications.length;
        }
    }
    
    const urgentStat = document.querySelector('.stat-card .stat-info h4');
    if (urgentStat && urgentStat.textContent === 'التبليغات العاجلة') {
        const urgentNumber = urgentStat.parentElement.querySelector('.stat-number');
        if (urgentNumber) {
            urgentNumber.textContent = urgentNotifications.length;
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 3000);
}

function closeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Add slideOut animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Make notification functions globally available
window.markAllAsRead = markAllAsRead;
window.filterUrgent = filterUrgent;
window.archiveRead = archiveRead;
window.createNotification = createNotification;
window.archiveNotification = archiveNotification;
window.markAsRead = markAsRead;
window.updateNotificationStats = updateNotificationStats;
window.showNotification = showNotification;
window.closeNotification = closeNotification;

// Export functions for external use
window.LegalSystem = {
    showSection,
    openCaseRegistration,
    openSessionDetails,
    saveCase,
    updateSessionData,
    exportCasesReport,
    printCurrentSection,
    searchCases,
    filterCasesByStatus,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    markAllAsRead,
    filterUrgent,
    archiveRead,
    createNotification,
    archiveNotification,
    markAsRead,
    updateNotificationStats,
    showNotification,
    closeNotification
};