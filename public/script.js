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

const DOM = {
  pages: document.querySelectorAll('.page'),
  musicControl: document.getElementById('music-control'),
  bgMusic: document.getElementById('bg-music'),
  musicToggleBtn: document.getElementById('music-toggle-btn'),
};

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

const pageManager = {
  init() {
    this.setupNavigation();
    this.setupQuestionHandlers();
  },

  showPage(pageId) {
    DOM.pages.forEach(page => {
      page.classList.remove('active');
      page.style.display = 'none';
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.display = '';
      appState.currentPage = pageId;

      this.loadPageData(pageId);

      // เพิ่มบรรทัดนี้
      this.setupQuestionHandlers();
    } else {
      console.error(`Page with ID ${pageId} not found`);
    }
  },

  loadPageData(pageId) {
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
      default:
        // Re-attach 9Q option listeners if on a 9Q page
        this.attach9QOptionHandlers(pageId);
        break;
    }
  },

  // --- 9Q Option Button Handler ---
  attach9QOptionHandlers(pageId) {
    if (/^9q-page[1-9]$/.test(pageId)) {
      const questionDiv = document.getElementById(pageId);
      if (questionDiv) {
        const buttons = questionDiv.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
          // Remove previous listeners by cloning
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
        });
        // Attach new listeners
        const newButtons = questionDiv.querySelectorAll('.option-btn');
        newButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            // toggle selection (เลือกซ้ำ = ยกเลิก)
            if (btn.classList.contains('selected')) {
              btn.classList.remove('selected');
              const qNum = parseInt(pageId.replace('9q-page', ''));
              appState.formData.assessments.nineQ[qNum - 1] = null;
            } else {
              newButtons.forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
              const qNum = parseInt(pageId.replace('9q-page', ''));
              appState.formData.assessments.nineQ[qNum - 1] = parseInt(btn.dataset.value);
            }
          });
        });
      }
    }
  },

  setupNavigation() {
    const navMap = {
      'start-btn': 'rama9-page',
      'to-tree-page': 'tree-page',
      'to-personal-info-page': 'personal-info-page',
      'to-age-page': 'age-page',
      'back-to-personal-info': 'personal-info-page',
      'back-to-welcome': 'welcome-page',
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
      'to-onem-page': 'onem-page',
      'back-to-onem-page': 'onem-page',
      'to-contact-info-page': 'contact-info-page',
    };

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

    document.getElementById('back-to-9q-result')?.addEventListener('click', () => {
      this.showPage('9q-result-page');
    });

    document.getElementById('to-home')?.addEventListener('click', () => {
      this.resetApp();
      this.showPage('welcome-page');
    });

    document.body.addEventListener('click', function(e) {
      if (e.target.closest('#restart-assessment-fab') || e.target.closest('#restart-assessment-fab-2') || e.target.closest('#restart-assessment-fab-3')) {
        pageManager.resetApp();
        pageManager.showPage('welcome-page');
      }
    });

    document.getElementById('to-before2-page').addEventListener('click', function() {
      showPage('before2-page');
    });
    document.getElementById('back-to-occupation-page').addEventListener('click', function() {
      showPage('occupation-page');
    });
    document.getElementById('to-reflection-page').addEventListener('click', function() {
      showPage('reflection-page');
    });
    document.getElementById('back-to-before-page').addEventListener('click', function() {
      showPage('before-page');
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

    const twoQCheckboxes = document.querySelectorAll('input[name="twoQ"]');
    const twoQNoneCheckbox = document.getElementById('2q-none');

    twoQCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          if (!appState.formData.assessments.twoQ.includes(value)) {
            appState.formData.assessments.twoQ.push(value);
          }
          if (twoQNoneCheckbox) {
            twoQNoneCheckbox.checked = false;
          }
        } else {
          appState.formData.assessments.twoQ =
            appState.formData.assessments.twoQ.filter(item => item !== value);
        }
      });
    });

    if (twoQNoneCheckbox) {
      twoQNoneCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          twoQCheckboxes.forEach(cb => {
            cb.checked = false;
          });
          appState.formData.assessments.twoQ = [];
        }
      });
    }

    // --- Feeling Option (Reflection Page) ---
    // ลบ event listener เก่าทั้งหมดก่อน
    document.querySelectorAll('.feeling-option').forEach(option => {
      const newOption = option.cloneNode(true);
      option.parentNode.replaceChild(newOption, option);
    });
    // ผูก event listener ใหม่
    document.querySelectorAll('.feeling-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.feeling-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
        appState.formData.reflection.selectedOption = option.dataset.value;
      });
    });
  },

  resetApp() {
    document.getElementById('nickname').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('occupation').value = '';

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

const assessmentCalculator = {
  calculateST5Score() {
    return appState.formData.assessments.st5.reduce((sum, value) => sum + (value || 0), 0);
  },

  calculate9QScore() {
    return appState.formData.assessments.nineQ.reduce((sum, value) => sum + (value || 0), 0);
  },

  displayST5Result() {
    const score = this.calculateST5Score();
    const st5ScoreElement = document.getElementById('st5-honest-score');
    const st5MessageElement = document.getElementById('st5-message');
    if (st5ScoreElement) st5ScoreElement.textContent = score + ' คะแนน';

    const warmMessages = [
      `จากคำตอบที่คุณให้มาดูเหมือนว่าคุณยังสามารถรับมือกับความเครียดได้ดีอยู่<br>แต่ถึงแม้ทุกอย่างดูเหมือนจะโอเคคุณก็ยังมีสิทธิ์เหนื่อย มีสิทธิ์พัก และมีสิทธิ์พูดว่า “ไม่ไหว” ได้เสมอ<br>อย่าลืมดูแลตัวเองเหมือนที่คุณดูแลคนอื่นนะ<br>ถ้าเมื่อไรที่คุณต้องการใครสักคน “เราอยู่ตรงนี้เสมอ”`,
      `หัวใจของคุณดูเหมือนยังมีพลังในการรับมือกับสิ่งต่าง ๆ และนั่น…ก็น่าชื่นชมมาก<br>แต่เราอยากบอกไว้นิดนึงว่าคนที่ดู “โอเค” ก็มีวันที่เปราะบางได้เหมือนกัน<br>คุณไม่ต้องเข้มแข็งตลอดเวลา<br>แค่ได้ยอมรับความรู้สึกของตัวเองในแต่ละวัน ก็เพียงพอแล้ว`,
      `ตอนนี้คุณอาจยังไม่ต้องไปต่อกับแบบทดสอบถัดไป<br>และนั่นไม่ใช่เพราะคุณไม่สำคัญ — แต่เพราะใจของคุณบอกว่า “ตอนนี้พอแล้ว”<br>ถ้าเมื่อไรคุณอยากกลับมา เราจะรออยู่ตรงนี้ พร้อมจะฟังเสมอ<br>ไม่ว่าคุณจะเป็นยังไงในวันนั้นก็ตาม`
    ];

    if (score <= 7) {
      const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      if (st5MessageElement) st5MessageElement.innerHTML = msg;
      this.submitResults();
      return;
    } else if (score >= 8) {
      // Show st5-honest-result page and display score
      const st5HonestScoreElem = document.getElementById('st5-score');
      if (st5HonestScoreElem) st5HonestScoreElem.textContent = score + ' คะแนน';
      pageManager.showPage('st5-honest-result');
      this.submitResults();
      return;
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
      const honestMessages = [
        'จากคำตอบของคุณ…ดูเหมือนภายในใจของคุณ<br>กำลังบอกอะไรบางอย่างกับเรา<br>บางที คุณอาจกำลังต้องการให้ใครสักคน <br>“ที่รับฟังอย่างเข้าใจ”<br>แบบประเมินถัดไปจะช่วยให้คุณได้ฟังเสียงภายในใจตัวเอง<br>ลึกขึ้นอีกนิดไม่ใช่เพื่อหาว่าคุณผิดตรงไหน<br>แต่เพื่อให้คุณได้รู้ว่า…“ความรู้สึกแบบนี้” <br>มีที่ของมันเสมอ และไม่จำเป็นต้องซ่อน',
        'คุณตอบคำถามที่ผ่านมาอย่างกล้าหาญมากและตรงนี้…<br>คืออีกหนึ่งก้าวที่อาจทำให้คุณเข้าใจ หัวใจ ตัวเองมากขึ้น <br>ไม่มีอะไรน่ากลัวในแบบประเมินถัดไป <br>มีแค่ “เรา” ที่จะอยู่ตรงนี้<br>พร้อมฟังคุณทุกคำตอบ <br>โดยไม่ตัดสินเลย แม้แต่นิดเดียว',
        'ถ้าใจคุณกำลังเหนื่อย…<br>แบบประเมินต่อไปนี้ไม่ได้มีไว้ตอกย้ำ<br>แต่มันมีไว้ให้คุณ“แสดงออกมา”เป็นพื้นที่ปลอดภัย <br>เพราะทุกความรู้สึกที่คุณมี มีความหมาย <br>และควรได้รับการรับฟัง <br>ถ้าคุณพร้อม… เราจะก้าวไปด้วยกัน'
      ];
      const msg = honestMessages[Math.floor(Math.random() * honestMessages.length)];
      const honestMsgElem = document.getElementById('2q-honest-message');
      if (honestMsgElem) honestMsgElem.innerHTML = msg;
      pageManager.showPage('2q-honest-result-page');
      return;
    } else if (score === 0) {
      const warmMessages = [
        'จากคำตอบของคุณตอนนี้ยังไม่พบ<br>สัญญาณที่เข้าข่ายภาวะซึมเศร้า <br>แต่นั่นไม่ได้แปลว่าคุณต้องรู้สึกดีตลอดเวลา <br>การเผชิญปัญหา และ การจัดการอารมณ์ได้ดี <br>ซึ่งเป็นสิ่งที่ดี ทุกความรู้สึกของคุณมีค่าเสมอ<br>และคุณก็ยังสมควรได้รับการ Heal ใจ <br>… ไม่ว่าคะแนนจะเท่าไร',
        'ดูเหมือนตอนนี้ <br>ใจของคุณยังพอมีแรงพยุงตัวเองอยู่ <br>ขอบคุณที่ดูแลตัวเองได้มาถึงตรงนี้นะ <br>และถ้าเมื่อไรคุณเริ่มรู้สึกว่า “ไม่ไหว” <br>อย่าลืมว่า คุณไม่ต้องรอให้พังก่อนจึงจะขอความช่วยเหลือได้',
        'แบบทดสอบบอกว่า…<br>คุณอาจยังไม่อยู่ในช่วงที่มีภาวะซึมเศร้าชัดเจน <br>แต่แบบทดสอบไม่ได้รู้ว่า เมื่อคืนคุณนอนหลับดีไหม<br>หรือคุณฝืนยิ้มมานานแค่ไหนแล้ว <br>ถ้าคุณยังรู้สึกว่า “ใจมันยังไม่เบา” <br>การพูดคุยกับใครสักคนก็ยังเป็นสิ่งที่ดีเสมอ'
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
    
    if (!scoreElement || !messageElement) {
      console.error('9Q result element not found:', honest ? '9q-honest-score/message' : '9q-score/message');
      return;
    }
    let summary = '';
    if (honest) {
      if (score > 7 && score <= 12) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับน้อย';
      } else if (score >= 13 && score <= 18) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับปานกลาง';
      } else if (score >= 19) {
        summary = 'มีอาการของภาวะซึมเศร้า ระดับรุนแรง';
      } else {
        summary = 'ไม่มีอาการของภาวะซึมเศร้าหรือมีอาการของภาวะซึมเศร้าระดับน้อยมาก';
      }
      scoreElement.textContent = score + ' คะแนน';
      let gentleMessages = [
        '<span class="gentle-message-small">ถ้าคุณรู้สึกมาถึงจุดนี้แล้ว <br>เราอยากแนะนำว่าสิ่งที่คุณกำลังเผชิญอยู่<br>อาจเป็นเรื่องที่ยากเกินกว่าที่จะจัดการเพียงลำพัง<br> การพบผู้เชี่ยวชาญจะช่วยให้คุณได้รับการดูแลและแนวทางที่เหมาะสม<br> เพื่อฟื้นฟูใจอย่างถูกต้องและอ่อนโยน</span>',
      ];
      let randomMsg = '';
      if (score > 7) {
        randomMsg = gentleMessages[Math.floor(Math.random() * gentleMessages.length)];
      }
      messageElement.innerHTML = `<b>${summary}</b><br><br><span class="gentle-message-small">${randomMsg.replace(/\n/g, '<br>')}</span>`;
    } else {
      // ถ้า score > 7 ให้ไปหน้า honest
      if (score > 7) {
        pageManager.showPage('9q-honest-result-page');
        return;
      }
      scoreElement.textContent = score;
      if (score <= 7) {
        messageElement.textContent = 'ไม่มีอาการของภาวะซึมเศร้าหรือมีอาการของภาวะซึมเศร้าระดับน้อยมาก';
      } else if (score > 7 && score <= 12) {
        messageElement.textContent = 'มีอาการของภาวะซึมเศร้า ระดับน้อย';
      } else if (score >= 13 && score <= 18) {
        messageElement.textContent = 'มีอาการของภาวะซึมเศร้า ระดับปานกลาง';
      } else if (score >= 19) {
        messageElement.textContent = 'มีอาการของภาวะซึมเศร้า ระดับรุนแรง';
      }
    }
    appState.formData.results.nineQ = {
      score,
      message: messageElement.textContent || messageElement.innerHTML
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
        <div class="result-section final-result-section" style="max-width: 420px; margin: 0 auto; padding: 12px 6px; box-sizing: border-box; word-break: break-word; font-size: 0.98rem;">
          <h3 style="font-size: 1.02rem; margin-bottom: 8px;">ข้อมูลส่วนตัว</h3>
          <b>ชื่อ:</b> <span style="word-break: break-all;">${nickname ? nickname : 'ไม่ได้ระบุ'}</span><br>
          <b>อายุ:</b> <span style="word-break: break-all;">${age ? age : 'ไม่ได้ระบุ'}</span>
        </div>
        <div class="result-section final-result-section" style="max-width: 420px; margin: 0 auto; padding: 12px 6px; box-sizing: border-box; word-break: break-word; font-size: 0.98rem;">
          <h3 style="font-size: 1.02rem; margin-bottom: 8px;">ผลการประเมิน ST-5</h3>
          <b>คะแนน:</b> <span style="word-break: break-all;">${st5Score}</span>
        </div>
        <div class="result-section final-result-section" style="max-width: 420px; margin: 0 auto; padding: 12px 6px; box-sizing: border-box; word-break: break-word; font-size: 0.98rem;">
          <h3 style="font-size: 1.02rem; margin-bottom: 8px;">ผลการประเมิน 9Q</h3>
          <b>คะแนน:</b> <span style="word-break: break-all;">${nineQScore}</span><br>
          <div style="font-size: 0.95rem; word-break: break-word;">${this.get9QMessage(nineQScore)}</div>
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
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      
      const submissionData = {
        personalInfo: appState.formData.personalInfo,
        results: {
          ...appState.formData.results,
          timestamp: new Date().toISOString()
        }
      };
      
      if (appState.formData._id) {
        submissionData._id = appState.formData._id;
      }

      const response = await fetch('https://general-health-questionnaire-hcu.onrender.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
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

function initApp() {
  musicManager.init();
  musicManager.playMusic();
  pageManager.init();

  // เปลี่ยนหน้าแรกเป็น Frist-page แทน intro-page
  pageManager.showPage('Frist-page');
}

document.addEventListener('DOMContentLoaded', function() {
  initApp();

  // เพิ่ม event สำหรับปุ่มเริ่มทำแบบทดสอบ
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      musicManager.playMusic();
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  initApp();

  // Navigation for all .next-btn and .prev-btn
  document.body.addEventListener('click', function(e) {
    // NEXT BUTTONS
    const nextBtn = e.target.closest('button.next-btn');
    if (nextBtn) {
      const id = nextBtn.id;
      if (!id) return;

      // Validation for required fields before navigation
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        const pageId = currentPage.id;
        // ปิด validation ชั่วคราวเพื่อให้กดถัดไปได้ทุกหน้า
        // if (!validateCurrentPage(pageId)) {
        //   e.preventDefault();
        //   e.stopImmediatePropagation();
        //   return false;
        // }
      }

      // Special case for start-btn (play music and go to rama9-page)
      if (id === 'start-btn') {
        if (window.musicManager && typeof musicManager.playMusic === 'function') {
          musicManager.playMusic();
        }
        if (window.pageManager && typeof pageManager.showPage === 'function') {
          pageManager.showPage('rama9-page');
        }
        return;
      }

      // Special case for Frist-page next button
      if (id === 'to-intro-page') {
        if (window.pageManager && typeof pageManager.showPage === 'function') {
          pageManager.showPage('intro-page');
        }
        return;
      }

      // Use navMap for all other next-btns
      if (window.pageManager && typeof pageManager.showPage === 'function') {
        const navMap = pageManager?.navMap || {
          // fallback navMap (ควรมี to-welcome-page ด้วย)
          'to-welcome-page': 'welcome-page',
          'to-tree-page': 'tree-page',
          'to-personal-info-page': 'personal-info-page',
          'to-age-page': 'age-page',
          'to-gender-page': 'gender-page',
          'to-occupation-page': 'occupation-page',
          'to-before-page': 'before-page',
          'to-before2-page': 'before2-page',
          'to-reflection-page': 'reflection-page',
          'to-feeling-page': 'feeling-page',
          'to-onem-page': 'onem-page',
          'to-st5-page1': 'st5-page1',
          'to-st5-page2': 'st5-page2',
          'to-st5-page3': 'st5-page3',
          'to-st5-page4': 'st5-page4',
          'to-st5-page5': 'st5-page5',
          'to-st5-result-page': 'st5-result-page',
          'to-st5-special-result': 'st5-special-result',
          'to-thanks-page': 'thanks-page',
          'to-st5-honest-result': 'st5-honest-result',
          'to-st5-special-result-2': 'st5-special-result-2',
          'to-2q-page': '2q-page',
          'to-2q-result-page': '2q-result-page',
          'to-thanks-page-2': 'thanks-page-2',
          'to-2q-honest-result-page': '2q-honest-result-page',
          'to-2q-special-result-page': '2q-special-result-page',
          'to-9q-page1': '9q-page1',
          'to-9q-page2': '9q-page2',
          'to-9q-page3': '9q-page3',
          'to-9q-page4': '9q-page4',
          'to-9q-page5': '9q-page5',
          'to-9q-page6': '9q-page6',
          'to-9q-page7': '9q-page7',
          'to-9q-page8': '9q-page8',
          'to-9q-page9': '9q-page9',
          'to-9q-result-page': '9q-result-page',
          'to-9q-thankyou-page': '9q-thankyou-page',
          'to-honest-9q-result': '9q-honest-result-page',
          'to-9q-special-result-page': '9q-special-result-page',
          'to-final-result-page': 'final-result-page',
          'to-contact-info-page': 'contact-info-page',
          'restart-assessment': 'welcome-page',
          'back-to-final-result-page': 'final-result-page',
        };
        if (navMap[id]) {
          pageManager.showPage(navMap[id]);
        }
      }
      return;
    }

    // PREV BUTTONS
    const prevBtn = e.target.closest('button.prev-btn');
    if (prevBtn) {
      const id = prevBtn.id;
      if (!id) return;

      // Use prevNavMap for all prev-btns
      const prevNavMap = {
        // Personal info flow
        'back-to-welcome': 'welcome-page',
        'back-to-personal-info': 'personal-info-page',
        'back-to-age-page': 'age-page',
        'back-to-gender-page': 'gender-page',
        'back-to-occupation-page': 'occupation-page',
        // Before/Reflection/Feeling
        'back-to-before-page': 'before-page',
        'back-to-reflection-page': 'reflection-page',
        'back-to-feeling-page': 'feeling-page',
        // ST5
        'back-to-onem-page': 'onem-page',
        'back-to-st5-page1': 'st5-page1',
        'back-to-st5-page2': 'st5-page2',
        'back-to-st5-page3': 'st5-page3',
        'back-to-st5-page4': 'st5-page4',
        'back-to-st5-page5': 'st5-page5',
        'back-to-st5-result-page': 'st5-result-page',
        'back-to-st5-honest-result': 'st5-honest-result',
        // ST5 special
        'back-to-st5-special-result': 'st5-result-page',
        'back-to-st5-special-result-2': 'st5-honest-result',
        // 2Q
        'back-to-2q-page': '2q-page',
        'back-to-2q-result-page': '2q-result-page',
        'back-to-2q-honest-result-page': '2q-honest-result-page',
        'back-to-2q-special-result-page': '2q-honest-result-page',
        // 9Q
        'back-to-2q-special-result-page': '2q-special-result-page',
        'back-to-9q-page1': '9q-page1',
        'back-to-9q-page2': '9q-page2',
        'back-to-9q-page3': '9q-page3',
        'back-to-9q-page4': '9q-page4',
        'back-to-9q-page5': '9q-page5',
        'back-to-9q-page6': '9q-page6',
        'back-to-9q-page7': '9q-page7',
        'back-to-9q-page8': '9q-page8',
        'back-to-9q-page9': '9q-page9',
        'back-to-9q-result': '9q-result-page',
        'back-to-9q-honest-result-page': '9q-page9',
        'back-to-9q-special-result-page': '9q-honest-result-page',
        'back-to-previous-result': 'final-result-page',
        // Thanks/Restart
        'back-to-thanks-page': 'thanks-page',
        'back-to-thanks-page-2': 'thanks-page-2',
        'back-to-rama9-page': 'rama9-page',
        'back-to-final-result-page': 'final-result-page',
      };
      if (prevNavMap[id]) {
        if (window.pageManager && typeof pageManager.showPage === 'function') {
          pageManager.showPage(prevNavMap[id]);
        }
      }
    }
  });
});

document.getElementById('start-btn')?.addEventListener('click', function() {
  if (window.musicManager && typeof musicManager.playMusic === 'function') {
    musicManager.playMusic();
  }
  if (window.pageManager && typeof pageManager.showPage === 'function') {
    pageManager.showPage('rama9-page');
  }
});

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
    // ไม่ต้อง validate อะไรแล้ว ให้ผ่านได้เสมอ
    return true;
  }
  if (pageId === 'feeling-page') {
    const checked = document.querySelectorAll('input[name="feelings"]:checked');
    if (checked.length === 0) {
      showNoti('กรุณาเลือกอย่างน้อย 1 ข้อ');
      return false;
    }
  }
  for (let i = 1; i <= 5; i++) {
    if (pageId === `st5-page${i}`) {
      const selected = document.querySelector(`#st5-page${i} .option-btn.selected`);
      if (!selected) {
        showNoti('กรุณาเลือกคำตอบ');
        return false;
      }
    }
  }
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

// --- Restart Assessment FAB (ทำแบบประเมินใหม่) ---
function handleRestartAssessment() {
  if (window.pageManager && typeof pageManager.resetApp === 'function') {
    pageManager.resetApp();
  }
  if (window.pageManager && typeof pageManager.showPage === 'function') {
    pageManager.showPage('welcome-page');
  }
}

// Attach event listener for all restart assessment buttons (by class or id)
document.body.addEventListener('click', function(e) {
  // Support both id and class for flexibility
  if (
    e.target.closest('#restart-assessment-fab') ||
    e.target.closest('#restart-assessment-fab-2') ||
    e.target.closest('#restart-assessment-fab-3') ||
    e.target.closest('.restart-assessment-fab')
  ) {
    handleRestartAssessment();
  }
});

document.body.addEventListener('click', function (e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.id;
  if (!id) return;

  if (btn.classList.contains('next-btn')) {
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    const pageId = currentPage.id;
    if (["personal-info-page","age-page","gender-page","occupation-page"].includes(pageId)) {
      if (window.pageManager && typeof pageManager.savePersonalInfo === 'function') {
        pageManager.savePersonalInfo();
      }
    }
    // --- FIX: allow next for 9Q pages if any .option-btn.selected exists ---
    if (/^9q-page[1-9]$/.test(pageId)) {
      const selected = currentPage.querySelector('.option-btn.selected');
      if (!selected) {
        showNoti('กรุณากรอกคำตอบ');
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
      // go to next page (simulate navigation)
      const navMap = {
        'to-9q-page2': '9q-page2',
        'to-9q-page3': '9q-page3',
        'to-9q-page4': '9q-page4',
        'to-9q-page5': '9q-page5',
        'to-9q-page6': '9q-page6',
        'to-9q-page7': '9q-page7',
        'to-9q-page8': '9q-page8',
        'to-9q-page9': '9q-page9',
        'to-9q-result-page': '9q-result-page',
      };
      if (navMap[id]) {
        if (window.pageManager && typeof pageManager.showPage === 'function') {
          pageManager.showPage(navMap[id]);
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    }
    // --- END FIX ---
    if (!validateCurrentPage(pageId)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
    page.style.display = 'none';
  });
  var next = document.getElementById(pageId);
  if (next) {
    next.classList.add('active');
    next.style.display = '';
  }
}

// ให้เพลงเล่นเมื่อผู้ใช้มีการโต้ตอบครั้งแรก
(function enableMusicOnUserInteraction() {
  function playMusicOnce() {
    if (DOM.bgMusic && DOM.bgMusic.paused) {
      DOM.bgMusic.play().catch(() => {});
      appState.music.isPlaying = true;
      DOM.musicControl.innerHTML = '<i class="fas fa-pause"></i>';
    }
    document.removeEventListener('click', playMusicOnce);
    document.removeEventListener('touchstart', playMusicOnce);
  }
  document.addEventListener('click', playMusicOnce);
  document.addEventListener('touchstart', playMusicOnce);
})();

window.pageManager = pageManager;