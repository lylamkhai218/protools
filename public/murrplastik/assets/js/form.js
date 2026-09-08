/**
 * form.js — Xử lý form báo giá → Google Sheet
 * Setup: Thay SCRIPT_URL bằng URL của Google Apps Script sau khi deploy
 */

// ⚠️ THAY URL NÀY SAU KHI DEPLOY GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWZZRmnHPzarbavzuSIK2vKAu-VpqySVnvhB_hOtefOaV6GaYY-5EvcuPfrf5zkzCt/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const nameInput = form.querySelector('#f-name');
  const phoneInput = form.querySelector('#f-phone');
  const emailInput = form.querySelector('#f-email');
  const msgEl = form.querySelector('.form-msg');

  // Real-time validation
  const validators = {
    name: (val) => val.trim().length > 0 ? '' : (currentLang === 'vi' ? 'Họ tên không được để trống' : 'Name is required'),
    phone: (val) => {
      const clean = val.replace(/\s/g, '');
      if (!clean) return (currentLang === 'vi' ? 'Số điện thoại không được để trống' : 'Phone is required');
      const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
      return phoneRegex.test(clean) ? '' : (currentLang === 'vi' ? 'Số điện thoại không hợp lệ (10 số)' : 'Invalid phone number');
    },
    email: (val) => {
      if (!val.trim()) return '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim()) ? '' : (currentLang === 'vi' ? 'Email không hợp lệ' : 'Invalid email');
    }
  };

  const showFieldError = (input, error) => {
    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = error;
    input.classList.toggle('invalid', !!error);
  };

  [nameInput, phoneInput, emailInput].forEach(input => {
    const field = input.id.replace('f-', '');
    const validate = () => showFieldError(input, validators[field](input.value));
    
    input.addEventListener('input', validate);
    input.addEventListener('blur', validate);
  });



  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');

    // Final validation
    const nameErr = validators.name(nameInput.value);
    const phoneErr = validators.phone(phoneInput.value);
    const emailErr = validators.email(emailInput.value);

    showFieldError(nameInput, nameErr);
    showFieldError(phoneInput, phoneErr);
    showFieldError(emailInput, emailErr);

    if (nameErr || phoneErr || emailErr) {
      const firstErr = [nameErr, phoneErr, emailErr].find(e => e);
      showMsg(msgEl, 'error', firstErr);
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.setAttribute('data-i18n', 'form.sending');
    btn.textContent = t('form.sending');

    // Collect selected products
    const selectedProducts = Array.from(form.querySelectorAll('input[name="product"]:checked'))
      .map(el => {
        const textSpan = el.parentElement.querySelector('span[data-i18n]');
        return textSpan ? textSpan.textContent.trim() : el.value;
      })
      .join(', ');

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      company: form.querySelector('#f-company').value.trim(),
      product: selectedProducts || '(không chọn)',
      message: form.querySelector('#f-message').value.trim(),
      language: currentLang,
      source: window.location.href,
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Sending payload to GAS...', payload);
      
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      // Google Apps Script might return a redirect or a non-JSON response if there's an error
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn('Response is not JSON, checking status...');
        if (res.ok || res.status === 0) {
          // Status 0 might happen with some CORS/Redirect scenarios but data often still arrives
          data = { status: 'success' }; 
        } else {
          throw new Error('Server returned error status: ' + res.status);
        }
      }

      if (data && data.status === 'success') {
        console.log('Form submission successful');
        
        // Track Conversion in Google Analytics
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            'event_category': 'Form',
            'event_label': 'Quote Request'
          });
        }

        showSuccessPopup();
        form.reset();
        [nameInput, phoneInput, emailInput].forEach(i => i.classList.remove('invalid'));
        form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
      } else {
        throw new Error(data ? data.message : 'Unknown error');
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      // Even if fetch fails, if it was a CORS issue after a redirect, the data might have reached GAS.
      // But we show the error message to the user for safety.
      showMsg(msgEl, 'error', t('form.error') + ' (Network Error)');
    } finally {
      btn.disabled = false;
      btn.setAttribute('data-i18n', 'form.submit');
      btn.textContent = t('form.submit');
    }
  });
});

function showSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) {
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function showMsg(el, type, msg) {
  el.style.display = 'block';
  el.className = 'form-msg ' + type;
  el.textContent = msg;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => {
    el.style.display = 'none';
    el.className = 'form-msg';
  }, 8000);
}
