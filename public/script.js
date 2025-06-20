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
    switch (pageId) {
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
    const navMap = {
      'start-btn': 'rama9-page',
      'to-tree-page': 'tree-page',
      'back-to-tree-page': 'tree-page',
      'to-personal-info-page': 'personal-info-page',
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
      'to-st5-special-result-page': 'st5-special-result-page',
      'back-to-st5-special-result-page': 'st5-special-result-page',
      'to-thanks-page': 'thanks-page',
      'back-to-thanks-page': 'thanks-page',
      'to-st5-honest-result': 'st5-honest-result',
      'back-to-st5-honest-result': 'st5-result-page',
      'to-st5-special-result-2': 'st5-special-result-2',
      'back-to-st5-special-result-2': 'st5-special-result-2',
      'to-2q-page': '2q-page',
      'back-to-2q-page': '2q-page',
      'to-2q-result-page': '2q-result-page',
      'back-to-2q-result-page': '2q-result-page',
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
      'to-final-result': 'final-result-page',
      'restart-assessment': 'welcome-page',
      'back-to-welcome-page': 'welcome-page',
      'to-thanks-page-2': 'thanks-page-2',
      'to-9q-special-result': '9q-special-result',
      'back-to-9q-special-result': '9q-result-page',
      'to-8q-special-result': '8q-special-result',
      'back-to-8q-special-result': '8q-result-page',
      'to-final-result-page': 'final-result-page',
      'back-to-9q-honest-result-page': '9q-honest-result-page',
      'back-to-rama9-page': 'rama9-page',
    };

    // การจัดการการคลิกปุ่มนำทาง
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.id;
      if (!id) return;
      
      // เล่นเพลงเมื่อกดปุ่ม start-btn
      if (id === 'start-btn') {
        musicManager.playMusic();
      }
      // ตรวจสอบ navMap ก่อน
      if (navMap[id]) {
        this.showPage(navMap[id]);
      }
      
      // เงื่อนไขพิเศษสำหรับการนำทาง
      if (id === 'to-st5-result-page') {
        // ถ้าคะแนน ST5 >= 8 ให้ไปหน้า honest result
        const st5Score = assessmentCalculator.calculateST5Score();
        if (st5Score >= 8) {
          this.showPage('st5-honest-result');
          return;
        }
      }
      
      if (id === 'to-2q-result-page') {
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
      
      if (id === 'to-9q-result-page') {
        const score = assessmentCalculator.calculate9QScore();
        if (score > 7) {
          pageManager.showPage('9q-honest-result-page');
          assessmentCalculator.display9QResultCombined({ honest: true });
        }
      }
    });

    // การจัดการข้อมูลส่วนบุคคล
    document.getElementById('to-age-page')?.addEventListener('click', () => {
      this.savePersonalInfo();
    });
    document.getElementById('to-gender-page')?.addEventListener('click', () => {
      this.savePersonalInfo();
    });
    document.getElementById('to-occupation-page')?.addEventListener('click', () => {
      this.savePersonalInfo();
    });
    document.getElementById('to-reflection-page')?.addEventListener('click', () => {
      this.savePersonalInfo();
    });

    // การจัดการปุ่มในหน้า 9q-thankyou-page
    document.getElementById('back-to-9q-result')?.addEventListener('click', () => {
      this.showPage('9q-result-page');
    });

    document.getElementById('to-home')?.addEventListener('click', () => {
      this.resetApp();
      this.showPage('welcome-page');
    });
  },

  savePersonalInfo() {
    appState.formData.personalInfo = {
      nickname: document.getElementById('nickname')?.value.trim() || '',
      age: document.getElementById('age')?.value.trim() || '',
      gender: document.getElementById('gender')?.value || '',
      occupation: document.getElementById('occupation')?.value.trim() || ''
    };
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
            appState.formData.assessments.st5[i - 1] = parseInt(btn.dataset.value);
          });
        });
      }
    }

    // คำถาม 2Q
    const twoQCheckboxes = document.querySelectorAll('input[name="twoQ"]');
    const twoQNoneRadio = document.getElementById('2q-none');

    twoQCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          if (!appState.formData.assessments.twoQ.includes(value)) {
            appState.formData.assessments.twoQ.push(value);
          }
          // ถ้าเลือก 2q1 หรือ 2q2 ให้ disable radio "ไม่มีทั้ง 2 ข้อ"
          if (twoQNoneRadio) {
            twoQNoneRadio.checked = false;
            twoQNoneRadio.disabled = true;
          }
        } else {
          appState.formData.assessments.twoQ =
            appState.formData.assessments.twoQ.filter(item => item !== value);
          // ถ้าไม่มี checkbox ใดถูกเลือก ให้ enable radio "ไม่มีทั้ง 2 ข้อ"
          if (
            !Array.from(twoQCheckboxes).some(cb => cb.checked) &&
            twoQNoneRadio
          ) {
            twoQNoneRadio.disabled = false;
          }
        }
      });
    });

    if (twoQNoneRadio) {
      twoQNoneRadio.addEventListener('change', (e) => {
        if (e.target.checked) {
          // uncheck และ disable 2q1, 2q2
          twoQCheckboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = true;
          });
          appState.formData.assessments.twoQ = [];
        } else {
          // enable 2q1, 2q2
          twoQCheckboxes.forEach(cb => {
            cb.disabled = false;
          });
        }
      });
    }

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

    // คำถาม 9Q
    for (let i = 1; i <= 9; i++) {
      const pageId = `9q-page${i}`;
      const questionDiv = document.getElementById(pageId);
      if (questionDiv) {
        const buttons = questionDiv.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            appState.formData.assessments.nineQ[i - 1] = parseInt(btn.dataset.value);
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
    
    if (st5ScoreElement) st5ScoreElement.textContent = score;
    
    // ข้อความสุ่มแบบอบอุ่น
    const warmMessages = [
      `จากคำตอบที่คุณให้มา<br>ดูเหมือนว่าคุณยังสามารถรับมือกับความเครียดได้ดีอยู่<br>แต่ถึงแม้ทุกอย่างดูเหมือนจะโอเค<br>คุณก็ยังมีสิทธิ์เหนื่อย มีสิทธิ์พัก <br>และมีสิทธิ์พูดว่า “ไม่ไหว” ได้เสมอ<br>อย่าลืมดูแลตัวเองเหมือนที่คุณดูแลคนอื่นนะ <br>ถ้าเมื่อไรที่คุณต้องการใครสักคน “เราอยู่ตรงนี้เสมอ”`,
      `หัวใจของคุณดูเหมือนยังมีพลังในการรับมือกับสิ่งต่างๆ <br>และนั่น…ก็น่าชื่นชมมาก<br>แต่เราอยากบอกไว้นิดนึงว่าคนที่ดู “โอเค” <br>ก็มีวันที่เปราะบางได้เหมือนกัน<br>คุณไม่ต้องเข้มแข็งตลอดเวลา <br>แค่ได้ยอมรับความรู้สึกของตัวเองในแต่ละวัน ก็เพียงพอแล้ว`,
      `ตอนนี้คุณอาจยังไม่ต้องไปต่อกับแบบทดสอบถัดไป <br>และนั่นไม่ใช่เพราะคุณไม่สำคัญ — แต่เพราะใจของคุณบอกว่า <br>“ตอนนี้พอแล้ว”<br>ถ้าเมื่อไรคุณอยากกลับมา <br>เราจะรออยู่ตรงนี้พร้อมจะฟังเสมอ <br>ไม่ว่าคุณจะเป็นยังไงในวันนั้นก็ตาม`
    ];

    if (score <= 7) {
      // สุ่มข้อความอบอุ่น
      const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      if (st5MessageElement) st5MessageElement.innerHTML = msg;

      // === เพิ่มบรรทัดนี้ ===
      this.submitResults();
    } else if (score >= 8) {
      if (st5MessageElement) st5MessageElement.innerHTML = '';
    } else {
      if (st5MessageElement) st5MessageElement.textContent = 'คะแนนของคุณอยู่ในระดับปานกลาง ควรสังเกตอาการและพักผ่อนให้เพียงพอ';
    }

    appState.formData.results.st5 = {
      score,
      message: st5MessageElement ? st5MessageElement.textContent : ''
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
        'จากคำตอบของคุณ…ดูเหมือนภายในใจของคุณ<br>กำลังบอกอะไรบางอย่างกับเรา<br>บางที คุณอาจกำลังต้องการให้ใครสักคน <br>“ที่รับฟังอย่างเข้าใจ”<br>แบบประเมินถัดไปจะช่วยให้คุณได้ฟังเสียงภายในใจตัวเองลึกขึ้นอีกนิดไม่ใช่เพื่อหาว่าคุณผิดตรงไหน<br>แต่เพื่อให้คุณได้รู้ว่า…“ความรู้สึกแบบนี้” <br>มีที่ของมันเสมอ และไม่จำเป็นต้องซ่อน',
        'คุณตอบคำถามที่ผ่านมาอย่างกล้าหาญมากและตรงนี้…<br>คืออีกหนึ่งก้าวที่อาจทำให้คุณเข้าใจหัวใจตัวเองมากขึ้น <br>ไม่มีอะไรน่ากลัวในแบบประเมินถัดไป <br>มีแค่ “เรา” ที่จะอยู่ตรงนี้<br>พร้อมฟังคุณทุกคำตอบ <br>โดยไม่ตัดสินเลยแม้แต่นิดเดียว',
        'ถ้าใจคุณกำลังเหนื่อย…<br>แบบประเมินต่อไปนี้ไม่ได้มีไว้ตอกย้ำ<br>แต่มันมีไว้ให้คุณ “แสดงออกมา”เป็นพื้นที่ปลอดภัย <br>เพราะทุกความรู้สึกที่คุณมี มีความหมาย <br>และควรได้รับการรับฟัง <br>ถ้าคุณพร้อม…เราจะก้าวไปด้วยกัน'
      ];
      const msg = honestMessages[Math.floor(Math.random() * honestMessages.length)];
      const honestMsgElem = document.getElementById('2q-honest-message');
      if (honestMsgElem) honestMsgElem.innerHTML = msg;
      pageManager.showPage('2q-honest-result-page');
      return;
    } else if (score === 0) {
      // กรณีคะแนนรวม = 0
      const warmMessages = [
        'จากคำตอบของคุณตอนนี้ยังไม่พบสัญญาณที่เข้าข่ายภาวะซึมเศร้า <br>แต่นั่นไม่ได้แปลว่าคุณต้องรู้สึกดีตลอดเวลา <br>การเผชิญปัญหา และ การจัดการอารมณ์ได้ดี <br>ซึ่งเป็นสิ่งที่ดี ทุกความรู้สึกของคุณมีคุณค่าเสมอ<br>และคุณก็ยังสมควรได้รับการ Heal ใจ <br>… ไม่ว่าคะแนนจะเท่าไร',
        'ดูเหมือนตอนนี้ ใจของคุณยังพอมีแรงพยุงตัวเองอยู่ <br>ขอบคุณที่ดูแลตัวเองได้มาถึงตรงนี้นะ <br>และถ้าเมื่อไรคุณเริ่มรู้สึกว่า “ไม่ไหว” <br>อย่าลืมว่า คุณไม่ต้องรอให้พังก่อนจึงจะขอความช่วยเหลือได้',
        'แบบทดสอบบอกว่า…คุณอาจยังไม่อยู่ในช่วงที่มีภาวะซึมเศร้าชัดเจน <br>แต่แบบทดสอบไม่ได้รู้ว่า เมื่อคืนคุณนอนหลับดีไหม<br>หรือคุณฝืนยิ้มมานานแค่ไหนแล้ว <br>ถ้าคุณยังรู้สึกว่า “ใจมันยังไม่เบา” <br>การพูดคุยกับใครสักคนก็ยังเป็นสิ่งที่ดีเสมอ'
      ];
      const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      if (messageElement) messageElement.innerHTML = msg;
    } else {
      if (messageElement) messageElement.textContent = 'ผลประเมินไม่พบอาการซึมเศร้า';
    }
    
    appState.formData.results.twoQ = {
      hasDepression: twoQ.length === 2,
      message: messageElement ? messageElement.textContent : ''
    };
    
    this.submitResults();
  },
  
  display9QResultCombined({ honest = false } = {}) {
    const score = this.calculate9QScore();
    const scoreElement = document.getElementById(honest ? '9q-honest-score' : '9q-score');
    const messageElement = document.getElementById(honest ? '9q-honest-message' : '9q-message');
    
    if (!scoreElement || !messageElement) return;
    
    let summary = '';
    if (honest) {
      if (score > 7 && score <= 12) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับน้อย';
      } else if (score >= 13 && score <= 18) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับปานกลาง';
      } else if (score >= 19) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับรุนแรง';
      }
      scoreElement.textContent = score + ' คะแนน';
      
      let gentleMessages = [
        'แบบประเมินเมื่อครู่นี้บอกเราว่า…<br> ตอนนี้คุณอาจกำลังเผชิญกับความรู้สึกเศร้าในระดับที่ไม่ง่ายนัก<br>ก่อนที่เราจะไปต่อ เราอยากบอกคุณว่า…<br>ไม่ว่าสิ่งที่คุณรู้สึกจะเข้มข้นแค่ไหน<br>คุณไม่ได้แปลก และคุณไม่ได้อยู่คนเดีย…<br>แบบประเมินถัดไปจะช่วยให้เราเข้าใจว่า สิ่งที่คุณเผชิญ <br>“กระทบกับการใช้ชีวิตประจำวัน” แค่ไหน ถ้าคุณพร้อม <br>เราจะพาคุณไปอย่างค่อยเป็นค่อยไป ด้วยความอ่อนโยนทุกคำถาม',
        'การตัดสินใจของคุณบอกอะไรกับเราไว้หลายอย่างแล้วใน 9Q <br> และคุณทำได้ดีมากที่ตอบมันอย่างจริงใจ <br>ถัดจากนี้คือคำถามอีกชุด ที่จะช่วยให้เราดูแลคุณได้รอบด้านยิ่งขึ้น <br>เพราะบางครั้ง ความเศร้าไม่ได้หยุดแค่ในใจ<br>แต่มันอาจเริ่มกระทบการใช้ชีวิต การนอน การกิน <br>หรือแม้แต่ความรู้สึกปลอดภัยของคุณเอง<br>เราอยากเชิญคุณทำแบบประเมินนี้ด้วยกัน ไม่ใช่เพื่อวิน<br>ฉัยคุณ<br>แต่เพื่อ “อยู่กับคุณ” ตรงนี้ให้ชัดเจนยิ่งกว่าเดิม',
        'บางครั้ง ความรู้สึกที่อยู่ซุกซ่อนอยู่ภายในมันยังคงอยู่ <br>และบั่นทอนอารมณ์ ความรู้สึกเราเงียบๆ<br>แบบประเมินถัดไปอาจแตะบางจุดที่คุณเคยหลบสายตา <br>ถ้ามันรู้สึกหนัก…หยุดพักได้เสมอ ไม่มีใครเร่ง ไม่มีใครบังคับ <br>แต่ถ้าคุณพร้อม…ลองให้โอกาสตัวเองได้ซื่อสัตย์กับ <br>“ความรู้สึกลึก ๆ” ตรงนั้นอีกนิด<br>แล้วเราจะฟังคุณต่อไปอย่างเบาที่สุด'
      ];
      
      let randomMsg = '';
      if (score >= 7) {
        randomMsg = gentleMessages[Math.floor(Math.random() * gentleMessages.length)];
      }
      messageElement.innerHTML = `<b>${summary}</b><br><br>${randomMsg.replace(/\n/g, '<br>')}`;
    } else {
      scoreElement.textContent = score;
      if (score <= 7) {
        messageElement.textContent = 'ไม่มีอาการของภาวะซึมเศร้าหรือมีอาการของภาวะซึมเศร้าระดับน้อยมาก';
      }
    }
    
    appState.formData.results.nineQ = {
      score,
      message: messageElement.textContent
    };
    
    this.submitResults();
  },

  displayFinalResult() {
    pageManager.savePersonalInfo();
    const finalResultElement = document.getElementById('final-result-content');
    const { nickname, age } = appState.formData.personalInfo;
    const st5Score = this.calculateST5Score();
    const nineQScore = this.calculate9QScore();

    if (finalResultElement) {
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
          ${this.get9QMessage(nineQScore)}
        </div>
      `;
    }

    this.submitResults();
  },

  get9QMessage(score) {
    if (score <= 7) {
      return 'ไม่มีอาการของภาวะซึมเศร้าหรือมีอาการของภาวะซึมเศร้าระดับน้อยมาก';
    } else if (score >= 8 && score <= 12) {
      return 'มีอาการของภาวะซึมเศร้า ระดับน้อย';
    } else if (score >= 13 && score <= 18) {
      return 'มีอาการของภาวะซึมเศร้า ระดับปานกลาง';
    } else if (score >= 19) {
      return 'มีอาการของภาวะซึมเศร้า ระดับรุนแรง';
    }
    return '';
  },

  isSubmitting: false,

  async submitResults() {
    try {
      if (this.isSubmitting) return; // ป้องกันซ้ำ
      this.isSubmitting = true;
      
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
    } finally {
      this.isSubmitting = false;
    }
  }
};

// 6. เริ่มต้นแอปพลิเคชัน
function initApp() {
  musicManager.init();
  musicManager.playMusic(); // เล่นเพลงทันทีเมื่อเริ่มต้น
  pageManager.init();

  // แสดงหน้าแรก
  pageManager.showPage('welcome-page');
}

// รันแอปพลิเคชันเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', initApp);

// ===== [Validation] =====
function showNoti(message) {
  let noti = document.getElementById('custom-noti');
  if (!noti) {
    noti = document.createElement('div');
    noti.id = 'custom-noti';
    noti.style.position = 'fixed';
    noti.style.top = '32px';
    noti.style.left = '50%';
    noti.style.transform = 'translateX(-50%)';
    noti.style.background = 'rgba(255, 80, 80, 0.97)';
    noti.style.color = '#fff';
    noti.style.padding = '14px 32px';
    noti.style.borderRadius = '12px';
    noti.style.fontSize = '1.05rem';
    noti.style.fontWeight = '500';
    noti.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
    noti.style.zIndex = '9999';
    noti.style.transition = 'opacity 0.3s';
    noti.style.opacity = '0';
    document.body.appendChild(noti);
  }
  noti.textContent = message;
  noti.style.opacity = '1';
  setTimeout(() => {
    noti.style.opacity = '0';
  }, 1800);
}

function validateCurrentPage(pageId) {
  // Personal Info
  if (pageId === 'personal-info-page') {
    const nickname = document.getElementById('nickname');
    if (!nickname.value.trim()) {
      nickname.focus();
      showNoti('กรุณากรอกชื่อเล่น');
      return false;
    }
  }
  if (pageId === 'age-page') {
    const age = document.getElementById('age');
    if (!age.value.trim()) {
      age.focus();
      showNoti('กรุณากรอกอายุ');
      return false;
    }
  }
  if (pageId === 'gender-page') {
    const gender = document.getElementById('gender');
    if (!gender.value) {
      gender.focus();
      showNoti('กรุณาเลือกเพศ');
      return false;
    }
  }
  if (pageId === 'occupation-page') {
    const occupation = document.getElementById('occupation');
    if (!occupation.value.trim()) {
      occupation.focus();
      showNoti('กรุณากรอกอาชีพหรือหน้าที่');
      return false;
    }
  }
  if (pageId === 'reflection-page') {
    const selected = document.querySelector('.feeling-option.selected');
    if (!selected) {
      showNoti('กรุณาเลือกข้อความที่ตรงกับความรู้สึกของคุณ');
      return false;
    }
  }
  if (pageId === 'feeling-page') {
    const checked = document.querySelectorAll('input[name="feelings"]:checked');
    if (checked.length === 0) {
      showNoti('กรุณาเลือกอย่างน้อย 1 ข้อ');
      return false;
    }
  }
  // ST-5
  for (let i = 1; i <= 5; i++) {
    if (pageId === `st5-page${i}`) {
      const selected = document.querySelector(`#st5-page${i} .option-btn.selected`);
      if (!selected) {
        showNoti('กรุณาเลือกคำตอบ');
        return false;
      }
    }
  }
  // 9Q
  for (let i = 1; i <= 9; i++) {
    if (pageId === `9q-page${i}`) {
      const selected = document.querySelector(`#9q-page${i} .option-btn.selected`);
      if (!selected) {
        showNoti('กรุณาเลือกคำตอบ');
        return false;
      }
    }
  }
  return true;
}

// ===== [Navigation Guard] =====
document.body.addEventListener('click', function (e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.id;
  if (!id) return;
  
  // ตรวจสอบปุ่มที่เป็น next-btn เท่านั้น
  if (btn.classList.contains('next-btn')) {
    // หา page ปัจจุบัน
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    const pageId = currentPage.id;
    if (!validateCurrentPage(pageId)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }
});