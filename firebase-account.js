/* Google account UI + strict Firestore persistence.
   The Firebase WEB apiKey is public project configuration, not a Gemini key.
   Keep this file compatible with static GitHub Pages and other AAKASH pages. */
(() => {
  'use strict';

  // Exact existing Firebase project values. Never replace with a default database.
  const firebaseConfig = {
    apiKey: "AIzaSyB2M8rFSHGlke4uS1qLvh_CTpF8yxp8HQY",
    authDomain: "gen-lang-client-0580718541.firebaseapp.com",
    projectId: "gen-lang-client-0580718541",
    storageBucket: "gen-lang-client-0580718541.firebasestorage.app",
    messagingSenderId: "714373498331",
    appId: "1:714373498331:web:9ca598d4603eda9c9553fe"
  };
  const FIRESTORE_DATABASE_ID =
    "ai-studio-aakasheceembedde-cbb0adda-8b7b-403c-a84c-887e93610453";
  const schema = window.AakashCloudSchema;
  if (!schema) {
    console.error('Cloud record validator did not load. No Firestore writes will be attempted.');
    return;
  }

  let auth, db, fs, au, googleProvider, initialization, unsubscribeAuth;
  let signedInUser = null;
  let profileReady = null;
  let profileError = null;
  let sessionVersion = 0;

  const assetBase = new URL('.', document.currentScript.src);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = new URL('firebase-account.css?v=20261120-profile1', assetBase);
  document.head.appendChild(sheet);

  const panel = document.createElement('dialog');
  panel.className = 'account-panel';
  panel.setAttribute('aria-labelledby', 'cloud-account-title');
  const heading = document.createElement('h2');
  heading.id = 'cloud-account-title';
  heading.textContent = 'Your account';
  const intro = document.createElement('p');
  intro.className = 'account-intro';
  intro.textContent = 'Sign in to keep your test history and question bookmarks across devices.';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'account-close';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close account');
  close.addEventListener('click', () => panel.close());

  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'account-launcher';
  launch.setAttribute('aria-haspopup', 'dialog');
  launch.setAttribute('aria-label', 'Open Google account');
  const avatar = document.createElement('span');
  avatar.className = 'account-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'A';
  const headerLabel = document.createElement('span');
  headerLabel.className = 'account-header-name';
  headerLabel.textContent = 'Account';
  launch.append(avatar, headerLabel);
  launch.addEventListener('click', () => {
    if (!panel.open) panel.showModal();
    prepareSignIn();
  });
  panel.addEventListener('close', () => launch.focus());

  const target = document.querySelector('.top-links, .header-actions, #main-navigation');
  if (target) target.append(launch);
  else {
    const row = document.createElement('div');
    row.className = 'account-fallback';
    row.append(launch);
    document.body.prepend(row);
  }

  const login = document.createElement('button');
  login.className = 'account-login';
  login.type = 'button';
  login.textContent = 'Continue with Google';
  const bookmark = document.createElement('button');
  bookmark.className = 'account-bookmark';
  bookmark.type = 'button';
  bookmark.textContent = 'Save current question';
  bookmark.hidden = true;
  const saved = document.createElement('button');
  saved.type = 'button';
  saved.textContent = 'My saved data';
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  panel.append(close, heading, intro, login, bookmark, saved, status);
  document.body.appendChild(panel);

  const diagnostics = document.createElement('div');
  diagnostics.className = 'account-diagnostics';
  diagnostics.hidden = true;
  const hint = document.createElement('p');
  const consoleLink = document.createElement('a');
  consoleLink.href = 'https://console.firebase.google.com/';
  consoleLink.target = '_blank';
  consoleLink.rel = 'noopener noreferrer';
  consoleLink.textContent = 'Open Firebase Console';
  diagnostics.append(hint, consoleLink);
  panel.append(diagnostics);

  const message = (text) => { status.textContent = text; };
  const clearDiagnostic = () => { diagnostics.hidden = true; hint.textContent = ''; };
  const friendlyError = (error) => {
    const code = String(error?.code || error?.message || 'unknown-error');
    const details = {
      'auth/popup-blocked': 'Google login popup was blocked. Allow popups for this website and try again.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/cancelled-popup-request': 'Another Google login popup is already open.',
      'auth/unauthorized-domain': 'Google sign-in is blocked by Firebase: aakash9972sn.github.io is not an authorized domain.',
      'auth/operation-not-allowed': 'Google sign-in is disabled in Firebase Authentication.',
      'auth/network-request-failed': 'Could not contact Google sign-in. Check your connection or extensions.',
      'auth/initialization-timeout': 'Firebase sign-in initialization timed out. Retry.',
      'permission-denied': 'Firestore security rules denied this operation. Your local data is unchanged.',
      'firestore/permission-denied': 'Firestore security rules denied this operation. Your local data is unchanged.',
      'unavailable': 'Firestore is temporarily unavailable. Your local data is unchanged.'
    };
    const text = (details[code] || 'Account operation failed. Your local data is safe.') +
      ' (' + code.slice(0, 80) + ')';
    message(text);
    if (['auth/unauthorized-domain', 'auth/operation-not-allowed'].includes(code)) {
      diagnostics.hidden = false;
      hint.textContent = code === 'auth/unauthorized-domain'
        ? 'Project owner action: Firebase Console → Authentication → Settings → Authorized domains → add aakash9972sn.github.io (no https:// or /newTest/).'
        : 'Project owner action: Firebase Console → Authentication → Sign-in method → enable Google.';
    } else clearDiagnostic();
    return text;
  };

  function profileLabel(user) {
    return schema.displayName(user);
  }
  function setProfile(user) {
    avatar.replaceChildren();
    if (user) {
      const name = profileLabel(user);
      headerLabel.textContent = name;
      launch.title = 'Signed in as ' + name;
      launch.setAttribute('aria-label', 'Open account for ' + name);
      heading.textContent = name;
      login.textContent = 'Sign out';
      bookmark.hidden = false;
      let photo;
      try {
        if (typeof user.photoURL === 'string') {
          const u = new URL(user.photoURL);
          if (u.protocol === 'https:') photo = u.href;
        }
      } catch (_) { /* use an initial for invalid photo URLs */ }
      if (photo) {
        const img = document.createElement('img');
        img.src = photo;
        img.alt = '';
        img.referrerPolicy = 'no-referrer';
        img.addEventListener('error', () => {
          avatar.textContent = Array.from(name)[0]?.toUpperCase() || 'A';
        }, { once: true });
        avatar.append(img);
      } else avatar.textContent = Array.from(name)[0]?.toUpperCase() || 'A';
    } else {
      headerLabel.textContent = 'Account';
      launch.title = 'Continue with Google';
      launch.setAttribute('aria-label', 'Open Google account');
      avatar.textContent = 'A';
      heading.textContent = 'Your account';
      login.textContent = 'Continue with Google';
      bookmark.hidden = true;
    }
  }

  // Parent exists BEFORE any subcollection writes. Never merge a create payload
  // into an existing document: that would violate strict create/update rules.
  async function ensureUserDocument(user) {
    if (!user.emailVerified) throw new Error('Google email must be verified for cloud saving.');
    const ref = fs.doc(db, 'users', user.uid);
    let snap = await fs.getDoc(ref);
    if (!snap.exists()) {
      try {
        await fs.setDoc(ref, schema.userCreate(user, () => fs.serverTimestamp()));
      } catch (error) {
        snap = await fs.getDoc(ref).catch(() => null);
        if (!snap?.exists()) throw error;
      }
    } else {
      const data = snap.data();
      if (data.uid !== user.uid || !data.createdAt)
        throw new Error('Existing account needs Firebase administrator schema migration.');
      const patch = {};
      if (typeof data.displayName !== 'string' || !data.displayName.trim())
        patch.displayName = schema.displayName(user);
      if (!['NEET UG','GATE ECE','Both'].includes(data.targetExam))
        patch.targetExam = 'Both';
      if (!Number.isInteger(data.bestGuessScore) || data.bestGuessScore < 0 || data.bestGuessScore > 1000)
        patch.bestGuessScore = 0;
      if (Object.keys(patch).length)
        await fs.updateDoc(ref, { ...patch, updatedAt: fs.serverTimestamp() });
    }
    return true;
  }

  function onSignedIn(user) {
    const version = ++sessionVersion;
    signedInUser = user;
    profileError = null;
    setProfile(user);
    clearDiagnostic();
    if (!user) {
      profileReady = null;
      message('Progress stays on this device until you sign in.');
      return;
    }
    if (!user.emailVerified) {
      profileReady = Promise.resolve(false);
      profileError = new Error('Google account email is not verified.');
      message(profileError.message);
      return;
    }
    message('Signed in. Connecting your private cloud records…');
    profileReady = ensureUserDocument(user).then(() => {
      if (version !== sessionVersion) return false;
      message('Signed in as ' + profileLabel(user) + '. Cloud saving is ready.');
      return true;
    }).catch((error) => {
      if (version !== sessionVersion) return false;
      profileError = error;
      message('Signed in, but cloud saving is unavailable: ' +
        (error?.code || error?.message || 'unknown error'));
      return false;
    });
  }

  async function init() {
    if (initialization) return initialization;
    initialization = (async () => {
      const prefix = 'https://www.gstatic.com/firebasejs/11.10.0/';
      const [app, a, f] = await Promise.all([
        import(prefix + 'firebase-app.js'),
        import(prefix + 'firebase-auth.js'),
        import(prefix + 'firebase-firestore.js')
      ]);
      au = a; fs = f;
      const instance = app.getApps().find(x => x.name === '[DEFAULT]') ||
        app.initializeApp(firebaseConfig);
      auth = a.getAuth(instance);
      // The SECOND argument is critical: this is a named Firestore database.
      db = f.getFirestore(instance, FIRESTORE_DATABASE_ID);
      googleProvider = new a.GoogleAuthProvider();
      await new Promise((resolve, reject) => {
        let completed = false;
        const timer = setTimeout(() => {
          if (!completed) { completed = true; reject(new Error('auth/initialization-timeout')); }
        }, 16000);
        try {
          unsubscribeAuth = a.onAuthStateChanged(auth, user => {
            onSignedIn(user);
            if (!completed) { completed = true; clearTimeout(timer); resolve(); }
          }, error => {
            if (!completed) { completed = true; clearTimeout(timer); reject(error); }
            friendlyError(error);
          });
        } catch (error) { clearTimeout(timer); reject(error); }
      });
    })().catch(error => { initialization = null; throw error; });
    return initialization;
  }

  async function prepareSignIn() {
    clearDiagnostic();
    login.disabled = true;
    login.textContent = 'Preparing secure sign-in…';
    try {
      await init();
      login.disabled = false;
      login.textContent = auth.currentUser ? 'Sign out' : 'Continue with Google';
    } catch (error) {
      login.disabled = false;
      login.textContent = 'Retry Google sign-in setup';
      friendlyError(error);
    }
  }

  async function readyUser() {
    if (!auth?.currentUser || !signedInUser ||
        signedInUser.uid !== auth.currentUser.uid) throw new Error('Sign in with Google first.');
    if (!signedInUser.emailVerified) throw new Error('A verified Google account is required.');
    if (!profileReady || !(await profileReady)) throw profileError ||
      new Error('Your cloud account is not ready. Check Firebase security rules.');
    if (auth.currentUser?.uid !== signedInUser.uid)
      throw new Error('Google session changed. Please sign in again.');
    return signedInUser;
  }

  async function createRecord(collection, recordId, data) {
    const user = await readyUser();
    if (!['testAttempts','bookmarks','orders'].includes(collection))
      throw new Error('Unsupported cloud collection.');
    const id = String(recordId || '').replaceAll('/', '_').slice(0,180);
    if (!id || id === '.' || id === '..') throw new Error('Invalid record identifier.');
    const payload = collection === 'testAttempts'
      ? schema.testAttempt(user, data, () => fs.serverTimestamp())
      : collection === 'bookmarks'
        ? schema.bookmark(user, data, () => fs.serverTimestamp())
        : schema.order(user, data, () => fs.serverTimestamp());
    const ref = fs.doc(db, 'users', user.uid, collection, id);
    // These collections allow LIST + CREATE, but no UPDATE. A collection list
    // avoids relying on separate per-document GET permissions in strict rules.
    const listed = await fs.getDocs(fs.collection(db,'users',user.uid,collection));
    if (listed.docs.some(doc => doc.id === id)) return true;
    await fs.setDoc(ref, payload);  // CREATE only; no merge or extra fields.
    return true;
  }

  const api = {
    async save(collection, id, data) {
      if (!auth?.currentUser) return false;
      try {
        const result = await createRecord(collection,id,data);
        message('Saved to your Google account.');
        return result;
      } catch (error) {
        friendlyError(error);
        return false;
      }
    },
    async list(collection) {
      try {
        const user = await readyUser();
        if (!['testAttempts','bookmarks','orders'].includes(collection)) return [];
        const snapshot = await fs.getDocs(fs.collection(db,'users',user.uid,collection));
        return snapshot.docs.map(d => ({id:d.id,...d.data()}));
      } catch (error) {
        friendlyError(error);
        return [];
      }
    },
    async remove(collection,id) {
      if (!['testAttempts','bookmarks'].includes(collection)) return false;
      try {
        const user = await readyUser();
        await fs.deleteDoc(fs.doc(db,'users',user.uid,collection,String(id)));
        message('Deleted from your Google account.');
        return true;
      } catch (error) { friendlyError(error); return false; }
    },
    async cancelOrder(id) {
      try {
        const user = await readyUser();
        const ref = fs.doc(db,'users',user.uid,'orders',String(id));
        const listed = await fs.getDocs(fs.collection(db,'users',user.uid,'orders'));
        const orderDoc = listed.docs.find(doc => doc.id === String(id));
        if (!orderDoc) throw new Error('Order not found.');
        if (orderDoc.data().status === 'cancelled') return true;
        await fs.updateDoc(ref,{status:'cancelled'}); // EXACT only allowed update.
        message('Order status updated to cancelled.');
        return true;
      } catch (error) { friendlyError(error); return false; }
    },
    async bestGuess(score) {
      if (!Number.isInteger(score)||score<0||score>1000) return false;
      try {
        const user = await readyUser();
        const ref = fs.doc(db,'users',user.uid);
        await fs.runTransaction(db, async tx => {
          const snap = await tx.get(ref);
          if (!snap.exists()) throw new Error('Create a Google account first.');
          const old = snap.data().bestGuessScore;
          if (old === 0 || score < old)
            tx.update(ref,{bestGuessScore:score,updatedAt:fs.serverTimestamp()});
        });
        return true;
      } catch (error) { friendlyError(error); return false; }
    },
    async syncLocal() {
      if (!auth?.currentUser) return;
      try { await readyUser(); } catch (error) { friendlyError(error); return; }
      for (const key of Object.keys(localStorage)) {
        if (!key.startsWith('tclab.result.')) continue;
        try {
          const result = JSON.parse(localStorage.getItem(key));
          if (result?.testId && Number.isInteger(result.at))
            await this.save('testAttempts',result.testId+'-'+result.at,result);
        } catch (error) {
          friendlyError(error);
        }
      }
      const score = Number(localStorage.getItem('bestScore'));
      if (Number.isInteger(score) && score > 0 && score <= 1000)
        await this.bestGuess(score);
    },
    getUser() { return signedInUser; }
  };
  window.AakashAccount = api;

  // Popup MUST be started directly inside the user click, without awaiting
  // an initialization promise first; browsers otherwise block it.
  login.addEventListener('click', async () => {
    if (!auth || !au) { await prepareSignIn(); return; }
    clearDiagnostic();
    login.disabled = true;
    try {
      if (auth.currentUser) {
        await au.signOut(auth);
        localStorage.removeItem('aakash.cloud.enabled');
        return;
      }
      const pending = au.signInWithPopup(auth,googleProvider);
      const credential = await pending;
      if (!credential.user?.emailVerified)
        throw new Error('A verified Google account is required.');
      localStorage.setItem('aakash.cloud.enabled','1');
      if (profileReady && (await profileReady))
        await api.syncLocal();
      else message('Google sign-in succeeded, but Firestore saving needs attention.');
    } catch (error) { friendlyError(error); }
    finally {
      login.disabled = false;
      login.textContent = auth?.currentUser ? 'Sign out' : 'Continue with Google';
    }
  });

  // Old "bookmark this page" sent {url,title}, which violates the deployed
  // question-bookmark schema. Only a real current question is persisted.
  bookmark.addEventListener('click', async () => {
    const candidate = window.AakashTestCentre?.getCurrentBookmark?.();
    if (!candidate) {
      message('Open a test question to save a question bookmark.');
      return;
    }
    bookmark.disabled = true;
    const id = 'question-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
    try { await api.save('bookmarks',id,candidate); }
    finally { bookmark.disabled = false; }
  });

  saved.addEventListener('click', async () => {
    if (!auth?.currentUser) { message('Sign in first to view your cloud data.'); return; }
    const records = document.createElement('dialog');
    records.className = 'account-records';
    records.setAttribute('aria-label','Your saved data');
    const closeRecords = document.createElement('button');
    closeRecords.type = 'button';
    closeRecords.textContent = 'Close';
    closeRecords.addEventListener('click',()=>records.close());
    records.append(closeRecords);
    try {
      for(const collection of ['testAttempts','bookmarks','orders']) {
        const title = document.createElement('h3');
        title.textContent = ({
          testAttempts:'Test history',bookmarks:'Question bookmarks',orders:'Order history'
        })[collection];
        records.append(title);
        const rows = await api.list(collection);
        if (!rows.length) {
          const empty=document.createElement('p');empty.textContent='No saved records.';
          records.append(empty);
        }
        for(const item of rows) {
          const row = document.createElement('div');
          row.className = 'account-record';
          const description=document.createElement('p');
          description.textContent=collection==='testAttempts'
            ? item.exam+' · '+item.subject+' · '+item.score+'/'+item.maxScore
            : collection==='bookmarks'?item.question
              : item.orderCode+' · ₹'+item.totalInr+' · '+item.status;
          row.append(description);
          if(collection==='orders' && item.status==='confirmed') {
            const cancel = document.createElement('button');
            cancel.textContent='Cancel order';
            cancel.addEventListener('click', async()=>{
              if(await api.cancelOrder(item.id)){cancel.disabled=true;description.textContent+=' · cancelled';}
            });
            row.append(cancel);
          } else if(collection!=='orders'){
            const del=document.createElement('button');
            del.textContent='Delete';
            del.addEventListener('click',async()=>{
              if(await api.remove(collection,item.id))row.remove();
            });
            row.append(del);
          }
          records.append(row);
        }
      }
    } catch (error) { friendlyError(error); }
    document.body.append(records);
    records.addEventListener('close',()=>records.remove(),{once:true});
    records.showModal();
  });

  window.addEventListener('pagehide',()=>{
    // No Firestore onSnapshot listeners are installed. Cleanup the auth observer.
    if (unsubscribeAuth) { unsubscribeAuth(); unsubscribeAuth = null; }
  },{once:true});

  try {
    if (localStorage.getItem('aakash.cloud.enabled'))
      init().catch(friendlyError);
  } catch (_) { /* local-only mode works without browser storage */ }
})();
