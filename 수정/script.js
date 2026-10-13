// ==========================================
// 1. 공통 뷰, 사이드바, 각종 모달 및 법적 문서 팝업 제어
// ==========================================
const loginModal = document.getElementById('login-modal');
document.getElementById('btn-open-login').addEventListener('click', () => loginModal.classList.add('active'));
document.getElementById('btn-close-login').addEventListener('click', () => loginModal.classList.remove('active'));

const filterModal = document.getElementById('filter-modal');
const btnOpenFilter = document.getElementById('btn-open-filter');
const btnCloseFilter = document.getElementById('btn-close-filter');
const btnApplyFilter = document.getElementById('btn-apply-filter');

if (btnOpenFilter) btnOpenFilter.addEventListener('click', () => filterModal.classList.add('active'));
if (btnCloseFilter) btnCloseFilter.addEventListener('click', () => filterModal.classList.remove('active'));
if (btnApplyFilter) btnApplyFilter.addEventListener('click', () => {
    alert('상세 필터가 적용되었습니다. (목업)');
    filterModal.classList.remove('active');
});

window.openDocModal = function(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) targetModal.classList.add('active');
};

window.closeDocModal = function(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) targetModal.classList.remove('active');
};

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});

const sidebar = document.getElementById('side-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnOpenSidebar = document.getElementById('btn-open-sidebar');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');

function openSidebar() { sidebar.classList.add('active'); sidebarOverlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('active'); sidebarOverlay.classList.remove('active'); }

if(btnOpenSidebar) btnOpenSidebar.addEventListener('click', openSidebar);
if(btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeSidebar);
if(sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.side-nav-item:not(#nav-bookmark)').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        alert('해당 카테고리 기능은 준비 중입니다!');
        closeSidebar();
    });
});

// ==========================================
// 2. 버튼 및 인터랙션 로직
// ==========================================
document.querySelectorAll('.region-btn, .chip:not(#btn-near-me)').forEach(el => {
    el.addEventListener('click', () => {
        if(el.classList.contains('region-btn')) {
            document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
        } else {
            el.style.borderColor = el.style.borderColor === 'var(--text-primary)' ? 'var(--border-color)' : 'var(--text-primary)';
            el.style.color = el.style.color === 'var(--text-primary)' ? 'var(--text-secondary)' : 'var(--text-primary)';
        }
    });
});

const btnNearMe = document.getElementById('btn-near-me');
if (btnNearMe) {
    btnNearMe.addEventListener('click', () => {
        alert('위치 권한을 허용하시면, 현재 계신 곳 주변의 핫플을 찾아드립니다!');
    });
}

let bookmarkCount = 0;
const bookmarkCountEl = document.getElementById('bookmark-count');

document.querySelectorAll('.heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        btn.classList.toggle('active'); 
        if (btn.classList.contains('active')) {
            bookmarkCount++;
        } else {
            bookmarkCount--;
        }
        bookmarkCountEl.textContent = bookmarkCount;
    });
});

// ==========================================
// 3. SPA 화면 라우팅
// ==========================================
const viewHome = document.getElementById('view-home');
const viewWrite = document.getElementById('view-write');
const viewAi = document.getElementById('view-ai');

function showView(viewElement) {
    viewHome.classList.add('hidden');
    viewWrite.classList.add('hidden');
    viewAi.classList.add('hidden');
    viewElement.classList.remove('hidden');
    window.scrollTo(0, 0);
}

document.getElementById('logo-btn').addEventListener('click', () => showView(viewHome));
document.querySelectorAll('.btn-go-home').forEach(btn => {
    btn.addEventListener('click', () => showView(viewHome));
});
document.getElementById('btn-go-write').addEventListener('click', () => showView(viewWrite));
document.getElementById('btn-go-ai').addEventListener('click', () => showView(viewAi));

// ==========================================
// 4. 수동 코스 기획 폼 로직
// ==========================================
const timelineInputs = document.querySelector('.timeline-inputs');
function addDragEvents(item) {
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); updateStepNumbers(); });
}
document.querySelectorAll('.timeline-item').forEach(item => addDragEvents(item));

timelineInputs.addEventListener('dragover', e => {
    e.preventDefault(); 
    const afterElement = getDragAfterElement(timelineInputs, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (draggable) {
        if (afterElement == null) timelineInputs.appendChild(draggable);
        else timelineInputs.insertBefore(draggable, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.timeline-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateStepNumbers() {
    document.querySelectorAll('.timeline-item .step-num').forEach((step, index) => step.textContent = index + 1);
}

const btnAddPlace = document.getElementById('btn-add-place');
if (btnAddPlace) {
    btnAddPlace.addEventListener('click', () => {
        const itemCount = document.querySelectorAll('.timeline-item').length + 1;
        const newItem = document.createElement('div');
        newItem.classList.add('timeline-item');
        newItem.setAttribute('draggable', 'true');
        newItem.innerHTML = `
            <span class="drag-handle" title="순서 변경">⋮⋮</span>
            <span class="step-num">${itemCount}</span>
            <div class="input-with-icon" style="flex:1;">
                <span class="input-icon">📍</span>
                <input type="text" placeholder="새로운 장소 입력">
            </div>
            <button type="button" class="btn-delete-place" aria-label="삭제">✕</button>
        `;
        addDragEvents(newItem);
        timelineInputs.appendChild(newItem);
        updateStepNumbers();
    });
}

timelineInputs.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-place')) {
        if (document.querySelectorAll('.timeline-item').length > 1) {
            e.target.closest('.timeline-item').remove();
            updateStepNumbers();
        } else alert("최소 1개의 장소는 입력해야 합니다.");
    }
});

const coverPhotoInput = document.getElementById('cover-photo');
const uploadArea = document.querySelector('.photo-upload-area');
if (coverPhotoInput && uploadArea) {
    coverPhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                uploadArea.style.backgroundImage = `url('${event.target.result}')`;
                uploadArea.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });
}

function saveManualForm() {
    const titleInput = document.querySelector('.title-input');
    if (!titleInput.value.trim()) return alert('제목을 입력해주세요!'), titleInput.focus();

    const newCourse = {
        id: Date.now(), title: titleInput.value,
        date: document.querySelector('input[type="date"]')?.value || '',
        budget: document.querySelector('.input-wrap input[type="text"]')?.value || '',
        places: Array.from(document.querySelectorAll('.timeline-item input[type="text"]')).map(input => input.value.trim()).filter(val => val !== ''),
        memo: document.querySelector('textarea')?.value || '',
        coverImage: uploadArea && uploadArea.classList.contains('has-image') ? uploadArea.style.backgroundImage : null
    };
    
    saveToLocalStorage(newCourse);
    alert('성공적으로 저장되었습니다!');
    document.getElementById('monodate-form').reset();
    
    if (uploadArea) {
        uploadArea.style.backgroundImage = '';
        uploadArea.classList.remove('has-image');
    }
    showView(viewHome);
}

const btnSaveManualTop = document.getElementById('btn-save-manual-top');
const btnSaveManualBottom = document.getElementById('btn-save-manual-bottom');

if (btnSaveManualTop) btnSaveManualTop.addEventListener('click', saveManualForm);
if (btnSaveManualBottom) btnSaveManualBottom.addEventListener('click', saveManualForm);

function saveToLocalStorage(courseObj) {
    const savedCourses = JSON.parse(localStorage.getItem('monodate_courses')) || [];
    savedCourses.push(courseObj);
    localStorage.setItem('monodate_courses', JSON.stringify(savedCourses));
}

// ==========================================
// 5. AI 자동 추천 로직 및 인터랙션
// ==========================================
const aiInputStep = document.getElementById('ai-input-step');
const aiLoadingStep = document.getElementById('ai-loading-step');
const aiResultStep = document.getElementById('ai-result-step');
let currentAiCourse = null;

document.getElementById('btn-start-ai').addEventListener('click', () => {
    const region = document.getElementById('ai-region').value.trim() || '성수동';
    const themeSelect = document.getElementById('ai-theme');
    const themeText = themeSelect.options[themeSelect.selectedIndex].text.split('(')[0].trim();
    const budgetSelect = document.getElementById('ai-budget');
    const budgetText = budgetSelect.options[budgetSelect.selectedIndex].text;

    aiInputStep.classList.add('hidden');
    aiLoadingStep.classList.remove('hidden');

    setTimeout(() => {
        currentAiCourse = {
            id: Date.now(),
            title: `${region} 맞춤형 AI 코스 ✨`,
            date: '', 
            budget: budgetText,
            memo: `AI가 ${region} 지역의 [${themeText}] 테마로 동선을 최적화했습니다. 인기 핫플 위주로 구성했으며 주차 정보와 도보 이동 시간을 고려하여 피로도를 낮췄습니다.`,
            places: [
                {
                    name: '오우드 성수',
                    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80',
                    tags: ['#디저트맛집', '#채광좋은', '#주차불가'],
                    transit: '🚶 도보 7분'
                },
                {
                    name: '디올 성수 팝업',
                    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=150&q=80',
                    tags: ['#인생샷', '#외관맛집', '#예약필수'],
                    transit: '🚗 차량 5분'
                },
                {
                    name: '성수다락',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
                    tags: ['#오므라이스', '#분위기갑', '#웨이팅있음'],
                    transit: null
                }
            ],
            coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
        };

        renderAiResult();
        aiLoadingStep.classList.add('hidden');
        aiResultStep.classList.remove('hidden');
    }, 2000);
});

function renderAiResult() {
    document.getElementById('ai-result-title').textContent = currentAiCourse.title;
    document.getElementById('ai-result-memo').textContent = currentAiCourse.memo;
    
    const timelineContainer = document.getElementById('ai-result-timeline');
    timelineContainer.innerHTML = '';
    
    currentAiCourse.places.forEach((place, index) => {
        const isLast = index === currentAiCourse.places.length - 1;
        const tagsHtml = place.tags.map(tag => `<span>${tag}</span>`).join('');
        
        let html = `
            <div class="ai-spot-card">
                <div class="ai-spot-img" style="background-image: url('${place.image}')">
                    <div class="ai-spot-num">${index + 1}</div>
                </div>
                <div class="ai-spot-info">
                    <h4 class="ai-spot-name">${place.name}</h4>
                    <div class="ai-spot-tags">${tagsHtml}</div>
                </div>
                <button class="btn-swap-spot" onclick="swapSpot(${index})" title="이 장소만 변경" aria-label="장소 교체">🔄</button>
            </div>
        `;
        
        if (!isLast) {
            html += `
                <div class="ai-transit-track">
                    <span class="ai-transit-badge">${place.transit}</span>
                </div>
            `;
        }
        timelineContainer.innerHTML += html;
    });
}

window.swapSpot = function(index) {
    alert(`[${currentAiCourse.places[index].name}] 장소를 AI가 새로운 곳으로 교체합니다.`);
    
    currentAiCourse.places[index].name = "새롭게 추천된 히든 스팟 ✨";
    currentAiCourse.places[index].image = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80";
    currentAiCourse.places[index].tags = ["#히든스팟", "#분위기깡패"];
    
    renderAiResult();
};

document.getElementById('btn-save-ai').addEventListener('click', () => {
    if(currentAiCourse) {
        const saveFormat = {
            id: currentAiCourse.id,
            title: currentAiCourse.title,
            date: '',
            budget: document.getElementById('ai-budget').options[document.getElementById('ai-budget').selectedIndex].text,
            places: currentAiCourse.places.map(p => p.name),
            memo: currentAiCourse.memo,
            coverImage: currentAiCourse.coverImage
        };
        
        saveToLocalStorage(saveFormat);
        alert('AI 추천 코스가 내 목록에 저장되었습니다! 홈에서 확인하세요.');
        resetAiView();
        showView(viewHome);
    }
});

document.getElementById('btn-retry-ai').addEventListener('click', () => resetAiView());

function resetAiView() {
    aiResultStep.classList.add('hidden');
    aiLoadingStep.classList.add('hidden');
    aiInputStep.classList.remove('hidden');
    document.getElementById('ai-region').value = '';
}