// ======================
// ระบบจัดการแบบประเมินสุขภาพจิต
// ======================

// 1. ข้อมูลและสถานะแอปพลิเคชัน
const appState = {
  currentPage: 'welcome-page',
  formData: {
    personalInfo: {
      nickname: '',
      age: '',
      gender: '',
      occupation: ''
    },
    reflection: {
      selectedOption: null,
      feelings: []
    },
    assessments: {
      st5: Array(5).fill(null),
      twoQ: [],
      nineQ: Array(9).fill(null),
      eightQ: Array(8).fill(null)
    },
    results: {}
  },
  music: {
    isPlaying: false,
    volume: 0.5
  }
};

// 2. ตัวแปรอ้างอิง DOM Elements
const DOM = {
  pages: document.querySelectorAll('.page'),
  musicControl: document.getElementById('music-control'),
  bgMusic: document.getElementById('bg-music'),
  musicToggleBtn: document.getElementById('music-toggle-btn'),
  // เพิ่ม elements อื่นๆ ตามต้องการ
};

// 3. ระบบจัดการเพลง
const musicManager = {
  init() {
    DOM.bgMusic.volume = appState.music.volume;
    DOM.musicControl.addEventListener('click', this.toggleMusic.bind(this));
    
    if (DOM.musicToggleBtn) {
      DOM.musicToggleBtn.addEventListener('click', this.toggleMusicBtn.bind(this));
    }
  },
  
  toggleMusic() {
    if (appState.music.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
    appState.music.isPlaying = !appState.music.isPlaying;
  },
  
  playMusic() {
    DOM.bgMusic.play()
      .then(() => {
        DOM.musicControl.innerHTML = '<i class="fas fa-pause"></i>';
      })
      .catch(error => {
        console.error('Error playing music:', error);
      });
  },
  
  pauseMusic() {
    DOM.bgMusic.pause();
    DOM.musicControl.innerHTML = '<i class="fas fa-music"></i>';
  },
  
  setVolume(volume) {
    appState.music.volume = volume;
    DOM.bgMusic.volume = volume;
  },

  toggleMusicBtn() {
    if (appState.music.isPlaying) {
      this.pauseMusic();
      DOM.musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> เปิด/ปิดเพลง';
    } else {
      this.playMusic();
      DOM.musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> เปิด/ปิดเพลง';
    }
    appState.music.isPlaying = !appState.music.isPlaying;
  }
};

// 4. ระบบจัดการหน้าเว็บ
const pageManager = {
  init() {
    this.setupNavigation();
    this.setupQuestionHandlers();
    const finalResultElement = document.getElementById('final-result-content');
  },
  
  showPage(pageId) {
    // ซ่อนทุกหน้า
    DOM.pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // แสดงหน้าที่ต้องการ
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      appState.currentPage = pageId;
      
      // โหลดข้อมูลสำหรับหน้าดังกล่าวหากจำเป็น
      this.loadPageData(pageId);
    } else {
      console.error(`Page with ID ${pageId} not found`);
    }
  },
  
  loadPageData(pageId) {
    // โหลดหรืออัปเดตข้อมูลเฉพาะหน้า
    switch(pageId) {
      case 'st5-result-page':
        assessmentCalculator.displayST5Result();
        break;
      case '2q-result-page':
        assessmentCalculator.display2QResult();
        break;
      case '9q-result-page':
        assessmentCalculator.display9QResultCombined();
        break;
      case '8q-result-page':
        assessmentCalculator.display8QResult();
        break;
      case 'final-result-page':
        assessmentCalculator.displayFinalResult();
        break;
      case '9q-honest-result-page':
        assessmentCalculator.display9QResultCombined({ honest: true });
        break;
    }
  },
  
  setupNavigation() {
    // ย้าย navMap ออกมานอก event handler เพื่อความชัดเจนและไม่ซ้อนซ้อน
    const navMap = {
      'back-to-welcome': 'welcome-page',
      'to-age-page': 'age-page',
      'back-to-personal-info': 'personal-info-page',
      'to-gender-page': 'gender-page',
      'back-to-gender-page': 'gender-page',
      'back-to-age-page': 'age-page',
      'to-occupation-page': 'occupation-page',
      'back-to-occupation-page': 'occupation-page',
      'to-reflection-page': 'reflection-page',
      'back-to-reflection-page': 'reflection-page',
      'to-feeling-page': 'feeling-page',
      'back-to-feeling-page': 'feeling-page',
      'to-st5-page1': 'st5-page1',
      'back-to-st5-page1': 'st5-page1',
      'to-st5-page2': 'st5-page2',
      'back-to-st5-page2': 'st5-page2',
      'to-st5-page3': 'st5-page3',
      'back-to-st5-page3': 'st5-page3',
      'to-st5-page4': 'st5-page4',
      'back-to-st5-page4': 'st5-page4',
      'to-st5-page5': 'st5-page5',
      'back-to-st5-page5': 'st5-page5',
      'to-st5-result-page': 'st5-result-page',
      'back-to-st5-result-page': 'st5-result-page',
      'to-st5-special-result': 'st5-special-result',
      'back-to-st5-special-result': 'st5-result-page',
      'to-thanks-page': 'thanks-page',
      'back-to-thanks-page': 'thanks-page',
      'to-st5-honest-result': 'st5-honest-result',
      'back-to-st5-honest-result': 'st5-result-page',
      'to-st5-special-result-2': 'st5-special-result-2',
      'back-to-st5-special-result-2': 'st5-special-result-2',
      'to-2q-page': '2q-page',
      'back-to-2q-page': '2q-page',
      'to-2q-result-page': '2q-result-page',
      'to-thanks-page-2': 'thanks-page-2',
      'to-2q-honest-result-page': '2q-honest-result-page',
      'back-to-2q-honest-result-page': '2q-honest-result-page',
      'to-2q-special-result-page': '2q-special-result-page',
      'back-to-2q-special-result-page': '2q-special-result-page',
      'to-9q-page1': '9q-page1',
      'back-to-9q-page1': '9q-page1',
      'to-9q-page2': '9q-page2',
      'back-to-9q-page2': '9q-page2',
      'to-9q-page3': '9q-page3',
      'back-to-9q-page3': '9q-page3',
      'to-9q-page4': '9q-page4',
      'back-to-9q-page4': '9q-page4',
      'to-9q-page5': '9q-page5',
      'back-to-9q-page5': '9q-page5',
      'to-9q-page6': '9q-page6',
      'back-to-9q-page6': '9q-page6',
      'to-9q-page7': '9q-page7',
      'back-to-9q-page7': '9q-page7',
      'to-9q-page8': '9q-page8',
      'back-to-9q-page8': '9q-page8',
      'to-9q-page9': '9q-page9',
      'back-to-9q-page9': '9q-page9',
      'to-9q-result-page': '9q-result-page',
      'back-to-9q-result-page': '9q-result-page',
      'to-9q-thankyou-page': '9q-thankyou-page',
      'to-honest-9q-result': '9q-honest-result-page',
      'back-to-honest-9q-result': '9q-honest-result-page',
      'to-9q-special-result-page': '9q-special-result-page',
      'back-to-9q-special-result-page': '9q-special-result-page',
      'to-8q-page': '8q-page',
      'back-to-8q-page': '8q-page',
      'to-8q-page-2': '8q-page-2',
      'back-to-8q-page-2': '8q-page-2',
      'to-8q-page-3': '8q-page-3',
      'back-to-8q-page-3': '8q-page-3',
      'to-8q-result-page': '8q-result-page',
      'back-to-8q-result-page': '8q-result-page',
      'to-final-result': 'final-result-page',
      'restart-assessment': 'welcome-page',
      'start-btn': 'personal-info-page',
      'to-2q-result-page': '2q-result-page',
      'to-thanks-page-2': 'thanks-page-2',
      'to-9q-special-result': '9q-special-result',
      'back-to-9q-special-result': '9q-result-page',
      'to-8q-special-result': '8q-special-result',
      'back-to-8q-special-result': '8q-result-page',
      'to-final-result-page': 'final-result-page',
      'back-to-9q-honest-result-page': '9q-honest-result-page',
    };
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;
      if (navMap[id]) {
        this.showPage(navMap[id]);
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;
      
      // เพิ่มเงื่อนไขพิเศษสำหรับการนำทาง
      if (id === 'to-st5-result-page') {
        // เงื่อนไขพิเศษ: ถ้าคะแนน ST5 >= 8 ให้ไปหน้า honest result แทน
        const st5Score = assessmentCalculator.calculateST5Score();
        if (st5Score >= 8) {
          this.showPage('st5-honest-result');
          return;
        }
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;

      // เงื่อนไขพิเศษสำหรับ 2Q: คะแนนรวม >= 1 ให้ไปหน้า honest result, ถ้า 0 ไปหน้า 2Q result
      if (id === 'to-2q-result') {
        const twoQ = appState.formData.assessments.twoQ;
        let score = 0;
        if (Array.isArray(twoQ)) {
          score = twoQ.reduce((sum, v) => sum + (parseInt(v) || 0), 0);
        }
        if (score >= 1) {
          pageManager.showPage('2q-honest-result-page');
          return;
        } else if (score === 0) {
          pageManager.showPage('2q-result-page');
          return;
        }
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;

      // เงื่อนไขสำหรับปุ่ม "ดูผลประเมิน" 9Q (แก้ไขให้ทำงานได้แน่นอน)
      if (id === 'to-9q-result-page') {
        const score = assessmentCalculator.calculate9QScore();
        if (score > 7) {
          pageManager.showPage('9q-honest-result-page');
          assessmentCalculator.display9QResultCombined({ honest: true });
        }
      }
    });
    
    document.getElementById('to-age-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-gender-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-occupation-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-reflection-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
  },
  
  showPage(pageId) {
    // ซ่อนทุกหน้า
    DOM.pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // แสดงหน้าที่ต้องการ
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      appState.currentPage = pageId;
      
      // โหลดข้อมูลสำหรับหน้าดังกล่าวหากจำเป็น
      this.loadPageData(pageId);
    } else {
      console.error(`Page with ID ${pageId} not found`);
    }
  },
  
  loadPageData(pageId) {
    // โหลดหรืออัปเดตข้อมูลเฉพาะหน้า
    switch(pageId) {
      case 'st5-result-page':
        assessmentCalculator.displayST5Result();
        break;
      case '2q-result-page':
        assessmentCalculator.display2QResult();
        break;
      case '9q-result-page':
        assessmentCalculator.display9QResultCombined();
        break;
      case '8q-result-page':
        assessmentCalculator.display8QResult();
        break;
      case 'final-result-page':
        assessmentCalculator.displayFinalResult();
        break;
      case '9q-honest-result-page':
        assessmentCalculator.display9QResultCombined({ honest: true });
        break;
    }
  },
  
  setupNavigation() {
    // ย้าย navMap ออกมานอก event handler เพื่อความชัดเจนและไม่ซ้อนซ้อน
    const navMap = {
      'back-to-welcome': 'welcome-page',
      'to-age-page': 'age-page',
      'back-to-personal-info': 'personal-info-page',
      'to-gender-page': 'gender-page',
      'back-to-gender-page': 'gender-page',
      'back-to-age-page': 'age-page',
      'to-occupation-page': 'occupation-page',
      'back-to-occupation-page': 'occupation-page',
      'to-reflection-page': 'reflection-page',
      'back-to-reflection-page': 'reflection-page',
      'to-feeling-page': 'feeling-page',
      'back-to-feeling-page': 'feeling-page',
      'to-st5-page1': 'st5-page1',
      'back-to-st5-page1': 'st5-page1',
      'to-st5-page2': 'st5-page2',
      'back-to-st5-page2': 'st5-page2',
      'to-st5-page3': 'st5-page3',
      'back-to-st5-page3': 'st5-page3',
      'to-st5-page4': 'st5-page4',
      'back-to-st5-page4': 'st5-page4',
      'to-st5-page5': 'st5-page5',
      'back-to-st5-page5': 'st5-page5',
      'to-st5-result-page': 'st5-result-page',
      'back-to-st5-result-page': 'st5-result-page',
      'to-st5-special-result': 'st5-special-result',
      'back-to-st5-special-result': 'st5-result-page',
      'to-thanks-page': 'thanks-page',
      'back-to-thanks-page': 'thanks-page',
      'to-st5-honest-result': 'st5-honest-result',
      'back-to-st5-honest-result': 'st5-result-page',
      'to-st5-special-result-2': 'st5-special-result-2',
      'back-to-st5-special-result-2': 'st5-special-result-2',
      'to-2q-page': '2q-page',
      'back-to-2q-page': '2q-page',
      'to-2q-result-page': '2q-result-page',
      'to-thanks-page-2': 'thanks-page-2',
      'to-2q-honest-result-page': '2q-honest-result-page',
      'back-to-2q-honest-result-page': '2q-honest-result-page',
      'to-2q-special-result-page': '2q-special-result-page',
      'back-to-2q-special-result-page': '2q-special-result-page',
      'to-9q-page1': '9q-page1',
      'back-to-9q-page1': '9q-page1',
      'to-9q-page2': '9q-page2',
      'back-to-9q-page2': '9q-page2',
      'to-9q-page3': '9q-page3',
      'back-to-9q-page3': '9q-page3',
      'to-9q-page4': '9q-page4',
      'back-to-9q-page4': '9q-page4',
      'to-9q-page5': '9q-page5',
      'back-to-9q-page5': '9q-page5',
      'to-9q-page6': '9q-page6',
      'back-to-9q-page6': '9q-page6',
      'to-9q-page7': '9q-page7',
      'back-to-9q-page7': '9q-page7',
      'to-9q-page8': '9q-page8',
      'back-to-9q-page8': '9q-page8',
      'to-9q-page9': '9q-page9',
      'back-to-9q-page9': '9q-page9',
      'to-9q-result-page': '9q-result-page',
      'back-to-9q-result-page': '9q-result-page',
      'to-9q-thankyou-page': '9q-thankyou-page',
      'to-honest-9q-result': '9q-honest-result-page',
      'back-to-honest-9q-result': '9q-honest-result-page',
      'to-9q-special-result-page': '9q-special-result-page',
      'back-to-9q-special-result-page': '9q-special-result-page',
      'to-8q-page': '8q-page',
      'back-to-8q-page': '8q-page',
      'to-8q-page-2': '8q-page-2',
      'back-to-8q-page-2': '8q-page-2',
      'to-8q-page-3': '8q-page-3',
      'back-to-8q-page-3': '8q-page-3',
      'to-8q-result-page': '8q-result-page',
      'back-to-8q-result-page': '8q-result-page',
      'to-final-result': 'final-result-page',
      'restart-assessment': 'welcome-page',
      'start-btn': 'personal-info-page',
      'to-2q-result-page': '2q-result-page',
      'to-thanks-page-2': 'thanks-page-2',
      'to-9q-special-result': '9q-special-result',
      'back-to-9q-special-result': '9q-result-page',
      'to-8q-special-result': '8q-special-result',
      'back-to-8q-special-result': '8q-result-page',
      'to-final-result-page': 'final-result-page',
      'back-to-9q-honest-result-page': '9q-honest-result-page',
    };
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;
      if (navMap[id]) {
        this.showPage(navMap[id]);
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;
      
      // เพิ่มเงื่อนไขพิเศษสำหรับการนำทาง
      if (id === 'to-st5-result-page') {
        // เงื่อนไขพิเศษ: ถ้าคะแนน ST5 >= 8 ให้ไปหน้า honest result แทน
        const st5Score = assessmentCalculator.calculateST5Score();
        if (st5Score >= 8) {
          this.showPage('st5-honest-result');
          return;
        }
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;

      // เงื่อนไขพิเศษสำหรับ 2Q: คะแนนรวม >= 1 ให้ไปหน้า honest result, ถ้า 0 ไปหน้า 2Q result
      if (id === 'to-2q-result') {
        const twoQ = appState.formData.assessments.twoQ;
        let score = 0;
        if (Array.isArray(twoQ)) {
          score = twoQ.reduce((sum, v) => sum + (parseInt(v) || 0), 0);
        }
        if (score >= 1) {
          pageManager.showPage('2q-honest-result-page');
          return;
        } else if (score === 0) {
          pageManager.showPage('2q-result-page');
          return;
        }
      }
    });
    
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;

      // เงื่อนไขสำหรับปุ่ม "ดูผลประเมิน" 9Q (แก้ไขให้ทำงานได้แน่นอน)
      if (id === 'to-9q-result-page') {
        const score = assessmentCalculator.calculate9QScore();
        if (score > 7) {
          pageManager.showPage('9q-honest-result-page');
          assessmentCalculator.display9QResultCombined({ honest: true });
        }
      }
    });
    
    document.getElementById('to-age-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-gender-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-occupation-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
    });
    document.getElementById('to-reflection-page').addEventListener('click', () => {
      pageManager.savePersonalInfo();
      assessmentCalculator.submitResults();
    });
  },
  
  savePersonalInfo() {
    appState.formData.personalInfo = {
      nickname: document.getElementById('nickname')?.value.trim() || '',
      age: document.getElementById('age')?.value.trim() || '',
      gender: (document.querySelector('input[name="gender"]:checked')?.value) || document.getElementById('gender')?.value || '',
      occupation: document.getElementById('occupation')?.value.trim() || ''
    };
    // ไม่ต้องเรียก submitResults() ที่นี่
  },
  
  setupQuestionHandlers() {
    // คำถาม ST-5
    for (let i = 1; i <= 5; i++) {
      const pageId = `st5-page${i}`;
      const questionDiv = document.getElementById(pageId);
      
      if (questionDiv) {
        const buttons = questionDiv.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            appState.formData.assessments.st5[i-1] = parseInt(btn.dataset.value);
          });
        });
      }
    }
    
    // คำถาม 2Q
    document.querySelectorAll('input[name="twoQ"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if (e.target.checked) {
          if (!appState.formData.assessments.twoQ.includes(value)) {
            appState.formData.assessments.twoQ.push(value);
          }
        } else {
          appState.formData.assessments.twoQ = 
            appState.formData.assessments.twoQ.filter(item => item !== value);
        }
      });
    });
    
    // คำถามความรู้สึก
    document.querySelectorAll('.feeling-option').forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
          if (appState.formData.reflection.selectedOption === value) {
            appState.formData.reflection.selectedOption = null;
          }
        } else {
          document.querySelectorAll('.feeling-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          option.classList.add('selected');
          appState.formData.reflection.selectedOption = value;
        }
      });
    });
    
    // ===== 9Q: ข้อละหน้า (ใช้ logic เดียวกับ ST-5) =====
    for (let i = 1; i <= 9; i++) {
      const pageId = `9q-page${i}`;
      const questionDiv = document.getElementById(pageId);
      if (questionDiv) {
        const buttons = questionDiv.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            appState.formData.assessments.nineQ[i-1] = parseInt(btn.dataset.value);
          });
        });
      }
    }
  },
  
  resetApp() {
    // รีเซ็ตแบบฟอร์ม
    document.getElementById('nickname').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('occupation').value = '';
    
    // รีเซ็ตข้อมูลแอป
    appState.formData = {
      personalInfo: {
        nickname: '',
        age: '',
        gender: '',
        occupation: ''
      },
      reflection: {
        selectedOption: null,
        feelings: []
      },
      assessments: {
        st5: Array(5).fill(null),
        twoQ: [],
        nineQ: Array(9).fill(null),
        eightQ: Array(8).fill(null)
      },
      results: {}
    };
    
    // รีเซ็ตการเลือกทั้งหมด
    document.querySelectorAll('.option-btn.selected').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    document.querySelectorAll('.feeling-option.selected').forEach(option => {
      option.classList.remove('selected');
    });
  }
};

// 5. ระบบคำนวณและประเมินผล
const assessmentCalculator = {
  calculateST5Score() {
    return appState.formData.assessments.st5.reduce((sum, value) => sum + (value || 0), 0);
  },
  
  calculate9QScore() {
    return appState.formData.assessments.nineQ.reduce((sum, value) => sum + (value || 0), 0);
  },
  
  displayST5Result() {
    const score = this.calculateST5Score();
    const st5ScoreElement = document.getElementById('st5-score');
    const st5MessageElement = document.getElementById('st5-message');
    const specialBtn = document.getElementById('to-st5-special-result');
    const honestBtn = document.getElementById('to-st5-honest-result');
    st5ScoreElement.textContent = score;

    // ข้อความสุ่มแบบอบอุ่น/ละมุนใจ/อ่อนโยน
    const warmMessages = [
      `จากคำตอบที่คุณให้มาดูเหมือนว่าคุณยังสามารถรับมือกับความเครียดได้ดีอยู่<br>แต่ถึงแม้ทุกอย่างดูเหมือนจะโอเคคุณก็ยังมีสิทธิ์เหนื่อย มีสิทธิ์พัก และมีสิทธิ์พูดว่า “ไม่ไหว” ได้เสมอ<br>อย่าลืมดูแลตัวเองเหมือนที่คุณดูแลคนอื่นนะ ถ้าเมื่อไรที่คุณต้องการใครสักคน “เราอยู่ตรงนี้เสมอ”`,
      `หัวใจของคุณดูเหมือนยังมีพลังในการรับมือกับสิ่งต่าง ๆ และนั่น…ก็น่าชื่นชมมาก<br>แต่เราอยากบอกไว้นิดนึงว่าคนที่ดู “โอเค” ก็มีวันที่เปราะบางได้เหมือนกัน<br>คุณไม่ต้องเข้มแข็งตลอดเวลา แค่ได้ยอมรับความรู้สึกของตัวเองในแต่ละวัน ก็เพียงพอแล้ว`,
      `🕊 ตอนนี้คุณอาจยังไม่ต้องไปต่อกับแบบทดสอบถัดไป และนั่นไม่ใช่เพราะคุณไม่สำคัญ — แต่เพราะใจของคุณบอกว่า “ตอนนี้พอแล้ว”<br>ถ้าเมื่อไรคุณอยากกลับมา เราจะรออยู่ตรงนี้พร้อมจะฟังเสมอ ไม่ว่าคุณจะเป็นยังไงในวันนั้นก็ตาม`
    ];

    if (score <= 7) {
      // สุ่มข้อความอบอุ่น
      const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      st5MessageElement.innerHTML = msg;
      st5MessageElement.style.color = 'var(--success-color)';
      if (specialBtn) specialBtn.style.display = '';
      if (honestBtn) honestBtn.style.display = 'none';
    } else if (score >= 8) {
      // แสดงปุ่มไปหน้า honest result
      if (honestBtn) honestBtn.style.display = '';
      if (specialBtn) specialBtn.style.display = 'none';
      // ซ่อนข้อความเดิม
      st5MessageElement.innerHTML = '';
    } else {
      st5MessageElement.textContent = 'คะแนนของคุณอยู่ในระดับปานกลาง ควรสังเกตอาการและพักผ่อนให้เพียงพอ';
      st5MessageElement.style.color = 'var(--warning-color)';
      if (specialBtn) specialBtn.style.display = 'none';
      if (honestBtn) honestBtn.style.display = 'none';
    }

    appState.formData.results.st5 = {
      score,
      message: st5MessageElement.textContent
    };
  },
  
  
  display2QResult() {
    const twoQ = appState.formData.assessments.twoQ;
    const messageElement = document.getElementById('2q-message');
    let score = 0;
    if (Array.isArray(twoQ)) {
      score = twoQ.reduce((sum, v) => sum + (parseInt(v) || 0), 0);
    }
    if (score >= 1) {
      // แสดงหน้า 2Q Honest Result และสุ่มข้อความ
      const honestMessages = [
        'จากคำตอบของคุณ…ดูเหมือนภายในใจของคุณกำลังบอกอะไรบางอย่างกับเรา<br>บางที คุณอาจกำลังต้องการให้ใครสักคน “ที่รับฟังอย่างเข้าใจ”<br>แบบประเมินถัดไปจะช่วยให้คุณได้ฟังเสียงภายในใจตัวเองลึกขึ้นอีกนิดไม่ใช่เพื่อหาว่าคุณผิดตรงไหน<br>แต่เพื่อให้คุณได้รู้ว่า…“ความรู้สึกแบบนี้” มีที่ของมันเสมอ และไม่จำเป็นต้องซ่อน',
        'คุณตอบคำถามที่ผ่านมาอย่างกล้าหาญมากและตรงนี้…คืออีกหนึ่งก้าวที่อาจทำให้คุณเข้าใจหัวใจตัวเองมากขึ้น ไม่มีอะไรน่ากลัวในแบบประเมินถัดไป มีแค่ “เรา” ที่จะอยู่ตรงนี้<br>พร้อมฟังคุณทุกคำตอบ โดยไม่ตัดสินเลยแม้แต่นิดเดียว',
        'ถ้าใจคุณกำลังเหนื่อย…แบบประเมินต่อไปนี้ไม่ได้มีไว้ตอกย้ำ<br>แต่มันมีไว้ให้คุณ “แสดงออกมา”เป็นพื้นที่ปลอดภัย เพราะทุกความรู้สึกที่คุณมี มีความหมาย และควรได้รับการรับฟัง ถ้าคุณพร้อม…เราจะก้าวไปด้วยกัน'
      ];
      const msg = honestMessages[Math.floor(Math.random() * honestMessages.length)];
      const honestMsgElem = document.getElementById('2q-honest-message');
      if (honestMsgElem) honestMsgElem.innerHTML = msg;
      pageManager.showPage('2q-honest-result-page');
      assessmentCalculator.submitResults(); // <<== เพิ่มตรงนี้
      return;
    } else if (score === 0) {
      // กรณีคะแนนรวม = 0
      const warmMessages = [
        'จากคำตอบของคุณตอนนี้ยังไม่พบสัญญาณที่เข้าข่ายภาวะซึมเศร้า แต่นั่นไม่ได้แปลว่าคุณต้องรู้สึกดีตลอดเวลา การเผชิญปัญหา และ การจัดการอารมณ์ได้ดี ซึ่งเป็นสิ่งที่ดี ทุกความรู้สึกของคุณมีคุณค่าเสมอ\nและคุณก็ยังสมควรได้รับการ Heal ใจ … ไม่ว่าคะแนนจะเท่าไร',
        'ดูเหมือนตอนนี้ ใจของคุณยังพอมีแรงพยุงตัวเองอยู่ ขอบคุณที่ดูแลตัวเองได้มาถึงตรงนี้นะ\nและถ้าเมื่อไรคุณเริ่มรู้สึกว่า “ไม่ไหว” อย่าลืมว่า คุณไม่ต้องรอให้พังก่อนจึงจะขอความช่วยเหลือได้',
        'แบบทดสอบบอกว่า…คุณอาจยังไม่อยู่ในช่วงที่มีภาวะซึมเศร้าชัดเจน แต่แบบทดสอบไม่ได้รู้ว่า เมื่อคืนคุณนอนหลับดีไหมหรือคุณฝืนยิ้มมานานแค่ไหนแล้ว ถ้าคุณยังรู้สึกว่า “ใจมันยังไม่เบา” การพูดคุยกับใครสักคนก็ยังเป็นสิ่งที่ดีเสมอ'
      ];
      const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      messageElement.innerHTML =
        '<b>คุณไม่มีความเสี่ยงต่อภาวะซึมเศร้า คุณยังยิ้มได้ดำเนินชีวิตได้ ยินดีด้วยนะคะ</b><br><br>' + msg.replace(/\n/g, '<br>');
      messageElement.style.color = 'var(--success-color)';
      assessmentCalculator.submitResults(); // <<== เพิ่มตรงนี้
    } else {
      messageElement.textContent = 'ผลประเมินไม่พบอาการซึมเศร้า';
      messageElement.style.color = 'var(--success-color)';
      assessmentCalculator.submitResults(); // <<== เพิ่มตรงนี้
    }
    appState.formData.results.twoQ = {
      hasDepression: twoQ.length === 2,
      message: messageElement.textContent
    };
  },
  display9QResultCombined({ honest = false } = {}) {
    const score = this.calculate9QScore();
    const scoreElement = document.getElementById(honest ? '9q-honest-score' : '9q-score');
    const messageElement = document.getElementById(honest ? '9q-honest-message' : '9q-message');
    if (!scoreElement || !messageElement) return; // ป้องกัน error ถ้า element ไม่เจอ
    let summary = '';
    if (honest) {
      if (score > 7 && score <= 12) {
        summary = 'มีอาการของโรคซึมเศร้า ระดับน้อย';
      } else if (score >= 13 && score <= 18) {
        summary = 'มีอาการของโรคซึมเศร้า ระดับปานกลาง';
      } else if (score >= 19) {
        summary = 'มีอาการของโรคซึมเศร้า ระดับรุนแรง';
      }
      scoreElement.textContent = score + ' คะแนน';
      let gentleMessages = [
        'แบบประเมินเมื่อครู่นี้บอกเราว่า…\nตอนนี้คุณอาจกำลังเผชิญกับความรู้สึกเศร้าในระดับที่ไม่ง่ายนัก\nก่อนที่เราจะไปต่อ เราอยากบอกคุณว่า…ไม่ว่าสิ่งที่คุณรู้สึกจะเข้มข้นแค่ไหน\nคุณไม่ได้แปลก และคุณไม่ได้อยู่คนเดียว\n…\nแบบประเมินถัดไปจะช่วยให้เราเข้าใจว่า สิ่งที่คุณเผชิญ \n“กระทบกับการใช้ชีวิตประจำวัน” แค่ไหน ถ้าคุณพร้อม \nเราจะพาคุณไปอย่างค่อยเป็นค่อยไป ด้วยความอ่อนโยนทุกคำถาม',
        'การตัดสินใจของคุณบอกอะไรกับเราไว้หลายอย่างแล้วใน 9Q\n และคุณทำได้ดีมากที่ตอบมันอย่างจริงใจ\nถัดจากนี้คือคำถามอีกชุด ที่จะช่วยให้เราดูแลคุณได้รอบด้านยิ่งขึ้น \nเพราะบางครั้ง ความเศร้าไม่ได้หยุดแค่ในใจ\nแต่มันอาจเริ่มกระทบการใช้ชีวิต การนอน การกิน \nหรือแม้แต่ความรู้สึกปลอดภัยของคุณเอง\nเราอยากเชิญคุณทำแบบประเมินนี้ด้วยกัน ไม่ใช่เพื่อวินิจฉัยคุณ\nแต่เพื่อ “อยู่กับคุณ” ตรงนี้ให้ชัดเจนยิ่งกว่าเดิม',
        '\nบางครั้ง ความรู้สึกที่อยู่ซุกซ่อนอยู่ภายในมันยังคงอยู่ \nและบั่นทอนอารมณ์ ความรู้สึกเราเงียบๆ\nแบบประเมินถัดไปอาจแตะบางจุดที่คุณเคยหลบสายตา \nถ้ามันรู้สึกหนัก…หยุดพักได้เสมอ ไม่มีใครเร่ง ไม่มีใครบังคับ \nแต่ถ้าคุณพร้อม…ลองให้โอกาสตัวเองได้ซื่อสัตย์กับ “ความรู้สึกลึก ๆ” ตรงนั้นอีกนิด\nแล้วเราจะฟังคุณต่อไปอย่างเบาที่สุด'
      ];
      let randomMsg = '';
      if (score >= 7) {
        randomMsg = gentleMessages[Math.floor(Math.random() * gentleMessages.length)];
      }
      messageElement.innerHTML = `<b>${summary}</b><br><br>${randomMsg.replace(/\n/g, '<br>')}`;
    } else {
      scoreElement.textContent = score;
      // ...existing code for specialMessageElement if needed...
      if (score <= 7) {
        messageElement.textContent = 'ไม่มีอาการของโรคซึมเศร้าหรือมีอาการของโรคซึมเศร้าระดับน้อยมาก';
        messageElement.style.color = 'var(--success-color)';
      }
    }
    appState.formData.results.nineQ = {
      score,
      message: messageElement.textContent
    };
  },

  displayFinalResult() {
    pageManager.savePersonalInfo();
    const finalResultElement = document.getElementById('final-result-content');
    const { nickname, age } = appState.formData.personalInfo;
    const st5Score = appState.formData.assessments.st5.reduce((a, b) => a + (b || 0), 0);
    const nineQScore = appState.formData.assessments.nineQ.reduce((a, b) => a + (b || 0), 0);

    finalResultElement.innerHTML = `
      <div class="result-section">
        <h3>ข้อมูลส่วนตัว</h3>
        <b>ชื่อ:</b> ${nickname ? nickname : 'ไม่ได้ระบุ'}<br>
        <b>อายุ:</b> ${age ? age : 'ไม่ได้ระบุ'}
      </div>
      <div class="result-section">
        <h3>ผลการประเมิน ST-5</h3>
        <b>คะแนน:</b> ${st5Score}
      </div>
      <div class="result-section">
        <h3>ผลการประเมิน 9Q</h3>
        <b>คะแนน:</b> ${nineQScore}<br>
        ${get9QMessage(nineQScore)}
      </div>
    `;

    // เรียกส่งข้อมูลไป server ที่นี่
    assessmentCalculator.submitResults();
  },
  
  async submitResults() {
    try {
      const submissionData = {
        personalInfo: appState.formData.personalInfo,
        results: {
          ...appState.formData.results,
          timestamp: new Date().toISOString()
        }
      };
      // ถ้ามี _id ให้ส่งไปด้วย
      if (appState.formData._id) {
        submissionData._id = appState.formData._id;
      }

      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // ถ้า server ส่ง _id กลับมา ให้เก็บไว้
      if (data.insertedId || data._id) {
        appState.formData._id = data.insertedId || data._id;
      }
      console.log('Submission successful:', data);
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  },
}

function get9QMessage(score) {
  if (score <= 7) {
    return 'ไม่มีอาการของโรคซึมเศร้าหรือมีอาการของโรคซึมเศร้าระดับน้อยมาก';
  } else if (score >= 8 && score <= 12) {
    return 'มีอาการของโรคซึมเศร้า ระดับน้อย';
  } else if (score >= 13 && score <= 18) {
    return 'มีอาการของโรคซึมเศร้า ระดับปานกลาง';
  } else if (score >= 19) {
    return 'มีอาการของโรคซึมเศร้า ระดับรุนแรง';
  }
  return '';
}

// 6. เริ่มต้นแอปพลิเคชัน
function initApp() {
  musicManager.init();
  pageManager.init();
  
  // แสดงหน้าแรก
  pageManager.showPage('welcome-page');
}

// รันแอปพลิเคชันเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', initApp);